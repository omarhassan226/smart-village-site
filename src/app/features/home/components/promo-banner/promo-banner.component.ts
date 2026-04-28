import { SharedModule } from '../../../../shared/shared.module';
import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../../../core/services/banner.service';
import { LanguageService } from '../../../../core/services/language.service';
import { Product } from '../../../../core/models';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-promo-banner',
  templateUrl: './promo-banner.component.html',
  styleUrls: ['./promo-banner.component.scss'],
})
export class PromoBannerComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  private storageBase = 'https://smartvillageapp.com/app';

  constructor(
    private bannerService: BannerService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    this.bannerService.getProductBanners().subscribe({
      next: (res) => {
        this.products = res.data.slice(0, 3);
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  getProductName(p: any): string {
    return this.lang.current === 'ar'
      ? (p.name_ar || p.name_en || '')
      : (p.name_en || p.name_ar || '');
  }

  getProductImage(p: any): string {
    if (p.sliders && p.sliders.length > 0) {
      return `${this.storageBase}/${p.sliders[0].image}`;
    }
    return 'assets/images/placeholder.svg';
  }

  getDiscount(p: any): number {
    if (p.discount_price && p.price && p.discount_price < p.price) {
      return Math.round(((p.price - p.discount_price) / p.price) * 100);
    }
    return 0;
  }
}
