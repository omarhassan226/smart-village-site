import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { BannerService } from '../../core/services/banner.service';
import { LanguageService } from '../../core/services/language.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { SharedModule } from '../../shared/shared.module';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule, ProductCardComponent, SharedModule],
  selector: 'app-offers-page',
  templateUrl: './offers-page.component.html',
  styleUrls: ['./offers-page.component.scss'],
})
export class OffersPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly storageBase = 'https://smartvillageapp.com/app';

  allProducts: any[] = [];
  products: any[] = [];
  loading = true;
  searchQuery = '';
  sortOrder: 'asc' | 'desc' | '' = '';

  constructor(
    private bannerService: BannerService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    this.lang.lang$.pipe(takeUntil(this.destroy$)).subscribe(() => this.load());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private load(): void {
    this.loading = true;
    this.bannerService.getProductBanners().subscribe({
      next: (res) => {
        this.allProducts = (res.data || []).map((item: any) => ({
          ...item,
          image: item.sliders?.length > 0
            ? `${this.storageBase}/${item.sliders[0].image}`
            : 'assets/images/placeholder.svg',
          original_price: item.price,
          price: item.discount_price ?? item.price,
          in_stock: item.number > 0,
          name: this.lang.current === 'ar'
            ? (item.name_ar || item.name_en || '')
            : (item.name_en || item.name_ar || ''),
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.allProducts = [];
        this.products = [];
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    let result = [...this.allProducts];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        (p.name_ar || '').toLowerCase().includes(q) ||
        (p.name_en || '').toLowerCase().includes(q)
      );
    }

    if (this.sortOrder === 'asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'desc') {
      result.sort((a, b) => b.price - a.price);
    }

    this.products = result;
  }

  get discount(): (p: any) => number {
    return (p: any) => {
      if (!p.original_price || !p.price) return 0;
      return Math.round(((p.original_price - p.price) / p.original_price) * 100);
    };
  }

  getProductName(p: any): string {
    return this.lang.current === 'ar'
      ? (p.name_ar || p.name_en || '')
      : (p.name_en || p.name_ar || '');
  }
}
