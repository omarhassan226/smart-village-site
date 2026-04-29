import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, catchError } from 'rxjs';
import { Product } from '../models';
import { LanguageService } from './language.service';
import { AuthService } from './auth.service';

const WISHLIST_BASE = 'https://smartvillageapp.com/app/api';
const STORAGE_IDS_KEY = 'sv_wishlist_ids';
const STORAGE_PRODUCTS_KEY = 'sv_wishlist_products';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  /** Set of product IDs in the wishlist */
  private _ids$ = new BehaviorSubject<Set<number>>(this.loadLocalIds());
  ids$ = this._ids$.asObservable();

  /** Full product objects */
  private _products$ = new BehaviorSubject<Product[]>(this.loadLocalProducts());
  products$ = this._products$.asObservable();

  constructor(
    private http: HttpClient,
    private lang: LanguageService,
    private auth: AuthService
  ) {
    // If logged in, sync with server
    if (this.auth.isLoggedIn) {
      this.load().subscribe();
    }
  }

  private loadLocalIds(): Set<number> {
    try {
      const raw = localStorage.getItem(STORAGE_IDS_KEY);
      // Ensure all loaded IDs are numbers
      const ids = raw ? JSON.parse(raw).map((id: any) => Number(id)) : [];
      return new Set<number>(ids);
    } catch {
      return new Set<number>();
    }
  }

  private loadLocalProducts(): Product[] {
    try {
      const raw = localStorage.getItem(STORAGE_PRODUCTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveLocal(ids: Set<number>, products: Product[]): void {
    localStorage.setItem(STORAGE_IDS_KEY, JSON.stringify([...ids]));
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  }

  /** Load wishlist from API (only for logged in users) */
  load(): Observable<{ data: Product[] }> {
    if (!this.auth.isLoggedIn) return of({ data: this._products$.value });

    return this.http
      .get<{ data: Product[] }>(`${WISHLIST_BASE}/get/product/favourite/${this.lang.current}`)
      .pipe(
        tap((res) => {
          const serverProducts = res.data || [];
          const serverIds = serverProducts.map((p: Product) => Number(p.id));
          
          // Merge logic: Keep local guest items that might not be on server yet
          const currentProducts = [...this._products$.value];
          const combinedProducts = [...serverProducts];
          
          currentProducts.forEach(p => {
            if (!serverIds.includes(Number(p.id))) {
              combinedProducts.push(p);
            }
          });

          const finalIds = new Set<number>(combinedProducts.map(p => Number(p.id)));
          
          this._products$.next(combinedProducts);
          this._ids$.next(finalIds);
          this.saveLocal(finalIds, combinedProducts);
        }),
        catchError(() => of({ data: this._products$.value }))
      );
  }

  get count(): number {
    return this._ids$.value.size;
  }

  isInWishlist(productId: number): boolean {
    return this._ids$.value.has(Number(productId));
  }

  toggle(productId: number, product?: Product): Observable<{ message: string }> {
    if (this.isInWishlist(productId)) {
      return this.remove(productId);
    } else {
      return this.add(productId, product);
    }
  }

  add(productId: number, product?: Product): Observable<{ message: string }> {
    const ids = new Set(this._ids$.value);
    ids.add(Number(productId));
    this._ids$.next(ids);

    let products = [...this._products$.value];
    if (product && !products.find((p) => Number(p.id) === Number(productId))) {
      products.push(product);
    }
    this._products$.next(products);
    this.saveLocal(ids, products);

    if (!this.auth.isLoggedIn) {
      return of({ message: 'added_locally' });
    }

    return this.http
      .post<{ message: string }>(`${WISHLIST_BASE}/add/product/favourite`, { product_id: productId })
      .pipe(
        catchError(() => {
          // Keep local if server fails, or rollback if strict
          return of({ message: 'error_but_kept_locally' });
        })
      );
  }

  remove(productId: number): Observable<{ message: string }> {
    const ids = new Set(this._ids$.value);
    ids.delete(Number(productId));
    this._ids$.next(ids);

    const products = this._products$.value.filter((p) => Number(p.id) !== Number(productId));
    this._products$.next(products);
    this.saveLocal(ids, products);

    if (!this.auth.isLoggedIn) {
      return of({ message: 'removed_locally' });
    }

    return this.http
      .post<{ message: string }>(`${WISHLIST_BASE}/add/product/favourite`, { product_id: productId })
      .pipe(catchError(() => of({ message: 'error' })));
  }
}
