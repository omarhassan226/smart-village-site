import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Governorate, City, Village, Address, AddressRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getGovernorates(lang: string = 'en'): Observable<{ governorates: Governorate[] }> {
    return this.http.get<{ governorates: Governorate[] }>(`${this.base}/get/governorates/${lang}`);
  }

  getCities(stateId: number): Observable<{ cities: City[] }> {
    return this.http.get<{ cities: City[] }>(`${this.base}/get/state/city?state_id=${stateId}`);
  }

  getVillages(cityId: number): Observable<{ villages: Village[] }> {
    return this.http.get<{ villages: Village[] }>(`${this.base}/get/city/village?city_id=${cityId}`);
  }

  getShippingCost(villageId: number): Observable<{ cost: number }> {
    return this.http.get<{ cost: number }>(`${this.base}/shipping-cost?village_id=${villageId}`);
  }

  // This might be the old address API, keeping it for compatibility if needed
  getUserAddresses(): Observable<{ data: Address[] }> {
    return this.http.get<{ data: Address[] }>(`${this.base}/user/addresses`);
  }

  addAddress(request: any): Observable<any> {
    // Check which endpoint to use. If it's the shipping one:
    return this.http.post<any>(`${this.base}/add/shipping/address/ar`, request);
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/delete/shipping/address/${id}/ar`);
  }
}
