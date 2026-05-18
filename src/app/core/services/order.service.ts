import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, OrderRequest, OrderListResponse, ReturnOrderRequest } from '../models';
import { LanguageService } from './language.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = environment.apiUrl;
  private baseUrlWithDoubleSlash = environment.baseUrlWithDoubleSlash;

  constructor(private http: HttpClient, private lang: LanguageService) { }

  getOrders(page = 1, status?: string, lang?: string): Observable<OrderListResponse> {
    let url = `${this.base}/get/orders/${lang || this.lang.current}?page=${page}`;
    if (status) url += `&status=${status}`;
    return this.http.get<OrderListResponse>(url);
  }

  getOrder(id: number): Observable<{ data: Order }> {
    return this.http.get<{ data: Order }>(`${this.base}/orders/${id}`);
  }

  placeOrder(request: OrderRequest): Observable<{ data: Order; message: string }> {
    return this.http.post<{ data: Order; message: string }>(`${this.base}/orders`, request);
  }

  getShippingCompanies(addressId: string, orderCost: number, status: string): Observable<any> {
    const payload = { address_id: addressId, order_cost: orderCost, status };
    return this.http.post<any>(`${this.base}/get/shipings/support/user`, payload);
  }

  saveWebOrder(payload: any): Observable<any> {
    // using base without /api if needed? The user provided:
    return this.http.post<any>(`${this.baseUrlWithDoubleSlash}/web/save/order`, payload);
  }

  returnOrder(request: ReturnOrderRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/orders/return`, request);
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.post<any>(`${this.base}/orders/cancel`, { order_id: orderId });
  }
}
