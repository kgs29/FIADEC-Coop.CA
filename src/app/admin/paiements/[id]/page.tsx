"use client";

import UrlGuard from "@/lib/UrlGuard";
import {
  useAdminConfirmPaymentMutation,
  useAdminRefundPaymentMutation,
  useAdminRejectPaymentMutation,
  useGetPaymentQuery,
} from "@/store/apis/payment/payment.api";
import { PaymentStatusType } from "@/types/payment.types";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  CreditCard,
  RefreshCw,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const STATUS_STYLE: Record<PaymentStatusType, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
  refunded: "bg-purple-100 text-purple-700",
};

const METHOD_LABEL: Record<string, string> = {
  bank_transfer: "🏦 Virement bancaire",
  paypal: "💳 PayPal",
  orange_money: "🟠 Orange Money",
  mtn_money: "🟡 MTN Mobile Money",
};

const LOCALE_FR = "fr-FR";

function PaymentDetailContent() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: payment, isFetching } = useGetPaymentQuery(id);
  const [txnId, setTxnId] = useState("");
  const [reason, setReason] = useState("");

  const [confirmPayment, { isLoading: confirming }] = useAdminConfirmPaymentMutation();
  const [rejectPayment, { isLoading: rejecting }] = useAdminRejectPaymentMutation();
  const [refundPayment, { isLoading: refunding }] = useAdminRefundPaymentMutation();

  const handleConfirm = async () => {
    if (!confirm(t("confirm_payment_prompt"))) return;
    try {
      await confirmPayment({ id, data: { transaction_id: txnId, reason } }).unwrap();
      toast.success(t("payment_confirmed"));
      setTxnId("");
      setReason("");
    } catch {
      toast.error(t("confirm_payment_error"));
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error(t("reason_required"));
      return;
    }
    try {
      await rejectPayment({ id, data: { reason } }).unwrap();
      toast.success(t("payment_rejected"));
      setReason("");
    } catch {
      toast.error(t("reject_payment_error"));
    }
  };

  const handleRefund = async () => {
    if (!confirm(t("confirm_refund_prompt"))) return;
    try {
      await refundPayment({ id, data: { reason } }).unwrap();
      toast.success(t("payment_refunded"));
    } catch {
      toast.error(t("refund_payment_error"));
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">{t("payment_not_found")}</p>
      </div>
    );
  }

  const canConfirm = payment.status === "processing";
  const canRefund = payment.status === "completed";

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/paiements"
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {payment.reference}
          </h1>
          <p className="text-sm text-muted-foreground">{t("payment_detail")}</p>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLE[payment.status]}`}>
          {payment.status_display}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations générales */}
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-foreground">{t("general_info")}</h2>
          {[
            [t("reference"), payment.reference],
            [t("payment_amount"), `${Number(payment.amount).toLocaleString(LOCALE_FR)} ${payment.currency}`],
            [t("payment_method_label"), METHOD_LABEL[payment.payment_method] ?? payment.payment_method_display],
            [t("status"), payment.status_display],
            [t("description"), payment.description || "—"],
            [t("user"), payment.user_username ?? "—"],
            [t("email"), payment.user_email ?? "—"],
            [t("phone_number"), "—"],
            [t("payer_email"), payment.payer_email || "—"],
            [t("transaction_id"), payment.transaction_id || "—"],
            [t("paid_at"), payment.paid_at ? new Date(payment.paid_at).toLocaleString(LOCALE_FR) : "—"],
            [t("created_at"), new Date(payment.created_at).toLocaleString(LOCALE_FR)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm border-b border-border pb-2 last:border-0">
              <span className="text-muted-foreground">{label}</span>
              <span className="text-foreground font-medium text-right">{value}</span>
            </div>
          ))}
          {payment.failure_reason && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
              <strong>Raison d&apos;échec :</strong> {payment.failure_reason}
            </div>
          )}
        </div>

        {/* Actions admin */}
        <div className="space-y-4">
          {(canConfirm || canRefund) && (
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h2 className="font-semibold text-foreground">{t("admin_actions")}</h2>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t("external_transaction_id")}</label>
                <input
                  type="text"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  placeholder={t("txn_id_placeholder")}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">{t("reason_comment")}</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {canConfirm && (
                  <>
                    <button
                      onClick={handleConfirm}
                      disabled={confirming}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {confirming ? t("confirming") : t("confirm_payment_btn")}
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={rejecting}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg disabled:opacity-50 transition-colors"
                    >
                      <XCircle className="h-4 w-4" />
                      {rejecting ? t("rejecting") : t("reject_btn")}
                    </button>
                  </>
                )}
                {canRefund && (
                  <button
                    onClick={handleRefund}
                    disabled={refunding}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {refunding ? t("refunding") : t("refund_btn")}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Journal d'événements */}
          {payment.events && payment.events.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="font-semibold text-foreground mb-4">{t("events_journal")}</h2>
              <ol className="relative border-l border-border space-y-4">
                {payment.events.map((evt) => (
                  <li key={evt.id} className="ml-4">
                    <span className="absolute -left-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                    <p className="text-sm font-medium text-foreground">{evt.event_type}</p>
                    {evt.description && (
                      <p className="text-xs text-muted-foreground">{evt.description}</p>
                    )}
                    <time className="text-xs text-muted-foreground/60">
                      {new Date(evt.created_at).toLocaleString(LOCALE_FR)}
                    </time>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {payment.status === "pending" && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 flex gap-3 text-sm text-yellow-800 dark:text-yellow-400">
              <Clock className="h-5 w-5 shrink-0 mt-0.5" />
              <p>{t("payment_pending_init")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentDetailPage() {
  return (
    <UrlGuard permission="add_logentry">
      <PaymentDetailContent />
    </UrlGuard>
  );
}
