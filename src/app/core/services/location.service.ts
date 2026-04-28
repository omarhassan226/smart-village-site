import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Governorate, City, Village, Address, AddressRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getGovernorates(lang: string = 'en'): Observable<{ governorates: any[] }> {
    return this.http.get<{ governorates: any[] }>(`${this.base}/get/governorates/${lang}`);
  }

  getCities(stateId: number): Observable<{ cities: any[] }> {
    return this.http.get<{ cities: any[] }>(`${this.base}/get/state/city?state_id=${stateId}`);
  }

  getVillages(cityId: number): Observable<{ villages: any[] }> {
    return this.http.get<{ villages: any[] }>(`${this.base}/get/city/village?city_id=${cityId}`);
  }

  getShippingCost(villageId: number): Observable<{ cost: number }> {
    return this.http.get<{ cost: number }>(`${this.base}/shipping-cost?village_id=${villageId}`);
  }

  getUserAddresses(): Observable<{ data: Address[] }> {
    return this.http.get<{ data: Address[] }>(`${this.base}/user/addresses`);
  }

  addAddress(request: AddressRequest): Observable<{ data: Address }> {
    return this.http.post<{ data: Address }>(`${this.base}/user/addresses`, request);
  }

  deleteAddress(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/user/addresses/${id}`);
  }
}
