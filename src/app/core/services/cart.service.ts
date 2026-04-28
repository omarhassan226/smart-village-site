import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cart, CartItem, AddToCartRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private base = environment.apiUrl;
  private _cart$ = new BehaviorSubject<Cart>({ items: [], total: 0, items_count: 0 });
  cart$ = this._cart$.asObservable();

  constructor(private http: HttpClient) {}

  get cart(): Cart {
    return this._cart$.value;
  }

  get count(): number {
    return this._cart$.value.items_count;
  }

  load(): Observable<{ data: Cart }> {
    return this.http.get<{ data: Cart }>(`${this.base}/cart`).pipe(
      tap((res) => this._cart$.next(res.data))
    );
  }

  add(request: AddToCartRequest): Observable<{ data: Cart; message: string }> {
    return this.http
      .post<{ data: Cart; message: string }>(`${this.base}/cart/add`, request)
      .pipe(tap((res) => this._cart$.next(res.data)));
  }

  updateQuantity(itemId: number, quantity: number): Observable<{ data: Cart }> {
    return this.http
      .post<{ data: Cart }>(`${this.base}/cart/update`, { item_id: itemId, quantity })
      .pipe(tap((res) => this._cart$.next(res.data)));
  }

  remove(itemId: number): Observable<{ data: Cart; message: string }> {
    return this.http
      .post<{ data: Cart; message: string }>(`${this.base}/cart/remove`, { item_id: itemId })
      .pipe(tap((res) => this._cart$.next(res.data)));
  }

  clear(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/cart/clear`, {}).pipe(
      tap(() => this._cart$.next({ items: [], total: 0, items_count: 0 }))
    );
  }

  isInCart(productId: number): boolean {
    return this._cart$.value.items.some((i) => i.product_id === productId);
  }
}
