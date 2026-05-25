import { SharedModule } from '../../../../shared/shared.module';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BannerService } from '../../../../core/services/banner.service';
import { LanguageService } from '../../../../core/services/language.service';
import { Product } from '../../../../core/models';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [SharedModule, CommonModule, TranslateModule, RouterModule],
  selector: 'app-promo-banner',
  templateUrl: './promo-banner.component.html',
  styleUrls: ['./promo-banner.component.scss'],
})
export class PromoBannerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('slider') slider?: ElementRef;

  products: Product[] = [];
  loading = true;
  private storageBase = 'https://smartvillageapp.com/app';
  private scrollInterval: any;

  constructor(
    private bannerService: BannerService,
    public lang: LanguageService
  ) { }

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.initAutoScroll();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  private load(): void {
    this.loading = true;
    this.bannerService.getProductBanners().subscribe({
      next: (res) => {
        let data: Product[] = res.data || [];

        if (data.length > 0) {
          let buffer = [...data];
          while (buffer.length < 12) { buffer = [...buffer, ...data]; }
          this.products = [...buffer, ...buffer, ...buffer];
        } else {
          this.products = [];
        }

        this.loading = false;
        setTimeout(() => this.initAutoScroll(), 200);
      },
      error: () => {
        this.products = [];
        this.loading = false;
      },
    });
  }

  private initAutoScroll(): void {
    setTimeout(() => {
      const el = this.slider?.nativeElement;
      if (el) {
        const oneThird = el.scrollWidth / 3;
        el.style.scrollBehavior = 'auto';
        el.scrollLeft = this.lang.isRtl ? -oneThird : oneThird;
        this.startAutoScroll();
      }
    }, 600);
  }

  startAutoScroll(): void {
    this.stopAutoScroll();
    this.scrollInterval = setInterval(() => {
      const el = this.slider?.nativeElement;
      if (el) {
        const totalWidth = el.scrollWidth;
        const oneThird = totalWidth / 3;
        el.style.scrollBehavior = 'auto';

        if (this.lang.isRtl) {
          if (Math.abs(el.scrollLeft) >= (oneThird * 2)) {
            el.scrollLeft = -oneThird;
          } else if (el.scrollLeft >= 0) {
            el.scrollLeft = -oneThird;
          }
          el.scrollLeft -= 1.5;
        } else {
          if (el.scrollLeft >= (oneThird * 2)) {
            el.scrollLeft = oneThird;
          } else if (el.scrollLeft <= 0) {
            el.scrollLeft = oneThird;
          }
          el.scrollLeft += 1.5;
        }
      }
    }, 20);
  }

  stopAutoScroll(): void {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
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
