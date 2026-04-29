import { CartItem } from './cart.model';
import { Address } from './address.model';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentMethod = 'cash_on_delivery' | 'online';

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  items: CartItem[];
  address?: Address;
  subtotal: number;
  shipping_cost: number;
  total: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface OrderRequest {
  address_id: number;
  payment_method: PaymentMethod;
  notes?: string;
  items: Array<{
    product_id: number;
    quantity: number;
    color_id?: number;
    type_id?: number;
  }>;
}

export interface ReturnOrderRequest {
  order_id: number;
  reason: string;
}

export interface OrderListResponse {
  data: Order[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
