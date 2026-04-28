import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Banner, Brand } from '../models';

@Injectable({ providedIn: 'root' })
export class BannerService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBanners(): Observable<{ data: Banner[] }> {
    return this.http.get<{ data: Banner[] }>(`${this.base}/banners`);
  }

  getBrands(): Observable<{ data: Brand[] }> {
    return this.http.get<{ data: Brand[] }>(`${this.base}/brands`);
  }
}
