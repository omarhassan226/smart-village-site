import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Governorate, City, Village, Address, AddressRequest } from '../models';
import { LanguageService } from './language.service';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient, private langService: LanguageService) { }

  getGovernorates(lang: string = this.langService.current): Observable<{ governorates: Governorate[] }> {
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

  // Use the new shipping address endpoint
  getUserAddresses(lang: string = this.langService.current): Observable<{ data: Address[] }> {
    return this.http.get<any>(`${this.base}/show/shipping/address/${lang}`).pipe(
      map(res => ({ data: res.address || res.addresses || res.data || res }))
    );
  }

  addAddress(request: any, lang: string = this.langService.current): Observable<any> {
    // Check which endpoint to use. If it's the shipping one:
    return this.http.post<any>(`${this.base}/add/shipping/address/${lang}`, request);
  }

  deleteAddress(id: number, lang: string = this.langService.current): Observable<any> {
    return this.http.get<any>(`${this.base}/delete/shipping/address/${id}/${lang}`);
  }
}
