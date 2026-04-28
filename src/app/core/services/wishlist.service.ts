import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private base = environment.apiUrl;
  private _ids$ = new BehaviorSubject<Set<number>>(new Set());
  ids$ = this._ids$.asObservable();

  constructor(private http: HttpClient) {}

  load(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(`${this.base}/wishlist`).pipe(
      tap((res) => this._ids$.next(new Set(res.data.map((p) => p.id))))
    );
  }

  toggle(productId: number): Observable<{ message: string }> {
    return this.isInWishlist(productId)
      ? this.remove(productId)
      : this.add(productId);
  }

  add(productId: number): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.base}/wishlist/add`, { product_id: productId })
      .pipe(tap(() => {
        const ids = new Set(this._ids$.value);
        ids.add(productId);
        this._ids$.next(ids);
      }));
  }

  remove(productId: number): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.base}/wishlist/remove`, { product_id: productId })
      .pipe(tap(() => {
        const ids = new Set(this._ids$.value);
        ids.delete(productId);
        this._ids$.next(ids);
      }));
  }

  isInWishlist(productId: number): boolean {
    return this._ids$.value.has(productId);
  }
}
