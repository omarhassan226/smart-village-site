import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { FilterSidebarComponent } from '../components/filter-sidebar/filter-sidebar.component';
import { CategoryService } from '../../../core/services/category.service';
import { Product, ProductFilter, Category } from '../../../core/models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, SharedModule, FormsModule, FilterSidebarComponent],
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  products: Product[] = [];
  categories: Category[] = [];
  loading = false;
  totalProducts = 0;
  currentPage = 1;
  lastPage = 1;
  filter: ProductFilter = {};
  filterOpen = false;
  searchControl = new FormControl('');

  sortOptions = [
    { value: '', label: '' },
    { value: 'asc', label: '' },
    { value: 'desc', label: '' },
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.sortOptions = [
      { value: '', label: this.translate.instant('SORT') },
      { value: 'asc', label: this.translate.instant('PRICE_ASC') },
      { value: 'desc', label: this.translate.instant('PRICE_DESC') },
    ];

    this.categoryService.getCategories().subscribe({
      next: (res) => (this.categories = res.data),
      error: () => { },
    });

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.filter = {
        category_id: params['category_id'] ? +params['category_id'] : undefined,
        brand_id: params['brand_id'] ? +params['brand_id'] : undefined,
        key_word: params['key_word'] || undefined,
        status: params['status'] as 'asc' | 'desc' | undefined,
        priceFrom: params['priceFrom'] ? +params['priceFrom'] : undefined,
        priceTo: params['priceTo'] ? +params['priceTo'] : undefined,
        page: 1,
      };
      this.currentPage = 1;
      this.loadProducts();
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((val) => {
      this.updateQueryParam('key_word', val || null);
    });
  }

  loadProducts(): void {
    this.loading = true;
    const filterWithPage = { ...this.filter, page: this.currentPage };
    this.productService.getProducts(filterWithPage).subscribe({
      next: (res) => {
        this.products = res.data;
        this.totalProducts = res.total;
        this.lastPage = res.last_page;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSortChange(value: string): void {
    this.updateQueryParam('status', value || null);
  }

  onCategorySelect(id: number | null): void {
    this.updateQueryParam('category_id', id ? String(id) : null);
  }

  onPriceFilter(from: number, to: number): void {
    this.router.navigate([], {
      queryParams: { priceFrom: from || null, priceTo: to || null },
      queryParamsHandling: 'merge',
    });
  }

  private updateQueryParam(key: string, value: string | null): void {
    this.router.navigate([], {
      queryParams: { [key]: value },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
