import { BASE_API_URL } from "@/constants/env";
import {
  AdminActionPayload,
  CreatePaymentPayload,
  CreatePaymentResponse,
  Payment,
  PaymentMethodConfig,
  PaymentPagination,
} from "@/types/payment.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const prepareHeaders = (headers: Headers) => {
  const raw = localStorage.getItem("access");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      headers.set("authorization", `Bearer ${parsed}`);
    } catch {
      headers.set("authorization", `Bearer ${raw}`);
    }
  }
  return headers;
};

export const PaymentApi = createApi({
  reducerPath: "PaymentApi",
  tagTypes: ["Payments"],
  refetchOnFocus: true,
  refetchOnMountOrArgChange: true,
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL, prepareHeaders }),
  endpoints: (builder) => ({
    // ── Public ──────────────────────────────────────────────────────────────
    getPaymentMethods: builder.query<PaymentMethodConfig[], void>({
      query: () => "paiements/methods/",
    }),

    // ── Utilisateur ─────────────────────────────────────────────────────────
    getMyPayments: builder.query<PaymentPagination, string | void>({
      query: (params) => (params ? `paiements/payments/?${params}` : "paiements/payments/"),
      providesTags: ["Payments"],
    }),
    getPayment: builder.query<Payment, string>({
      query: (id) => `paiements/payments/${id}/`,
      providesTags: ["Payments"],
    }),
    createPayment: builder.mutation<CreatePaymentResponse, CreatePaymentPayload>({
      query: (data) => ({ url: "paiements/payments/", method: "POST", body: data }),
      invalidatesTags: ["Payments"],
    }),
    cancelPayment: builder.mutation<Payment, string>({
      query: (id) => ({ url: `paiements/payments/${id}/cancel/`, method: "POST" }),
      invalidatesTags: ["Payments"],
    }),

    // ── Admin ────────────────────────────────────────────────────────────────
    getAllPayments: builder.query<PaymentPagination, string | void>({
      query: (params) => (params ? `paiements/payments/?${params}` : "paiements/payments/"),
      providesTags: ["Payments"],
    }),
    adminConfirmPayment: builder.mutation<Payment, { id: string; data: AdminActionPayload }>({
      query: ({ id, data }) => ({
        url: `paiements/payments/${id}/admin-confirm/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payments"],
    }),
    adminRejectPayment: builder.mutation<Payment, { id: string; data: AdminActionPayload }>({
      query: ({ id, data }) => ({
        url: `paiements/payments/${id}/admin-reject/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payments"],
    }),
    adminRefundPayment: builder.mutation<Payment, { id: string; data: AdminActionPayload }>({
      query: ({ id, data }) => ({
        url: `paiements/payments/${id}/admin-refund/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payments"],
    }),
  }),
});

export const {
  useGetPaymentMethodsQuery,
  useGetMyPaymentsQuery,
  useGetPaymentQuery,
  useCreatePaymentMutation,
  useCancelPaymentMutation,
  useGetAllPaymentsQuery,
  useAdminConfirmPaymentMutation,
  useAdminRejectPaymentMutation,
  useAdminRefundPaymentMutation,
} = PaymentApi;
