import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Banner, Brand, SocialLinks } from '../models';
import { LanguageService } from './language.service';

@Injectable({ providedIn: 'root' })
export class BannerService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient, private lang: LanguageService) { }

  /** GET /api/banners/{lang} */
  getBanners(): Observable<{ data: Banner[] }> {
    return this.http
      .get<{ banners: any[] }>(`${this.base}/banners/${this.lang.current}`)
      .pipe(map((res) => ({ data: this.mapBanners(res.banners || []) })));
  }

  /** GET /api/show/brands/{lang}?most_selling=1 – homepage best sellers */
  getBrands(mostSelling = true): Observable<{ data: Brand[] }> {
    const param = mostSelling ? '1' : '0';
    return this.http
      .get<any>(`${this.base}/show/brands/${this.lang.current}?most_selling=${param}`)
      .pipe(
        map((res) => {
          // Handle both direct array and { brands: [...] } wrap
          const brands = Array.isArray(res) ? res : (res.brands || []);
          return { data: brands };
        })
      );
  }

  /** GET /api/show/brands/{lang} – all brands for filter sidebar */
  getAllBrands(): Observable<{ data: Brand[] }> {
    return this.http
      .get<any>(`${this.base}/show/brands/${this.lang.current}`)
      .pipe(
        map((res) => {
          const brands = Array.isArray(res) ? res : (res.brands || []);
          return { data: brands };
        })
      );
  }

  /** POST /api/product/banners/{lang} – product-based banners */
  getProductBanners(): Observable<{ data: any[] }> {
    return this.http
      .post<{ products: any[] }>(`${this.base}/product/banners/${this.lang.current}`, {})
      .pipe(map((res) => ({ data: res.products || [] })));
  }

  /** GET /api/getsocial/account */
  getSocialLinks(): Observable<SocialLinks> {
    return this.http
      .get<{ social: SocialLinks }>(`${this.base}/getsocial/account`)
      .pipe(map((res) => res.social));
  }

  private mapBanners(raw: any[]): Banner[] {
    const lang = this.lang.current;
    return raw.map((b) => ({
      ...b,
      image: b[`image_${lang}`]
        ? `${this.getStorageBase()}/${b[`image_${lang}`]}`
        : b.image,
    }));
  }

  private getStorageBase(): string {
    return 'https://smartvillageapp.com/app';
  }
}
