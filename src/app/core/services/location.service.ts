import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Governorate, City, Village, Address, AddressRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getGovernorates(): Observable<{ data: Governorate[] }> {
    return this.http.get<{ data: Governorate[] }>(`${this.base}/governorates`);
  }

  getCities(governorateId: number): Observable<{ data: City[] }> {
    return this.http.get<{ data: City[] }>(`${this.base}/cities?governorate_id=${governorateId}`);
  }

  getVillages(cityId: number): Observable<{ data: Village[] }> {
    return this.http.get<{ data: Village[] }>(`${this.base}/villages?city_id=${cityId}`);
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
