import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, OrderRequest, OrderListResponse, ReturnOrderRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOrders(page = 1, status?: string): Observable<OrderListResponse> {
    let url = `${this.base}/get/orders/ar?page=${page}`;
    if (status) url += `&status=${status}`;
    return this.http.get<OrderListResponse>(url);
  }

  getOrder(id: number): Observable<{ data: Order }> {
    return this.http.get<{ data: Order }>(`${this.base}/orders/${id}`);
  }

  placeOrder(request: OrderRequest): Observable<{ data: Order; message: string }> {
    return this.http.post<{ data: Order; message: string }>(`${this.base}/orders`, request);
  }

  returnOrder(request: ReturnOrderRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/orders/return`, request);
  }
}
