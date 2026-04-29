import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Address {
  id?: number;
  receiver_name: string | null;
  phone_number: string | null;
  governorate_id: number;
  state_id: number;
  village_id: number;
  address: string | null;
  type_address: string | null;
  default: boolean;

  // These are for the response display mapping
  country_id?: number;
  city_id?: number;
  governorate?: { id: number; name_ar: string; name_en?: string };
  state?: { id: number; name_ar: string; name_en?: string };
  village?: { id: number; name_ar: string; name_en?: string };
}

@Injectable({ providedIn: 'root' })
export class ShippingService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAddresses(): Observable<{ address: Address[] }> {
    return this.http.get<{ address: Address[] }>(`${this.base}/show/shipping/address/ar`);
  }

  addAddress(address: Partial<Address>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/add/shipping/address`, address);
  }

  updateAddress(id: number, address: Partial<Address>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/update/shipping/address/${id}/ar`, address);
  }

  deleteAddress(id: number): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.base}/delete/shipping/address/${id}/ar`);
  }
}
