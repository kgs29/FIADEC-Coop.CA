"use client";

import { useGetOrderQuery, useCancelOrderMutation } from "@/store/apis/payment/order.api";
import {
  AlertCircle,
  ArrowLeft,
  Loader,
  Package,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const LOCALE_FR = "fr-FR";

const STATUS_COLORS: Record<string, { bg: string; text: string; badge: string; canCancel: boolean }> = {
  pending: {
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    text: "text-yellow-800 dark:text-yellow-400",
    badge: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300",
    canCancel: true,
  },
  confirmed: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-800 dark:text-blue-400",
    badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300",
    canCancel: true,
  },
  completed: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-800 dark:text-green-400",
    badge: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300",
    canCancel: false,
  },
  cancelled: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-800 dark:text-red-400",
    badge: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300",
    canCancel: false,
  },
};

export default function OrderDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const orderId = params.id as string;
  const { data: order, isLoading } = useGetOrderQuery(orderId);
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancel = async () => {
    try {
      await cancelOrder(orderId).unwrap();
      toast.success(t("order_cancelled_success"));
      setShowConfirm(false);
    } catch (err: any) {
      toast.error(err?.data?.error || t("order_cancel_error"));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h1 className="text-xl font-semibold text-foreground mb-2">{t("order_not_found")}</h1>
        <Link
          href="/web/orders"
          className="text-primary hover:underline flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back_to_orders")}
        </Link>
      </div>
    );
  }

  const colors = STATUS_COLORS[order.status] || STATUS_COLORS.pending;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/web/orders"
            className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("my_orders")}
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className={`rounded-lg p-6 mb-8 ${colors.bg}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t("order_label")} {order.reference}
              </h1>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}>
                {order.status_display}
              </span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">
                {Number(order.total_amount).toLocaleString(LOCALE_FR)} {order.currency}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString(LOCALE_FR, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Projets */}
          <div className="lg:col-span-2 space-y-4">
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t("Dashboard.sidebar.projects")} ({order.items?.length || 0})
              </h2>
              <div className="space-y-3 divide-y divide-border">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex justify-between gap-4 mb-1">
                        <Link
                          href={`/web/projects/${item.project_slug || item.project}`}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {item.project_title}
                        </Link>
                        <p className="font-semibold text-foreground">
                          {Number(item.total_price).toLocaleString(LOCALE_FR)} {order.currency}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × {Number(item.unit_price).toLocaleString(LOCALE_FR)} {order.currency}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">{t("no_project_items")}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">{t("notes")}</h3>
                <p className="text-muted-foreground text-sm">{order.notes}</p>
              </div>
            )}

            {/* Adresse de livraison */}
            {order.shipping_address && (
              <div className="border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  Adresse de livraison
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {order.shipping_address}
                </p>
              </div>
            )}
          </div>

          {/* Barre latérale */}
          <div className="space-y-4">
            {/* Paiement */}
            <div className="border border-border rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">{t("payment")}</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">{t("payment_method_label")}</p>
                  <p className="font-medium text-foreground">
                    {order.payment_method_display}
                  </p>
                </div>
                {order.payment && (
                  <>
                    <div>
                      <p className="text-muted-foreground">{t("reference")}</p>
                      <p className="font-mono font-medium text-foreground">
                        {order.payment.reference}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("status")}</p>
                      <p className="font-medium text-foreground">
                        {order.payment.status_display}
                      </p>
                    </div>
                    {order.payment.transaction_id && (
                      <div>
                        <p className="text-muted-foreground">{t("transaction_id")}</p>
                        <p className="font-mono text-xs text-foreground break-all">
                          {order.payment.transaction_id}
                        </p>
                      </div>
                    )}
                    {order.payment.paid_at && (
                      <div>
                        <p className="text-muted-foreground">{t("paid_at")}</p>
                        <p className="font-medium text-foreground">
                          {new Date(order.payment.paid_at).toLocaleDateString(LOCALE_FR)}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            {colors.canCancel && !showConfirm && (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                {t("cancel_order")}
              </button>
            )}

            {/* Confirmation */}
            {showConfirm && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  {t("do_you_really_want_to_delete")}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                  >
                    {cancelling ? "…" : t("confirm")}
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium transition-colors"
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
