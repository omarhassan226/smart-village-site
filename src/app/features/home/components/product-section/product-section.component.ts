import { SharedModule } from '../../../../shared/shared.module';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models';
import { LanguageService } from '../../../../core/services/language.service';

type SectionType = 'featured' | 'offers' | 'new';

import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, ProductCardComponent, EmptyStateComponent],
  selector: 'app-product-section',
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.scss'],
})
export class ProductSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() type: SectionType = 'featured';
  @Input() titleKey = '';
  @Input() icon = 'uil-box';
  @Input() limit = 8;
  @Input() compact = false;
  @Input() autoScroll = false;

  @ViewChild('slider') slider?: ElementRef;

  products: Product[] = [];
  loading = true;
  private scrollInterval: any;

  constructor(
    private productService: ProductService,
    private router: Router,
    public lang: LanguageService
  ) { }

  ngOnInit(): void {
    // Re-fetch data whenever language changes
    this.lang.lang$.subscribe(() => {
      this.load();
    });
  }

  ngAfterViewInit(): void {
    this.initAutoScroll();
  }

  private initAutoScroll(): void {
    if (this.autoScroll && this.slider) {
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
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  startAutoScroll(): void {
    if (!this.autoScroll) return;
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
          el.scrollLeft -= 1.5; // Slightly faster
        } else {
          if (el.scrollLeft >= (oneThird * 2)) {
            el.scrollLeft = oneThird;
          } else if (el.scrollLeft <= 0) {
            el.scrollLeft = oneThird;
          }
          el.scrollLeft += 1.5;
        }
      }
    }, 20); // Faster tick
  }

  stopAutoScroll(): void {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
  }

  private load(): void {
    this.loading = true;
    const request =
      this.type === 'featured'
        ? this.productService.getFeatured()
        : this.type === 'offers'
          ? this.productService.getOffers()
          : this.productService.getNewArrivals();

    request.subscribe({
      next: (res) => {
        let data = res.data || [];
        if (this.limit) {
          data = data.slice(0, this.limit);
        }

        if (this.autoScroll && data.length > 0) {
          let buffer = [...data];
          while (buffer.length < 12) { buffer = [...buffer, ...data]; }
          this.products = [...buffer, ...buffer, ...buffer];
        } else {
          this.products = data;
        }

        this.loading = false;
        if (this.autoScroll) {
          setTimeout(() => this.initAutoScroll(), 200);
        }
      },
      error: () => {
        this.products = [];
        this.loading = false;
      },
    });
  }

  viewAll(): void {
    // if (this.type === 'offers') {
    //   this.router.navigate(['/products'], { queryParams: { status: 'offers' } });
    // } else {
    this.router.navigate(['/products']);
    // }
  }

  get sectionIcon(): string {
    switch (this.type) {
      case 'featured': return 'uil-star';
      case 'offers': return 'uil-percentage';
      case 'new': return 'uil-fire';
      default: return 'uil-box';
    }
  }

  get sectionColor(): string {
    switch (this.type) {
      case 'featured': return 'primary';
      case 'offers': return 'danger';
      case 'new': return 'secondary';
      default: return 'primary';
    }
  }
}
