import { Product } from './product.model';

export interface CartItem {
  id: number;           // client-side unique id (Date.now())
  product_id: number;
  product?: Product;
  quantity: number;
  color_id?: number;
  color_name?: string;
  type_id?: number;
  type_name?: string;
  price: number;
  total?: number;
  detail_id?: number;
  selectedOptions?: any[];
}

export interface Cart {
  items: CartItem[];
  total: number;
  items_count: number;
  price_sale?: number;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
  color_id?: number;
  type_id?: number;
}
