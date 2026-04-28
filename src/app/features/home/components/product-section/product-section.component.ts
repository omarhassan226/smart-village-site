import { SharedModule } from '../../../../shared/shared.module';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models';

type SectionType = 'featured' | 'offers' | 'new';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-product-section',
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.scss'],
})
export class ProductSectionComponent implements OnInit {
  @Input() type: SectionType = 'featured';
  @Input() titleKey = '';

  products: Product[] = [];
  loading = true;

  constructor(private productService: ProductService, private router: Router) { }

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
      next: (res) => { this.products = res.data.slice(0, 8); this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  viewAll(): void {
    if (this.type === 'offers') {
      this.router.navigate(['/products'], { queryParams: { status: 'offers' } });
    } else {
      this.router.navigate(['/products']);
    }
  }
}
