import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductFilter, ProductListResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(filter: ProductFilter = {}): Observable<ProductListResponse> {
    let params = new HttpParams();
    Object.entries(filter).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<ProductListResponse>(`${this.base}/products`, { params });
  }

  getProduct(id: number): Observable<{ data: Product }> {
    return this.http.get<{ data: Product }>(`${this.base}/products/${id}`);
  }

  getFeatured(): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(`${this.base}/products/featured`);
  }

  getOffers(): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(`${this.base}/products/offers`);
  }

  getNewArrivals(): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(`${this.base}/products/new`);
  }

  getSimilar(productId: number): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(`${this.base}/products/${productId}/similar`);
  }

  search(keyword: string, page = 1): Observable<ProductListResponse> {
    const params = new HttpParams().set('key_word', keyword).set('page', page);
    return this.http.get<ProductListResponse>(`${this.base}/products`, { params });
  }
}
