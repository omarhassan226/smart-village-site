import { SharedModule } from '../../../../shared/shared.module';
import { Component, Input, OnInit } from '@angular/core';
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
export class ProductSectionComponent implements OnInit {
  @Input() type: SectionType = 'featured';
  @Input() titleKey = '';
  @Input() icon = 'uil-box';
  @Input() limit = 8;

  products: Product[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private router: Router,
    public lang: LanguageService
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    const request =
      this.type === 'featured'
        ? this.productService.getFeatured()
        : this.type === 'offers'
          ? this.productService.getOffers()
          : this.productService.getNewArrivals();

    request.subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.products = res.data.slice(0, this.limit);
        } else {
          this.products = [];
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
