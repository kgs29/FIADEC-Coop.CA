"use client";

import { useCreateOrderMutation } from "@/store/apis/payment/order.api";
import { useGetPaymentMethodsQuery } from "@/store/apis/payment/payment.api";
import { ProjectDetail } from "@/types/project.types";
import { CreateOrderResponse, OrderDetail } from "@/types/order.types";
import { PaymentMethodConfig, PaymentMethodType } from "@/types/payment.types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader,
  ShoppingCart,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

// ── Types locaux ──────────────────────────────────────────────────────────────

type Step = "confirm" | "method" | "payment" | "done";

const LOCALE = "fr-FR";
const CURRENCY = "XOF";

// ── Méta méthodes ─────────────────────────────────────────────────────────────

const METHOD_META: Record<PaymentMethodType, { icon: string; color: string; label: string }> = {
  paypal: { icon: "💙", color: "border-blue-200 bg-blue-50", label: "PayPal" },
  orange_virtual_card: { icon: "🟠", color: "border-orange-200 bg-orange-50", label: "Carte Orange (Mastercard)" },
  mtn_virtual_card: { icon: "🟡", color: "border-yellow-200 bg-yellow-50", label: "Carte MTN (Mastercard)" },
  bank_card: { icon: "💳", color: "border-gray-200 bg-gray-50", label: "Carte bancaire (Visa / Mastercard)" },
};

// ── Détection marque carte ────────────────────────────────────────────────────

function detectBrand(number: string): "visa" | "mastercard" | "other" {
  const digits = number.replace(/\s/g, "");
  if (digits.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(digits)) return "mastercard";
  return "other";
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  project: ProjectDetail;
  onClose: () => void;
}

// ── Composant principal ───────────────────────────────────────────────────────

export default function PurchaseModal({ project, onClose }: Props) {
  const { t } = useTranslation();

  // Schemas defined inside component so they can use t()
  const methodSchema = z.object({
    payment_method: z.enum(
      ["paypal", "orange_virtual_card", "mtn_virtual_card", "bank_card"],
      { required_error: t("payment_choose_method") }
    ),
  });
  const cardSchema = z.object({
    card_number: z.string().min(12, t("payment_card_number_invalid")),
    card_holder: z.string().min(2, t("payment_card_holder_required")),
    card_expiry: z.string().regex(/^\d{2}\/\d{2}$/, t("payment_card_expiry_format")),
    card_cvv: z.string().min(3, t("payment_card_cvv_invalid")).max(4, t("payment_card_cvv_invalid")),
  });
  const paypalSchema = z.object({
    payer_email: z.string().email(t("payment_email_invalid")),
  });
  type MethodForm = z.infer<typeof methodSchema>;
  type CardForm = z.infer<typeof cardSchema>;
  type PaypalForm = z.infer<typeof paypalSchema>;

  const [step, setStep] = useState<Step>("confirm");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(null);
  const [orderResponse, setOrderResponse] = useState<CreateOrderResponse | null>(null);
  const [createdOrder, setCreatedOrder] = useState<OrderDetail | null>(null);

  const { data: methods, isLoading: loadingMethods } = useGetPaymentMethodsQuery();
  const [createOrder, { isLoading: creating }] = useCreateOrderMutation();

  const formMethod = useForm<MethodForm>({ resolver: zodResolver(methodSchema) });
  const formCard = useForm<CardForm>({ resolver: zodResolver(cardSchema) });
  const formPaypal = useForm<PaypalForm>({ resolver: zodResolver(paypalSchema) });

  const price = project.price ? Number(project.price) : 0;
  const isCardMethod = paymentMethod && paymentMethod !== "paypal";

  // Bloquer le scroll quand la modale est ouverte
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Formatage numéro de carte ─────────────────────────────────────────────

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  // ── Étape 2 : sélection méthode ───────────────────────────────────────────

  const onSelectMethod = (data: MethodForm) => {
    setPaymentMethod(data.payment_method);
    setStep("payment");
  };

  // ── Étape 3 : paiement carte ──────────────────────────────────────────────

  const onPayCard = async (data: CardForm) => {
    if (!paymentMethod) return;
    try {
      const res = await createOrder({
        items: [{ project: project.id, quantity: 1, unit_price: String(price) }],
        payment_method: paymentMethod,
        notes: `Achat projet : ${project.title}`,
        card_number: data.card_number.replace(/\s/g, ""),
        card_holder: data.card_holder,
        card_expiry: data.card_expiry,
        card_cvv: data.card_cvv,
      }).unwrap();

      setOrderResponse(res);
      setCreatedOrder(res.order);
      setStep("done");

      if (res.payment_info.success) {
        toast.success(t("payment_accepted"));
      }
    } catch (err: unknown) {
      const error = err as { data?: { error?: string; card_number?: string[] } };
      const msg =
        error?.data?.error ??
        error?.data?.card_number?.[0] ??
        t("an_error_occurred");
      toast.error(msg);
    }
  };

  // ── Étape 3 : paiement PayPal ─────────────────────────────────────────────

  const onPayPaypal = async (data: PaypalForm) => {
    try {
      const res = await createOrder({
        items: [{ project: project.id, quantity: 1, unit_price: String(price) }],
        payment_method: "paypal",
        notes: `Achat projet : ${project.title}`,
        payer_email: data.payer_email,
      }).unwrap();

      setOrderResponse(res);
      setCreatedOrder(res.order);
      setStep("done");

      if (res.payment_info.success) {
        toast.success(t("payment_paypal_accepted"));
      }
    } catch (err: unknown) {
      const error = err as { data?: { error?: string; payer_email?: string[] } };
      const msg =
        error?.data?.error ??
        error?.data?.payer_email?.[0] ??
        t("an_error_occurred");
      toast.error(msg);
    }
  };

  const handleReset = () => {
    setStep("confirm");
    setPaymentMethod(null);
    setOrderResponse(null);
    setCreatedOrder(null);
    formMethod.reset();
    formCard.reset();
    formPaypal.reset();
  };

  const cardNumber = formCard.watch("card_number") ?? "";
  const cardBrand = detectBrand(cardNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">{t("purchase_modal_title")}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">

          {/* ── Confirmation ─────────────────────────────────────────── */}
          {step === "confirm" && (
            <div className="space-y-5">
              <div className="bg-muted/50 rounded-xl p-4 flex gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">{t("Dashboard.sidebar.projects")}</p>
                  <p className="font-semibold text-sm leading-tight line-clamp-2">{project.title}</p>
                  {project.excerpt && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{project.excerpt}</p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs text-muted-foreground mb-1">{t("payment_amount")}</p>
                  <p className="text-2xl font-bold text-primary">
                    {price.toLocaleString(LOCALE)} <span className="text-sm font-normal">{CURRENCY}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStep("method")}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
              >
                {t("purchase_continue_to_payment")} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── Méthode de paiement ──────────────────────────────────── */}
          {step === "method" && (
            <form onSubmit={formMethod.handleSubmit(onSelectMethod)} className="space-y-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setStep("confirm")} className="p-1 hover:bg-muted rounded">
                  <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                </button>
                <h3 className="font-semibold">{t("payment_method_section")}</h3>
              </div>

              {loadingMethods ? (
                <div className="flex justify-center py-6"><Loader className="h-5 w-5 animate-spin text-muted-foreground" /></div>
              ) : (
                <div className="space-y-2">
                  {(methods ?? []).map((m: PaymentMethodConfig) => {
                    const meta = METHOD_META[m.method as PaymentMethodType];
                    if (!meta) return null;
                    const selected = formMethod.watch("payment_method") === m.method;
                    return (
                      <label
                        key={m.method}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          selected ? "border-primary bg-primary/5" : `border-border hover:border-primary/40 ${meta.color}`
                        }`}
                      >
                        <input type="radio" {...formMethod.register("payment_method")} value={m.method} className="sr-only" />
                        <span className="text-xl">{meta.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{m.display_name || meta.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {m.min_amount.toLocaleString(LOCALE)} - {m.max_amount.toLocaleString(LOCALE)} {CURRENCY}
                          </p>
                        </div>
                        {selected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                      </label>
                    );
                  })}
                </div>
              )}
              {formMethod.formState.errors.payment_method && (
                <p className="text-xs text-destructive">{formMethod.formState.errors.payment_method.message}</p>
              )}
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                {t("continue")} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* ── Formulaire de paiement ───────────────────────────────── */}
          {step === "payment" && paymentMethod && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setStep("method")} className="p-1 hover:bg-muted rounded">
                  <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                </button>
                <h3 className="font-semibold">
                  {METHOD_META[paymentMethod]?.icon} {METHOD_META[paymentMethod]?.label}
                </h3>
              </div>

              <div className="bg-muted/50 rounded-lg px-4 py-2 text-sm">
                {t("payment_amount_label")} : <strong>{price.toLocaleString(LOCALE)} {CURRENCY}</strong>
              </div>

              {/* Formulaire carte */}
              {isCardMethod && (
                <form onSubmit={formCard.handleSubmit(onPayCard)} className="space-y-4">
                  {/* Numéro de carte */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center justify-between">
                      <span>{t("payment_card_number_label")} <span className="text-destructive">*</span></span>
                      <span className="text-xs text-muted-foreground font-semibold">
                        {cardBrand === "visa" && "VISA"}
                        {cardBrand === "mastercard" && "Mastercard"}
                        {cardBrand === "other" && <CreditCard className="h-4 w-4 inline" />}
                      </span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={19}
                      placeholder={t("payment_card_placeholder")}
                      {...formCard.register("card_number")}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        formCard.setValue("card_number", formatted);
                      }}
                      className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {formCard.formState.errors.card_number && (
                      <p className="text-xs text-destructive">{formCard.formState.errors.card_number.message}</p>
                    )}
                  </div>

                  {/* Titulaire */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">{t("payment_card_holder_label")} <span className="text-destructive">*</span></label>
                    <input
                      type="text"
                      placeholder={t("payment_card_holder_placeholder")}
                      {...formCard.register("card_holder")}
                      className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm uppercase focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {formCard.formState.errors.card_holder && (
                      <p className="text-xs text-destructive">{formCard.formState.errors.card_holder.message}</p>
                    )}
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">{t("payment_card_expiry_label")} <span className="text-destructive">*</span></label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        placeholder="MM/YY"
                        {...formCard.register("card_expiry")}
                        onChange={(e) => {
                          const formatted = formatExpiry(e.target.value);
                          formCard.setValue("card_expiry", formatted);
                        }}
                        className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {formCard.formState.errors.card_expiry && (
                        <p className="text-xs text-destructive">{formCard.formState.errors.card_expiry.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">{t("payment_card_cvv_label")} <span className="text-destructive">*</span></label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="•••"
                        {...formCard.register("card_cvv")}
                        className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {formCard.formState.errors.card_cvv && (
                        <p className="text-xs text-destructive">{formCard.formState.errors.card_cvv.message}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {creating ? <><Loader className="h-4 w-4 animate-spin" /> {t("payment_processing")}</> : <>{t("payment_pay_button", { amount: price.toLocaleString(LOCALE), currency: CURRENCY })} <ArrowRight className="h-4 w-4" /></>}
                  </button>
                </form>
              )}

              {/* Formulaire PayPal */}
              {paymentMethod === "paypal" && (
                <form onSubmit={formPaypal.handleSubmit(onPayPaypal)} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">{t("payment_paypal_email_label")} <span className="text-destructive">*</span></label>
                    <input
                      type="email"
                      placeholder={t("payment_paypal_email_placeholder")}
                      {...formPaypal.register("payer_email")}
                      className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {formPaypal.formState.errors.payer_email && (
                      <p className="text-xs text-destructive">{formPaypal.formState.errors.payer_email.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {creating ? <><Loader className="h-4 w-4 animate-spin" /> {t("payment_processing")}</> : <>{t("payment_pay_button", { amount: price.toLocaleString(LOCALE), currency: CURRENCY })} <ArrowRight className="h-4 w-4" /></>}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ── Résultat ─────────────────────────────────────────────── */}
          {step === "done" && createdOrder && orderResponse && (
            <div className="text-center space-y-5 py-4">
              {orderResponse.payment_info.success ? (
                <>
                  <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold">{t("payment_success_title")}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{t("purchase_confirmed")}</p>
                  </div>
                  <div className="bg-muted rounded-xl p-4 text-sm text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("reference")}</span>
                      <span className="font-mono text-xs">{createdOrder.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("Dashboard.sidebar.projects")}</span>
                      <span className="font-medium truncate ml-4 text-right">{project.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("payment_amount")}</span>
                      <span className="font-semibold">{price.toLocaleString(LOCALE)} {CURRENCY}</span>
                    </div>
                    {orderResponse.payment_info.card_last4 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("payment_card_label")}</span>
                        <span className="font-mono">•••• {orderResponse.payment_info.card_last4}</span>
                      </div>
                    )}
                    {orderResponse.payment_info.transaction_id && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("transaction_id")}</span>
                        <span className="font-mono text-xs">{orderResponse.payment_info.transaction_id}</span>
                      </div>
                    )}
                  </div>
                  <button onClick={onClose} className="w-full bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                    {t("close")}
                  </button>
                </>
              ) : (
                <>
                  <XCircle className="h-14 w-14 text-red-500 mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold">{t("payment_failed_title")}</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {orderResponse.payment_info.message || createdOrder.payment?.failure_reason || t("an_error_occurred")}
                    </p>
                  </div>
                  <button onClick={handleReset} className="w-full bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                    {t("payment_retry")}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
