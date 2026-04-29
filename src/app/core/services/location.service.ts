import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Governorate, City, Village, Address, AddressRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getGovernorates(lang: string = 'en'): Observable<{ data: Governorate[] }> {
    return this.http
      .get<{ governorates: Governorate[] }>(`${this.base}/get/governorates/${lang}`)
      .pipe(map((res: { governorates: Governorate[] }) => ({ data: res.governorates || [] })));
  }

  getCities(stateId: number): Observable<{ data: City[] }> {
    return this.http
      .get<{ cities: City[] }>(`${this.base}/get/state/city?state_id=${stateId}`)
      .pipe(map((res: { cities: City[] }) => ({ data: res.cities || [] })));
  }

  getVillages(cityId: number): Observable<{ data: Village[] }> {
    return this.http
      .get<{ villages: Village[] }>(`${this.base}/get/city/village?city_id=${cityId}`)
      .pipe(map((res: { villages: Village[] }) => ({ data: res.villages || [] })));
  }

  getShippingCost(villageId: number): Observable<{ cost: number }> {
    return this.http.get<{ cost: number }>(`${this.base}/shipping-cost?village_id=${villageId}`);
  }

  getUserAddresses(): Observable<{ data: Address[] }> {
    return this.http
      .get<any>(`${this.base}/user/addresses`)
      .pipe(map((res: any) => ({ data: res.data || res.addresses || (Array.isArray(res) ? res : []) })));
  }

  addAddress(request: AddressRequest): Observable<{ data: Address }> {
    return this.http.post<{ data: Address }>(`${this.base}/user/addresses`, request);
  }

  deleteAddress(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/user/addresses/${id}`);
  }
}
