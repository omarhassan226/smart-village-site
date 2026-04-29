import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product, ProductColor, ProductType } from '../../../core/models';
import { ShippingModalComponent } from '../components/shipping-modal/shipping-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';

const STORAGE_BASE = 'https://smartvillageapp.com/app';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, SharedModule, FormsModule, ShippingModalComponent],
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  similarProducts: Product[] = [];
  loading = true;

  selectedImage = '';
  selectedColor: ProductColor | null = null;
  selectedType: ProductType | null = null;
  quantity = 1;
  addingToCart = false;
  shippingModalOpen = false;

  activeTab: 'details' | 'shipping' = 'details';

  // Image zoom
  zoomVisible = false;
  zoomX = 0;
  zoomY = 0;
  zoomBgPos = '0% 0%';

  // Slider
  currentSlide = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cart: CartService,
    public wishlist: WishlistService,
    private auth: AuthService,
    private notify: NotificationService,
    private translate: TranslateService,
    public lang: LanguageService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = +params.get('id')!;
      this.loadProduct(id);
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (res) => {
        this.product = res.data;
        this.selectedImage = this.allImages[0] || res.data.image;
        this.currentSlide = 0;
        this.selectedColor = res.data.colors?.[0] || null;
        this.selectedType = res.data.types?.[0] || null;
        this.loading = false;
        this.loadSimilar(id);
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/products']);
      },
    });
  }

  loadSimilar(id: number): void {
    this.productService.getSimilar(id).subscribe({
      next: (res) => {
        this.similarProducts = res.data.slice(0, 6);
      },
      error: () => { },
    });
  }

  get name(): string {
    if (!this.product) return '';
    return (this.lang.current === 'ar' ? this.product.name_ar : this.product.name_en) || this.product.name;
  }

  get description(): string {
    if (!this.product) return '';
    const desc = this.lang.current === 'ar'
      ? (this.product.description_ar || this.product.content_ar)
      : (this.product.description_en || this.product.content_en);
    return desc || this.product.description || '';
  }

  get discount(): number {
    if (!this.product) return 0;
    if (this.product.discount_percentage) return this.product.discount_percentage;
    if (this.product.original_price && this.product.original_price > this.product.price) {
      return Math.round(
        ((this.product.original_price - this.product.price) / this.product.original_price) * 100
      );
    }
    return 0;
  }

  get currentPrice(): number {
    const base = this.product?.price || 0;
    return base + (this.selectedType?.extra_price || 0);
  }

  get allImages(): string[] {
    if (!this.product) return [];
    const sliders = (this.product.sliders || []).map((s) => `${STORAGE_BASE}/${s.image}`);
    const main = this.product.image as string;
    const all = sliders.length ? [main, ...sliders.filter((i) => i !== main)] : [main];
    return [...new Set(all)].filter(Boolean);
  }

  get isWishlisted(): boolean {
    return this.wishlist.isInWishlist(Number(this.product?.id || 0));
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

  increment(): void {
    const max = this.product?.quantity;
    if (max !== undefined && this.quantity >= max) return;
    this.quantity++;
  }

  decrement(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
    if (!this.product) return;
    this.addingToCart = true;
    this.cart.addProduct(
      this.product,
      this.quantity,
      this.selectedColor?.id,
      this.selectedColor?.name,
      this.selectedType?.id,
      this.selectedType?.name,
      this.currentPrice
    );
    this.addingToCart = false;
    this.notify.success(this.translate.instant('ADDED_TO_CART'));
  }

  toggleWishlist(): void {
    if (!this.product) return;
    const was = this.isWishlisted;
    this.wishlist.toggle(this.product.id, this.product).subscribe({
      next: () => {
        const key = was ? 'REMOVED_FROM_WISHLIST' : 'ADDED_TO_WISHLIST';
        this.notify.success(this.translate.instant(key));
      },
      error: () => this.notify.error(this.translate.instant('ERROR')),
    });
  }

  // Image Zoom
  onImgMouseMove(event: MouseEvent): void {
    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;

    this.zoomVisible = true;
    this.zoomX = x - 30;
    this.zoomY = y - 30;
    this.zoomBgPos = `${xPct}% ${yPct}%`;
  }

  onImgMouseLeave(): void {
    this.zoomVisible = false;
  }
}
