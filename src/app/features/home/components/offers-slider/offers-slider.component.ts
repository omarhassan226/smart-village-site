import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BannerService } from '../../../../core/services/banner.service';
import { LanguageService } from '../../../../core/services/language.service';
import { Product } from '../../../../core/models';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, ProductCardComponent, EmptyStateComponent],
  selector: 'app-offers-slider',
  templateUrl: './offers-slider.component.html',
  styleUrls: ['./offers-slider.component.scss'],
})
export class OffersSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('slider') slider?: ElementRef;

  products: Product[] = [];
  loading = true;
  private scrollInterval: any;

  constructor(
    private bannerService: BannerService,
    private router: Router,
    public lang: LanguageService
  ) { }

  ngOnInit(): void {
    this.lang.lang$.subscribe(() => this.load());
  }

  ngAfterViewInit(): void {
    this.initAutoScroll();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  private readonly storageBase = 'https://smartvillageapp.com/app';

  private load(): void {
    this.loading = true;
    this.bannerService.getProductBanners().subscribe({
      next: (res) => {
        const raw: any[] = res.data || [];

        // Map banner response to the shape product-card expects
        const mapped: Product[] = raw.map((item) => ({
          ...item,
          // Build image from sliders array
          image: item.sliders?.length > 0
            ? `${this.storageBase}/${item.sliders[0].image}`
            : 'assets/images/placeholder.svg',
          // original_price = the list price, price = discounted price (for discount badge)
          original_price: item.price,
          price: item.discount_price ?? item.price,
          in_stock: item.number > 0,
        }));
        if (mapped.length > 0) {
          let buffer = [...mapped];
          while (buffer.length < 12) { buffer = [...buffer, ...mapped]; }
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
          if (Math.abs(el.scrollLeft) >= oneThird * 2) { el.scrollLeft = -oneThird; }
          else if (el.scrollLeft >= 0) { el.scrollLeft = -oneThird; }
          el.scrollLeft -= 1.5;
        } else {
          if (el.scrollLeft >= oneThird * 2) { el.scrollLeft = oneThird; }
          else if (el.scrollLeft <= 0) { el.scrollLeft = oneThird; }
          el.scrollLeft += 1.5;
        }
      }
    }, 20);
  }

  stopAutoScroll(): void {
    if (this.scrollInterval) clearInterval(this.scrollInterval);
  }

  viewAll(): void {
    this.router.navigate(['/offers']);
  }
}
