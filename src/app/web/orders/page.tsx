"use client";

import { useGetMyOrdersQuery } from "@/store/apis/payment/order.api";
import {
  ChevronRight,
  Loader,
  Package,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const STATUS_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  pending: {
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    text: "text-yellow-800 dark:text-yellow-400",
    badge: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300",
  },
  confirmed: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-800 dark:text-blue-400",
    badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300",
  },
  completed: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-800 dark:text-green-400",
    badge: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300",
  },
  cancelled: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-800 dark:text-red-400",
    badge: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300",
  },
};

export default function OrdersPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data: ordersData, isLoading } = useGetMyOrdersQuery(
    `page=${page}&size=${pageSize}`
  );

  let content: React.ReactNode;
  if (isLoading) {
    content = (
      <div className="flex justify-center items-center py-20">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  } else if (!ordersData?.results || ordersData.results.length === 0) {
    content = (
      <div className="text-center py-20">
        <Package className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {t("no_orders")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("no_orders_yet")}
        </p>
        <Link
          href="/web/projects"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          {t("browse_projects")} <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    );
  } else {
    content = (
      <div className="space-y-4">
        {ordersData.results.map((order) => {
          const colors = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
          return (
            <Link
              key={order.id}
              href={`/web/orders/${order.id}`}
              className="block"
            >
              <div
                className={`border border-border rounded-lg p-6 hover:border-primary/50 transition-all hover:shadow-md cursor-pointer ${colors.bg}`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground text-lg">
                        {t("order_label")} {order.reference}
                      </h3>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors.badge}`}
                      >
                        {order.status_display}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.item_count} {order.item_count !== 1 ? t("projects_plural") : t("project_singular")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      {Number(order.total_amount).toLocaleString("fr-FR")} {order.currency}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-4">
                    <span className="text-muted-foreground">
                      {t("payment_method_label")}:{" "}
                      <span className="text-foreground font-medium">
                        {order.payment_method_display}
                      </span>
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          );
        })}

        {/* Pagination */}
        {ordersData.count > pageSize && (
          <div className="flex justify-between items-center mt-8 pt-8 border-t border-border">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("previous_page")}
            </button>
            <span className="text-sm text-muted-foreground">
              {t("page_of", { page, total: Math.ceil(ordersData.count / pageSize) })}
            </span>
            <button
              onClick={() =>
                setPage(Math.min(Math.ceil(ordersData.count / pageSize), page + 1))
              }
              disabled={page >= Math.ceil(ordersData.count / pageSize)}
              className="px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("next_page")}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">{t("my_orders")}</h1>
          </div>
          <p className="text-muted-foreground">
            {t("orders_subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {content}
      </div>
    </div>
  );
}
