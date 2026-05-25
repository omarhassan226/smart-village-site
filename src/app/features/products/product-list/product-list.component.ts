import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { BannerService } from '../../../core/services/banner.service';
import { FilterSidebarComponent } from '../components/filter-sidebar/filter-sidebar.component';
import { CategoryService } from '../../../core/services/category.service';
import { Product, ProductFilter, Category, Brand } from '../../../core/models';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

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
  brands: Brand[] = [];
  keywords: string[] = [];
  loading = false;
  totalProducts = 0;
  currentPage = 1;
  lastPage = 1;
  filter: ProductFilter = {};
  filterOpen = false;

  sortOptions = [
    { value: '', label: '' },
    { value: 'asc', label: '' },
    { value: 'desc', label: '' },
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private bannerService: BannerService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    public lang: LanguageService
  ) { }

  ngOnInit(): void {
    this.sortOptions = [
      { value: '', label: this.translate.instant('SORT') },
      { value: 'asc', label: this.translate.instant('PRICE_ASC') },
      { value: 'desc', label: this.translate.instant('PRICE_DESC') },
    ];

    // Load all brands for filter sidebar
    this.bannerService.getAllBrands().subscribe({
      next: (res) => (this.brands = res.data),
      error: () => { },
    });

    // React to query param changes
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const prevMainCatId = this.filter.main_category_id || this.filter.main_category;

      this.filter = {
        category_id: params['category_id'] ? +params['category_id'] : undefined,
        // main_category: params['main_category'] ? +params['main_category'] : undefined,
        main_category_id: params['main_category_id'] ? +params['main_category_id'] : undefined,
        brand_id: params['brand_id'] ? +params['brand_id'] : undefined,
        key_word: params['key_word'] || undefined,
        status: params['status'] as 'asc' | 'desc' | '' | undefined,
        priceFrom: params['priceFrom'] !== undefined ? +params['priceFrom'] : undefined,
        priceTo: params['priceTo'] !== undefined ? +params['priceTo'] : undefined,
        page: params['page'] ? +params['page'] : 1,
      };
      this.currentPage = this.filter.page || 1;
      this.loadProducts();


      const main_category_id = this.filter.main_category_id;
      this.loadCategories(main_category_id);
      if (this.filter.category_id) {
        this.loadKeywords(this.filter.category_id);
      } else {
        this.keywords = [];
      }
    });
  }

  loadCategories(mainCategoryId?: number): void {
    if (mainCategoryId) {
      this.categoryService.getSubcategories(mainCategoryId).subscribe({
        next: (cats) => {
          this.categories = cats;
        },
        error: () => {
          this.categories = [];
        }
      });
    } else {
      this.categoryService.getCategories().subscribe({
        next: (res) => (this.categories = res.data),
        error: () => { },
      });
    }
  }

  loadProducts(): void {
    this.loading = true;
    const filterWithPage = { ...this.filter, page: this.currentPage };

    this.productService.searchProducts(filterWithPage).subscribe({
      next: (res) => {
        this.products = res.data;
        this.totalProducts = res.total;
        this.lastPage = res.last_page;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  loadKeywords(categoryId: number): void {
    this.categoryService.getCategoryKeywords(categoryId).subscribe({
      next: (kws) => (this.keywords = kws),
      error: () => (this.keywords = []),
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateQueryParam('page', String(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSortChange(value: string): void {
    this.updateQueryParam('status', value || null);
  }

  onCategorySelect(id: number | null): void {
    // When category changes, reset page but keep main_category if it is set!
    this.router.navigate([], {
      queryParams: {
        category_id: id || null,
        page: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  onBrandSelect(id: number | null): void {
    this.router.navigate([], {
      queryParams: {
        brand_id: id || null,
        page: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  onKeywordSelect(keyword: string): void {
    this.updateQueryParam('name', keyword);
  }

  onPriceFilter(from: number, to: number): void {
    this.router.navigate([], {
      queryParams: {
        priceFrom: from !== undefined ? from : null,
        priceTo: to !== undefined ? to : null,
        page: null
      },
      queryParamsHandling: 'merge',
    });
  }

  clearFilters(): void {
    this.router.navigate([], { queryParams: {} });
  }

  get hasActiveFilters(): boolean {
    return !!(this.filter.category_id || this.filter.main_category_id || this.filter.brand_id || this.filter.key_word ||
      this.filter.priceFrom || this.filter.priceTo || this.filter.status);
  }

  updateQueryParam(key: string, value: string | null): void {
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
