import { SharedModule } from '../../../shared/shared.module';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { LanguageService } from '../../../core/services/language.service';
import { Product, ProductColor, ProductType } from '../../../core/models';
import { ShippingModalComponent } from '../components/shipping-modal/shipping-modal.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, SharedModule, FormsModule, ShippingModalComponent],
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private productId: string | null = null;
  product: Product | null = null;
  similarProducts: Product[] = [];
  loading = true;

  selectedImage = '';
  allImages: string[] = [];
  currentSlide = 0;

  selectedOptions: { [optionId: number]: any } = {};
  dynamicPrice: number | null = null;
  dynamicOriginalPrice: number | undefined = undefined;
  dynamicDetailId: number | null = null;
  calculatingPrice = false;

  quantity = 1;

  isWishlisted = false;
  addingToCart = false;
  activeTab: 'details' | 'shipping' = 'details';
  shippingModalOpen = false;

  // Zoom
  zoomVisible = false;
  zoomX = 0;
  zoomY = 0;
  zoomBgPos = '0% 0%';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    public lang: LanguageService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.productId = params['id'];
      if (this.productId) this.loadProduct(this.productId);
    });

    // Listen to language changes and reload the product information dynamically
    this.lang.lang$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.productId) {
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.productService.getProduct(Number(id)).subscribe({
      next: (res: any) => {
        if (!res || !res.data) {
          this.router.navigate(['/products']);
          return;
        }
        this.product = res.data;
        console.log(this.product);

        const p = res.data;

        // Handle images
        this.allImages = [];
        if (p.image) this.allImages.push(p.image);
        if (p.sliders && p.sliders.length > 0) {
          p.sliders.forEach((s: any) => {
            if (s.image) {
              const fullUrl = s.image.startsWith('http') ? s.image : `https://smartvillageapp.com/app/${s.image}`;
              if (!this.allImages.includes(fullUrl)) this.allImages.push(fullUrl);
            }
          });
        }
        if (this.allImages.length === 0) this.allImages.push('assets/images/placeholder.svg');
        this.selectedImage = this.allImages[0];

        // Initialize options (do not auto-select by default)
        this.selectedOptions = {};
        this.checkWishlist();
        this.loadSimilar(p.category_id);
        this.calculateDynamicPrice();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/products']);
      },
    });
  }

  loadSimilar(catId?: number): void {
    if (!catId) return;
    const currentId = this.product?.id;
    this.productService.getProducts({ category_id: catId }).subscribe({
      next: (res: any) => {
        if (res && res.data) {
          this.similarProducts = res.data.filter((p: any) => p.id !== currentId).slice(0, 6);
        }
      },
    });
  }

  selectImage(img: string): void {
    this.selectedImage = img;
    this.currentSlide = this.allImages.indexOf(img);
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.selectedImage = this.allImages[this.currentSlide];
    }
  }

  nextSlide(): void {
    if (this.currentSlide < this.allImages.length - 1) {
      this.currentSlide++;
      this.selectedImage = this.allImages[this.currentSlide];
    }
  }

  get isAllOptionsSelected(): boolean {
    if (!this.product || !this.product.options || this.product.options.length === 0) {
      return true;
    }
    return this.product.options.every(opt => !!this.selectedOptions[opt.id]);
  }

  selectOption(optionId: number, val: any): void {
    this.selectedOptions[optionId] = val;
    this.calculateDynamicPrice();
  }

  calculateDynamicPrice(): void {
    if (!this.product || !this.product.options || this.product.options.length === 0) {
      return;
    }

    if (!this.isAllOptionsSelected) {
      this.dynamicPrice = null;
      this.dynamicOriginalPrice = undefined;
      return;
    }

    const values = Object.values(this.selectedOptions)
      .map(v => v.randam_key)
      .filter(key => !!key);

    if (values.length === 0) return;

    this.calculatingPrice = true;
    this.productService.getProductPrice(this.product.id, values).subscribe({
      next: (res: any) => {
        if (res) {
          console.log(res);

          const detail = res.detail || res;
          const priceSale = detail.price_sale !== undefined && detail.price_sale !== null ? Number(detail.price_sale) : 0;
          const priceBase = detail.price !== undefined && detail.price !== null ? Number(detail.price) : 0;
          const discountPrice = detail.discount_price !== undefined && detail.discount_price !== null ? Number(detail.discount_price) : 0;

          if (priceSale > 0 && discountPrice == 0) {
            this.dynamicPrice = priceSale;
            this.dynamicOriginalPrice = priceBase > priceSale ? priceBase : undefined;
          } else if (discountPrice > 0) {
            this.dynamicPrice = discountPrice;
            this.dynamicOriginalPrice = undefined;
          } else {
            const resPrice = res.price !== undefined && res.price !== null ? Number(res.price) : 0;
            if (resPrice > 0) {
              this.dynamicPrice = resPrice;
            }
            this.dynamicOriginalPrice = undefined;
          }

          this.dynamicDetailId = detail.id || res.detail_id || res.id || null;
        }
        this.calculatingPrice = false;
      },
      error: () => {
        this.calculatingPrice = false;
      }
    });
  }

  // Zoom methods
  onImgMouseMove(e: MouseEvent): void {
    const el = e.currentTarget as HTMLElement;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    this.zoomX = e.pageX - left - window.scrollX - 40;
    this.zoomY = e.pageY - top - window.scrollY - 40;
    this.zoomBgPos = `${x}% ${y}%`;
    this.zoomVisible = true;
  }

  onImgMouseLeave(): void {
    this.zoomVisible = false;
  }

  increment(): void { this.quantity++; }
  decrement(): void { if (this.quantity > 1) this.quantity--; }

  checkWishlist(): void {
    if (this.product) {
      this.isWishlisted = this.wishlistService.isInWishlist(this.product.id);
    }
  }

  toggleWishlist(): void {
    if (!this.product) return;
    if (this.isWishlisted) {
      this.wishlistService.remove(this.product.id).subscribe();
    } else {
      this.wishlistService.add(this.product.id, this.product).subscribe();
    }
    this.isWishlisted = !this.isWishlisted;
  }

  addToCart(): void {
    if (!this.product) return;
    this.addingToCart = true;

    // Convert selected options back to the format cart expects, or just send the first color/type found
    // If cart logic requires color/type specifically, map them:
    let colorId, colorName, typeId, typeName;
    if (this.product.options) {
      for (const opt of this.product.options) {
        const val = this.selectedOptions[opt.id];
        if (!val) continue;
        if (opt.type === 'Color' || opt.label_en?.toLowerCase() === 'color' || opt.label_ar === 'اللون') {
          colorId = val.id;
          colorName = this.lang.current === 'ar' ? val.name_ar : val.name_en;
        } else {
          typeId = val.id;
          typeName = this.lang.current === 'ar' ? val.name_ar : val.name_en;
        }
      }
    }

    // Format selectedOptions to match exactly what is shown in payload:
    // [{id: 1024, name_ar: "أبيض", name_en: "white", display_value: "#ffffff", randam_key: "1931232", option_id: 1022}, ...]
    const optionsArray = Object.values(this.selectedOptions).map((val: any) => ({
      id: val.id,
      name_ar: val.name_ar,
      name_en: val.name_en,
      display_value: val.display_value,
      randam_key: val.randam_key,
      option_id: val.option_id
    }));

    this.cartService.addProduct(
      this.product,
      this.quantity,
      colorId,
      colorName,
      typeId,
      typeName,
      this.currentPrice,
      this.dynamicDetailId || undefined,
      optionsArray
    );
    setTimeout(() => { this.addingToCart = false; }, 500);
  }

  get name(): string {
    if (!this.product) return '';
    return this.lang.current === 'ar'
      ? (this.product.name_ar || this.product.name || '')
      : (this.product.name_en || this.product.name || '');
  }

  get description(): string {
    if (!this.product) return '';
    return this.lang.current === 'ar'
      ? (this.product.content_ar || this.product.description_ar || this.product.description || '')
      : (this.product.content_en || this.product.description_en || this.product.description || '');
  }

  get currentPrice(): number {
    if (this.dynamicPrice !== null) return this.dynamicPrice;
    return this.product?.price || 0;
  }

  get currentOriginalPrice(): number | undefined {
    if (this.dynamicPrice !== null) {
      return this.dynamicOriginalPrice;
    }
    return this.product?.original_price;
  }

  get discount(): number {
    const current = this.currentPrice;
    const original = this.currentOriginalPrice;
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
