import { BasePagination } from "./base";
import { Payment, PaymentMethodType } from "./payment.types";

export type OrderStatusType =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface OrderItem {
  id: string;
  project: string;
  project_title?: string;
  project_slug?: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  created_at: string;
}

export interface Order {
  id: string;
  reference: string;
  total_amount: string;
  currency: string;
  payment_method: PaymentMethodType;
  payment_method_display: string;
  status: OrderStatusType;
  status_display: string;
  item_count?: number;
  user_username?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  payment?: Payment | null;
  notes?: string;
  shipping_address?: string;
}

export interface OrderItemPayload {
  project: string;
  quantity: number;
  unit_price: string;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
  payment_method: PaymentMethodType;
  notes?: string;
  shipping_address?: string;
  phone_number?: string;
  payer_email?: string;
  card_number?: string;
  card_holder?: string;
  card_expiry?: string;
  card_cvv?: string;
}

export interface CreateOrderResponse {
  order: OrderDetail;
  payment_info: {
    message?: string;
    bank_details?: Record<string, string>;
    instructions?: string | string[];
    redirect_url?: string;
    simulation_otp?: string;
    reference?: string;
    amount?: string;
    currency?: string;
    simulation_token?: string;
    // Mobile money
    mode?: "manual" | "api";
    merchant_number?: string;
    merchant_name?: string;
    momo_reference?: string;
    success?: boolean;
    transaction_id?: string;
    card_last4?: string;
    card_brand?: string;
  };
}

export type OrderPagination = BasePagination<Order>;
