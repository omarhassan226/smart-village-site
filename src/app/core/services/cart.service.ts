import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models';
import { Product } from '../models/product.model';

const CART_KEY = 'sv_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _cart$ = new BehaviorSubject<Cart>(this.loadFromStorage());
  cart$ = this._cart$.asObservable();

  /** Controls the cart sidebar open/close state */
  private _sidebarOpen$ = new BehaviorSubject<boolean>(false);
  sidebarOpen$ = this._sidebarOpen$.asObservable();

  // ── Storage helpers ──────────────────────────────────────────────────────

  private loadFromStorage(): Cart {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : { items: [], total: 0, items_count: 0 };
    } catch {
      return { items: [], total: 0, items_count: 0 };
    }
  }

  private saveToStorage(cart: Cart): void {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  private recalculate(items: CartItem[]): Cart {
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const items_count = items.length;
    return { items, total, items_count };
  }

  private commit(cart: Cart): void {
    this.saveToStorage(cart);
    this._cart$.next(cart);
  }

  // ── Public API ───────────────────────────────────────────────────────────

  get cart(): Cart {
    return this._cart$.value;
  }

  get count(): number {
    return this._cart$.value.items_count;
  }

  /** Add or increase qty for a product. Opens the sidebar automatically. */
  addProduct(
    product: Product,
    quantity = 1,
    colorId?: number,
    colorName?: string,
    typeId?: number,
    typeName?: string,
    unitPrice?: number
  ): void {
    const items = [...this._cart$.value.items];
    const idx = items.findIndex(
      (i) => i.product_id === product.id && i.color_id === colorId && i.type_id === typeId
    );

    const price = unitPrice ?? product.price;

    if (idx > -1) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
    } else {
      const newItem: CartItem = {
        id: Date.now(), // client-side unique id
        product_id: product.id,
        product,
        quantity,
        color_id: colorId,
        color_name: colorName,
        type_id: typeId,
        type_name: typeName,
        price,
        total: price * quantity,
      };
      items.push(newItem);
    }

    this.commit(this.recalculate(items));
    this.openSidebar();
  }

  /** Update quantity of an item (by client id) */
  updateQuantity(itemId: number, quantity: number): void {
    if (quantity < 1) return;
    const items = this._cart$.value.items.map((i) =>
      i.id === itemId ? { ...i, quantity, total: i.price * quantity } : i
    );
    this.commit(this.recalculate(items));
  }

  /** Remove an item by client id */
  remove(itemId: number): void {
    const items = this._cart$.value.items.filter((i) => i.id !== itemId);
    this.commit(this.recalculate(items));
  }

  /** Clear the entire cart */
  clear(): void {
    const empty: Cart = { items: [], total: 0, items_count: 0 };
    this.commit(empty);
  }

  /** Check if product (with optional variant) is in cart */
  isInCart(productId: number, colorId?: number, typeId?: number): boolean {
    return this._cart$.value.items.some(
      (i) =>
        i.product_id === productId &&
        (colorId === undefined || i.color_id === colorId) &&
        (typeId === undefined || i.type_id === typeId)
    );
  }

  // ── Sidebar ──────────────────────────────────────────────────────────────

  openSidebar(): void {
    this._sidebarOpen$.next(true);
  }

  closeSidebar(): void {
    this._sidebarOpen$.next(false);
  }

  toggleSidebar(): void {
    this._sidebarOpen$.next(!this._sidebarOpen$.value);
  }

  /**
   * Build the order payload to submit to the backend.
   * Returns an array of items the backend expects.
   */
  buildOrderPayload(): Array<{ product_id: number; quantity: number; color_id?: number; type_id?: number }> {
    return this._cart$.value.items.map((i) => ({
      product_id: i.product_id,
      quantity: i.quantity,
      color_id: i.color_id,
      type_id: i.type_id,
    }));
  }
}
