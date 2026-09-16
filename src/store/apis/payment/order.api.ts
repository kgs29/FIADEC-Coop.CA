import { BASE_API_URL } from "@/constants/env";
import {
  CreateOrderPayload,
  CreateOrderResponse,
  OrderDetail,
  OrderPagination,
} from "@/types/order.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const prepareHeaders = (headers: Headers) => {
  const token = localStorage.getItem("access");
  if (token) {
    headers.set("authorization", `Bearer ${JSON.parse(token)}`);
  }
  return headers;
};

export const OrderApi = createApi({
  reducerPath: "OrderApi",
  tagTypes: ["Orders"],
  baseQuery: fetchBaseQuery({ baseUrl: BASE_API_URL, prepareHeaders }),
  endpoints: (builder) => ({
    // ── Utilisateur ─────────────────────────────────────────────────────────
    getMyOrders: builder.query<OrderPagination, string | void>({
      query: (params) => `paiements/orders/${params ? `?${params}` : ""}`,
      providesTags: ["Orders"],
    }),
    getOrder: builder.query<OrderDetail, string>({
      query: (id) => `paiements/orders/${id}/`,
      providesTags: ["Orders"],
    }),
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderPayload>({
      query: (data) => ({ url: "paiements/orders/", method: "POST", body: data }),
      invalidatesTags: ["Orders"],
    }),
    cancelOrder: builder.mutation<OrderDetail, string>({
      query: (id) => ({ url: `paiements/orders/${id}/cancel/`, method: "POST" }),
      invalidatesTags: ["Orders"],
    }),

    // ── Admin ────────────────────────────────────────────────────────────────
    getAllOrders: builder.query<OrderPagination, string | void>({
      query: (params) => `paiements/orders/${params ? `?${params}` : ""}`,
      providesTags: ["Orders"],
    }),
    confirmOrder: builder.mutation<OrderDetail, string>({
      query: (id) => ({ url: `paiements/orders/${id}/confirm/`, method: "POST" }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useCancelOrderMutation,
  useGetAllOrdersQuery,
  useConfirmOrderMutation,
} = OrderApi;
