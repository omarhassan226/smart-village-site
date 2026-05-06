import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LanguageService } from './language.service';

export interface Address {
  shipping_address_id?: number;
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

  constructor(private http: HttpClient, private langService: LanguageService) { }

  getAddresses(lang: string = this.langService.current): Observable<any> {
    return this.http.get<any>(`${this.base}/show/shipping/address/${lang}`);
  }

  addAddress(address: Partial<Address>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/add/shipping/address`, address);
  }

  updateAddress(id: number, address: Partial<Address>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/update/shipping/way`, address);
  }

  deleteAddress(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/delete/shiping/address`, { shiping_id: id });
  }
}
