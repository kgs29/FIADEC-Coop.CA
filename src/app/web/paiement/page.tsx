"use client";

import {
  useCreatePaymentMutation,
  useGetPaymentMethodsQuery,
} from "@/store/apis/payment/payment.api";
import {
  CreatePaymentResponse,
  PaymentMethodConfig,
  PaymentMethodType,
} from "@/types/payment.types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Home,
  Loader,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

type Step = "amount" | "method" | "payment" | "done";

const DEFAULT_CURRENCY = "XOF";
const LOCALE_FR = "fr-FR";
const PAYMENT_STEPS: Step[] = ["amount", "method", "payment", "done"];

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

// ── Composant principal ───────────────────────────────────────────────────────

export default function PaiementPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("amount");
  const [amountData, setAmountData] = useState<{ amount: number; currency: string; description: string }>({ amount: 0, currency: DEFAULT_CURRENCY, description: "" });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(null);
  const [initResponse, setInitResponse] = useState<CreatePaymentResponse | null>(null);

  // Schemas defined inside component so they can use t()
  const step1Schema = z.object({
    amount: z.coerce.number().min(1, t("payment_amount_required")),
    currency: z.string(),
    description: z.string().optional(),
  });
  const step2Schema = z.object({
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

  type Step1 = z.infer<typeof step1Schema>;
  type Step2 = z.infer<typeof step2Schema>;
  type CardForm = z.infer<typeof cardSchema>;
  type PaypalForm = z.infer<typeof paypalSchema>;

  const { data: methods, isLoading: loadingMethods } = useGetPaymentMethodsQuery();
  const [createPayment, { isLoading: creating }] = useCreatePaymentMutation();

  const form1 = useForm<Step1>({ resolver: zodResolver(step1Schema), defaultValues: { currency: DEFAULT_CURRENCY } });
  const form2 = useForm<Step2>({ resolver: zodResolver(step2Schema) });
  const formCard = useForm<CardForm>({ resolver: zodResolver(cardSchema) });
  const formPaypal = useForm<PaypalForm>({ resolver: zodResolver(paypalSchema) });

  // Pré-remplir depuis les query params
  useEffect(() => {
    const amount = searchParams.get("amount");
    const description = searchParams.get("description");
    if (amount) form1.setValue("amount", Number(amount));
    if (description) form1.setValue("description", description);
  }, [searchParams, form1]);

  const isCardMethod = paymentMethod && paymentMethod !== "paypal";

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const onStep1 = (data: Step1) => {
    setAmountData({ amount: data.amount, currency: data.currency, description: data.description ?? "" });
    setStep("method");
  };

  const onStep2 = (data: Step2) => {
    setPaymentMethod(data.payment_method);
    setStep("payment");
  };

  const onPayCard = async (data: CardForm) => {
    if (!paymentMethod) return;
    try {
      const res = await createPayment({
        amount: amountData.amount,
        currency: amountData.currency,
        payment_method: paymentMethod,
        description: amountData.description,
        card_number: data.card_number.replace(/\s/g, ""),
        card_holder: data.card_holder,
        card_expiry: data.card_expiry,
        card_cvv: data.card_cvv,
      }).unwrap();

      setInitResponse(res);
      setStep("done");

      if (res.success) {
        toast.success(t("payment_accepted"));
      }
    } catch (err: unknown) {
      const error = err as { data?: { error?: string; card_number?: string[] } };
      const msg = error?.data?.error ?? error?.data?.card_number?.[0] ?? t("an_error_occurred");
      toast.error(msg);
    }
  };

  const onPayPaypal = async (data: PaypalForm) => {
    try {
      const res = await createPayment({
        amount: amountData.amount,
        currency: amountData.currency,
        payment_method: "paypal",
        description: amountData.description,
        payer_email: data.payer_email,
      }).unwrap();

      setInitResponse(res);
      setStep("done");

      if (res.success) {
        toast.success(t("payment_paypal_accepted"));
      }
    } catch (err: unknown) {
      const error = err as { data?: { error?: string; payer_email?: string[] } };
      const msg = error?.data?.error ?? error?.data?.payer_email?.[0] ?? t("an_error_occurred");
      toast.error(msg);
    }
  };

  const reset = () => {
    setStep("amount");
    setPaymentMethod(null);
    setInitResponse(null);
    form1.reset();
    form2.reset();
    formCard.reset();
    formPaypal.reset();
  };

  const cardNumber = formCard.watch("card_number") ?? "";
  const cardBrand = detectBrand(cardNumber);
  const currentStepIndex = PAYMENT_STEPS.indexOf(step);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-banner px-6 py-3 flex items-center gap-2 text-sm text-white/70">
        <Link href="/web" className="flex items-center gap-1 hover:text-white transition-colors">
          <Home className="h-3.5 w-3.5" />
          Accueil
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-white/40" />
        <span className="text-white font-medium">Paiement</span>
      </div>

      <div className="flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <CreditCard className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t("payment_online_title")}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t("payment_online_subtitle")}</p>
          </div>

          {/* Indicateur étapes */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {PAYMENT_STEPS.map((s, i) => {
              let dotClass = "bg-border";
              if (s === step) dotClass = "bg-primary scale-125";
              else if (i < currentStepIndex) dotClass = "bg-primary/50";
              return (
                <div key={s} className="flex items-center gap-1">
                  <div className={`w-2.5 h-2.5 rounded-full transition-colors ${dotClass}`} />
                  {i < 3 && <div className="w-6 h-px bg-border" />}
                </div>
              );
            })}
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-sm p-6">

            {/* ─── Étape 1 : Montant ─────────────────────────────────────────────── */}
            {step === "amount" && (
              <form onSubmit={form1.handleSubmit(onStep1)} className="space-y-5">
                <h2 className="text-lg font-semibold">{t("payment_amount_section")}</h2>
                <div className="space-y-1.5">
                  <label htmlFor="pay-amount" className="text-sm font-medium">{t("payment_amount")} <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <input
                      id="pay-amount"
                      type="number" step="1" min="1"
                      {...form1.register("amount")}
                      placeholder={t("payment_amount_placeholder")}
                      className="w-full pr-16 pl-3 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <select
                      {...form1.register("currency")}
                      defaultValue={DEFAULT_CURRENCY}
                      className="absolute right-1 top-1 bottom-1 px-2 text-xs bg-muted border-0 rounded-md focus:outline-none"
                    >
                      <option value={DEFAULT_CURRENCY}>{DEFAULT_CURRENCY}</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  {form1.formState.errors.amount && (
                    <p className="text-xs text-destructive">{form1.formState.errors.amount.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="pay-description" className="text-sm font-medium">{t("description")} <span className="text-muted-foreground">({t("optional")})</span></label>
                  <textarea
                    id="pay-description"
                    {...form1.register("description")}
                    rows={2}
                    placeholder={t("payment_description_placeholder")}
                    className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                  {t("continue")} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* ─── Étape 2 : Méthode ──────────────────────────────────────────────── */}
            {step === "method" && (
              <form onSubmit={form2.handleSubmit(onStep2)} className="space-y-5">
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setStep("amount")} className="p-1 hover:bg-muted rounded">
                    <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <h2 className="text-lg font-semibold">{t("payment_method_section")}</h2>
                </div>
                <div className="bg-muted/50 rounded-lg px-4 py-2 text-sm">
                  {t("payment_amount_label")} : <strong>{amountData.amount.toLocaleString(LOCALE_FR)} {amountData.currency}</strong>
                </div>

                {loadingMethods ? (
                  <div className="flex justify-center py-6"><Loader className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                ) : (
                  <div className="space-y-2">
                    {(methods ?? []).map((m: PaymentMethodConfig) => {
                      const meta = METHOD_META[m.method];
                      if (!meta) return null;
                      const selected = form2.watch("payment_method") === m.method;
                      return (
                        <label
                          key={m.method}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            selected ? "border-primary bg-primary/5" : `border-border hover:border-primary/40 ${meta.color}`
                          }`}
                        >
                          <input type="radio" {...form2.register("payment_method")} value={m.method} className="sr-only" />
                          <span className="text-xl">{meta.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{m.display_name || meta.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {m.min_amount.toLocaleString(LOCALE_FR)} - {m.max_amount.toLocaleString(LOCALE_FR)} {amountData.currency}
                            </p>
                          </div>
                          {selected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                        </label>
                      );
                    })}
                  </div>
                )}
                {form2.formState.errors.payment_method && (
                  <p className="text-xs text-destructive">{form2.formState.errors.payment_method.message}</p>
                )}
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                  {t("continue")} <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* ─── Étape 3 : Formulaire de paiement ───────────────────────────────── */}
            {step === "payment" && paymentMethod && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setStep("method")} className="p-1 hover:bg-muted rounded">
                    <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <h2 className="text-lg font-semibold">
                    {METHOD_META[paymentMethod]?.icon} {METHOD_META[paymentMethod]?.label}
                  </h2>
                </div>

                <div className="bg-muted/50 rounded-lg px-4 py-2 text-sm">
                  {t("payment_amount_label")} : <strong>{amountData.amount.toLocaleString(LOCALE_FR)} {amountData.currency}</strong>
                </div>

                {/* Formulaire carte */}
                {isCardMethod && (
                  <form onSubmit={formCard.handleSubmit(onPayCard)} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="card-number" className="text-sm font-medium flex items-center justify-between">
                        <span>{t("payment_card_number_label")} <span className="text-destructive">*</span></span>
                        <span className="text-xs text-muted-foreground font-semibold">
                          {cardBrand === "visa" && "VISA"}
                          {cardBrand === "mastercard" && "Mastercard"}
                          {cardBrand === "other" && <CreditCard className="h-4 w-4 inline" />}
                        </span>
                      </label>
                      <input
                        id="card-number"
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

                    <div className="space-y-1.5">
                      <label htmlFor="card-holder" className="text-sm font-medium">{t("payment_card_holder_label")} <span className="text-destructive">*</span></label>
                      <input
                        id="card-holder"
                        type="text"
                        placeholder={t("payment_card_holder_placeholder")}
                        {...formCard.register("card_holder")}
                        className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-sm uppercase focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {formCard.formState.errors.card_holder && (
                        <p className="text-xs text-destructive">{formCard.formState.errors.card_holder.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label htmlFor="card-expiry" className="text-sm font-medium">{t("payment_card_expiry_label")} <span className="text-destructive">*</span></label>
                        <input
                          id="card-expiry"
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
                        <label htmlFor="card-cvv" className="text-sm font-medium">{t("payment_card_cvv_label")} <span className="text-destructive">*</span></label>
                        <input
                          id="card-cvv"
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
                      {creating ? <><Loader className="h-4 w-4 animate-spin" /> {t("payment_processing")}</> : <>{t("payment_pay_button", { amount: amountData.amount.toLocaleString(LOCALE_FR), currency: amountData.currency })} <ArrowRight className="h-4 w-4" /></>}
                    </button>
                  </form>
                )}

                {/* Formulaire PayPal */}
                {paymentMethod === "paypal" && (
                  <form onSubmit={formPaypal.handleSubmit(onPayPaypal)} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="payer-email" className="text-sm font-medium">{t("payment_paypal_email_label")} <span className="text-destructive">*</span></label>
                      <input
                        id="payer-email"
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
                      {creating ? <><Loader className="h-4 w-4 animate-spin" /> {t("payment_processing")}</> : <>{t("payment_pay_button", { amount: amountData.amount.toLocaleString(LOCALE_FR), currency: amountData.currency })} <ArrowRight className="h-4 w-4" /></>}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ─── Étape 4 : Résultat ─────────────────────────────────────────────── */}
            {step === "done" && initResponse && (
              <div className="text-center space-y-5 py-4">
                {initResponse.success ? (
                  <>
                    <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto" />
                    <div>
                      <h3 className="text-xl font-bold">{t("payment_success_title")}</h3>
                      <p className="text-muted-foreground text-sm mt-1">{initResponse.message}</p>
                    </div>
                    <div className="bg-muted rounded-xl p-4 text-sm text-left space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("payment_amount")}</span>
                        <span className="font-semibold">{amountData.amount.toLocaleString(LOCALE_FR)} {amountData.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t("payment_method_label")}</span>
                        <span className="font-medium">{paymentMethod ? METHOD_META[paymentMethod]?.label : "-"}</span>
                      </div>
                      {initResponse.card_last4 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t("payment_card_label")}</span>
                          <span className="font-mono">•••• {initResponse.card_last4}</span>
                        </div>
                      )}
                      {initResponse.transaction_id && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t("transaction_id")}</span>
                          <span className="font-mono text-xs">{initResponse.transaction_id}</span>
                        </div>
                      )}
                      {initResponse.payment?.reference && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t("reference")}</span>
                          <span className="font-mono text-xs">{initResponse.payment.reference}</span>
                        </div>
                      )}
                    </div>
                    <button onClick={reset} className="w-full bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                      {t("payment_new")}
                    </button>
                  </>
                ) : (
                  <>
                    <XCircle className="h-14 w-14 text-red-500 mx-auto" />
                    <div>
                      <h3 className="text-xl font-bold">{t("payment_failed_title")}</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        {initResponse.message || initResponse.payment?.failure_reason || t("an_error_occurred")}
                      </p>
                    </div>
                    <button onClick={reset} className="w-full bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors">
                      {t("payment_retry")}
                    </button>
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
