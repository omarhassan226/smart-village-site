import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductFilter, ProductListResponse } from '../models';
import { LanguageService } from './language.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = environment.apiUrl;
  private storageBase = 'https://smartvillageapp.com/app';

  constructor(private http: HttpClient, private lang: LanguageService) {}

  /**
   * GET /api/search/product/{lang}
   * The main search/filter endpoint used by the products listing page.
   */
  searchProducts(filter: ProductFilter = {}): Observable<ProductListResponse> {
    let params = new HttpParams()
      .set('is_paginated', '1')
      .set('filter_main', '1')
      .set('priceFrom', String(filter.priceFrom ?? 0))
      .set('priceTo', String(filter.priceTo ?? 1000000));

    if (filter.category_id) params = params.set('category_id', String(filter.category_id));
    if (filter.brand_id) params = params.set('brand_id', String(filter.brand_id));
    if (filter.key_word) params = params.set('key_word', String(filter.key_word));
    if (filter.name) params = params.set('name', filter.name);
    if (filter.status) params = params.set('status', filter.status);
    if (filter.page) params = params.set('page', String(filter.page));

    return this.http
      .get<{ products: any }>(`${this.base}/search/product/${this.lang.current}`, { params })
      .pipe(
        map((res) => {
          const p = res.products;
          // Handle paginated response: { data: [...], total, current_page, last_page }
          if (p && p.data && Array.isArray(p.data)) {
            return {
              data: this.mapProducts(p.data),
              total: p.total || p.data.length,
              per_page: p.per_page || 20,
              current_page: p.current_page || 1,
              last_page: p.last_page || 1,
            };
          }
          // Handle direct array response: [...]
          if (Array.isArray(p)) {
            return {
              data: this.mapProducts(p),
              total: p.length,
              per_page: p.length || 20,
              current_page: 1,
              last_page: 1,
            };
          }
          return { data: [], total: 0, per_page: 20, current_page: 1, last_page: 1 };
        })
      );
  }

  /** Legacy method kept for backward-compat – delegates to searchProducts */
  getProducts(filter: ProductFilter = {}): Observable<ProductListResponse> {
    return this.searchProducts(filter);
  }

  getProduct(id: number): Observable<{ data: Product }> {
    return this.http.get<{ data: Product }>(`${this.base}/products/${id}`);
  }

  /** GET /api/paginate/choice/{lang} – "We Chose For You" */
  getFeatured(): Observable<ProductListResponse> {
    return this.http
      .get<any[]>(`${this.base}/paginate/choice/${this.lang.current}`)
      .pipe(
        map((products) => ({
          data: this.mapProducts(products || []),
          total: (products || []).length,
          per_page: 20,
          current_page: 1,
          last_page: 1,
        }))
      );
  }

  /** GET /api/may/be/interest/{lang}?paginate=0 – "May Interest You" */
  getNewArrivals(page = 1): Observable<ProductListResponse> {
    return this.http
      .get<{ products: any }>(`${this.base}/may/be/interest/${this.lang.current}?paginate=${page}`)
      .pipe(
        map((res) => {
          const paginated = res.products;
          if (paginated && paginated.data) {
            return {
              data: this.mapProducts(paginated.data),
              total: paginated.total || 0,
              per_page: paginated.per_page || 20,
              current_page: paginated.current_page || 1,
              last_page: paginated.last_page || 1,
            };
          }
          return { data: [], total: 0, per_page: 20, current_page: 1, last_page: 1 };
        })
      );
  }

  getOffers(): Observable<ProductListResponse> {
    return this.http
      .get<{ products: any }>(`${this.base}/may/be/interest/${this.lang.current}?paginate=0`)
      .pipe(
        map((res) => {
          const paginated = res.products;
          if (paginated && paginated.data) {
            return {
              data: this.mapProducts(paginated.data.filter((p: any) => p.discount_price && p.discount_price > 0)),
              total: paginated.total || 0,
              per_page: paginated.per_page || 20,
              current_page: paginated.current_page || 1,
              last_page: paginated.last_page || 1,
            };
          }
          return { data: [], total: 0, per_page: 20, current_page: 1, last_page: 1 };
        })
      );
  }

  getSimilar(productId: number): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(`${this.base}/products/${productId}/similar`);
  }

  search(keyword: string, page = 1): Observable<ProductListResponse> {
    return this.searchProducts({ key_word: keyword, page });
  }

  /** Map API product images to full URLs */
  mapProducts(products: any[]): Product[] {
    return products.map((p) => this.mapProduct(p));
  }

  mapProduct(p: any): Product {
    let imageUrl = 'assets/images/placeholder.svg';
    if (p.image && typeof p.image === 'object' && p.image.image) {
      imageUrl = `${this.storageBase}/${p.image.image}`;
    } else if (p.sliders && p.sliders.length > 0) {
      imageUrl = `${this.storageBase}/${p.sliders[0].image}`;
    } else if (typeof p.image === 'string' && p.image) {
      imageUrl = p.image.startsWith('http') ? p.image : `${this.storageBase}/${p.image}`;
    }

    return {
      ...p,
      image: imageUrl,
      name: p[`name_${this.lang.current}`] || p.name_en || p.name_ar || p.name || '',
      price: p.discount_price && p.discount_price > 0 ? p.discount_price : p.price,
      original_price: p.discount_price && p.discount_price > 0 && p.discount_price < p.price ? p.price : undefined,
      in_stock: p.stock !== undefined ? p.stock > 0 : true,
      discount_percentage:
        p.discount_price && p.discount_price > 0 && p.price > p.discount_price
          ? Math.round(((p.price - p.discount_price) / p.price) * 100)
          : 0,
    };
  }
}
