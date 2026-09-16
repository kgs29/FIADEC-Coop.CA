import { BasePagination } from "./base";

export type PaymentMethodType =
  | "paypal"
  | "orange_virtual_card"
  | "mtn_virtual_card"
  | "bank_card";

export type PaymentStatusType =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded";

export interface PaymentMethodConfig {
  method: PaymentMethodType;
  method_display: string;
  display_name: string;
  description: string;
  is_enabled: boolean;
  min_amount: number;
  max_amount: number;
}

export interface PaymentEvent {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
}

export interface Payment {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  payment_method: PaymentMethodType;
  payment_method_display: string;
  status: PaymentStatusType;
  status_display: string;
  description: string;
  payer_email?: string;
  transaction_id?: string;
  paid_at?: string | null;
  created_at: string;
  updated_at: string;
  user_username?: string;
  user_email?: string;
  failure_reason?: string;
  metadata?: Record<string, unknown>;
  events?: PaymentEvent[];
}

export interface CreatePaymentPayload {
  amount: number;
  currency?: string;
  payment_method: PaymentMethodType;
  description?: string;
  // Carte bancaire
  card_number?: string;
  card_holder?: string;
  card_expiry?: string;
  card_cvv?: string;
  // PayPal
  payer_email?: string;
}

export interface CreatePaymentResponse {
  payment: Payment;
  success: boolean;
  message?: string;
  transaction_id?: string;
  card_last4?: string;
  card_brand?: string;
}

export interface AdminActionPayload {
  transaction_id?: string;
  reason?: string;
}

export type PaymentPagination = BasePagination<Payment>;
