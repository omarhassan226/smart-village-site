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

  // Dragging states
  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  constructor(
    private productService: ProductService,
    private router: Router,
    public lang: LanguageService
  ) { }

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    if (this.autoScroll && this.slider) {
      setTimeout(() => {
        const el = this.slider?.nativeElement;
        if (el) {
          const oneThird = el.scrollWidth / 3;
          el.scrollLeft = this.lang.isRtl ? -oneThird : oneThird;
          this.startAutoScroll();
        }
      }, 500); // Small delay to ensure items are rendered
    }
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  startAutoScroll(): void {
    if (!this.autoScroll) return;
    this.stopAutoScroll();
    this.scrollInterval = setInterval(() => {
      if (this.isDragging) return;

      if (this.slider && this.slider.nativeElement) {
        const el = this.slider.nativeElement;
        const totalWidth = el.scrollWidth;
        const oneThird = totalWidth / 3;

        if (this.lang.isRtl) {
          // Reset to middle if we go too far in either direction
          if (Math.abs(el.scrollLeft) >= (oneThird * 2)) {
            el.scrollLeft = -oneThird;
          } else if (el.scrollLeft >= 0) {
            el.scrollLeft = -oneThird;
          }
          el.scrollLeft -= 1;
        } else {
          // Reset to middle if we go too far
          if (el.scrollLeft >= (oneThird * 2)) {
            el.scrollLeft = oneThird;
          } else if (el.scrollLeft <= 0) {
            el.scrollLeft = oneThird;
          }
          el.scrollLeft += 1;
        }
      }
    }, 25);
  }

  stopAutoScroll(): void {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
  }

  // Dragging Methods
  onMouseDown(e: MouseEvent | TouchEvent): void {
    if (!this.compact) return;
    this.isDragging = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    this.startX = clientX - this.slider?.nativeElement.offsetLeft;
    this.scrollLeft = this.slider?.nativeElement.scrollLeft;

    // Disable smooth scroll during drag
    this.slider!.nativeElement.style.scrollBehavior = 'auto';
  }

  onMouseUp(): void {
    this.isDragging = false;
    if (this.slider?.nativeElement) {
      this.slider.nativeElement.style.scrollBehavior = 'smooth';
    }
  }

  onMouseMove(e: MouseEvent | TouchEvent): void {
    if (!this.isDragging || !this.slider) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - this.slider.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2; // Scroll multiplier
    this.slider.nativeElement.scrollLeft = this.scrollLeft - walk;
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

        // If autoScroll is enabled, duplicate items to create an infinite loop effect
        if (this.autoScroll && data.length > 0) {
          this.products = [...data, ...data, ...data]; // Triple the items for extra safety
        } else {
          this.products = data;
        }

        this.loading = false;
      },
      error: () => {
        this.products = [];
        this.loading = false;
      },
    });
  }

  viewAll(): void {
    if (this.type === 'offers') {
      this.router.navigate(['/products'], { queryParams: { status: 'offers' } });
    } else {
      this.router.navigate(['/products']);
    }
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
