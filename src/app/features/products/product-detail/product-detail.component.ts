import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
        this.selectedImage = res.data.image;
        this.selectedColor = res.data.colors?.[0] || null;
        this.selectedType = res.data.types?.[0] || null;
        this.loading = false;
        this.loadSimilar(id);
      },
      error: () => { this.loading = false; this.router.navigate(['/products']); },
    });
  }

  loadSimilar(id: number): void {
    this.productService.getSimilar(id).subscribe({
      next: (res) => { this.similarProducts = res.data.slice(0, 6); },
      error: () => { },
    });
  }

  get name(): string {
    if (!this.product) return '';
    return (this.lang.current === 'ar' ? this.product.name_ar : this.product.name_en) || this.product.name;
  }

  get description(): string {
    if (!this.product) return '';
    return (this.lang.current === 'ar' ? this.product.description_ar : this.product.description_en) || this.product.description || '';
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
    const imgs = this.product.images || [];
    return [this.product.image, ...imgs.filter((i) => i !== this.product!.image)];
  }

  get isWishlisted(): boolean {
    return this.wishlist.isInWishlist(this.product?.id || 0);
  }

  selectImage(img: string): void {
    this.selectedImage = img;
  }

  increment(): void {
    if (this.product?.quantity && this.quantity < this.product.quantity) this.quantity++;
    else if (!this.product?.quantity) this.quantity++;
  }

  decrement(): void {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart(): void {
    if (!this.product) return;
    // if (!this.auth.isLoggedIn) { this.router.navigate(['/auth/login']); return; }
    this.addingToCart = true;
    this.cart.add({
      product_id: this.product.id,
      quantity: this.quantity,
      color_id: this.selectedColor?.id,
      type_id: this.selectedType?.id,
    }).subscribe({
      next: () => {
        this.addingToCart = false;
        this.notify.success(this.translate.instant('ADDED_TO_CART'));
      },
      error: () => { this.addingToCart = false; this.notify.error(this.translate.instant('ERROR')); },
    });
  }

  toggleWishlist(): void {
    if (!this.product) return;
    if (!this.auth.isLoggedIn) { this.router.navigate(['/auth/login']); return; }
    const was = this.isWishlisted;
    this.wishlist.toggle(this.product.id).subscribe({
      next: () => {
        const key = was ? 'REMOVED_FROM_WISHLIST' : 'ADDED_TO_WISHLIST';
        this.notify.success(this.translate.instant(key));
      },
      error: () => this.notify.error(this.translate.instant('ERROR')),
    });
  }
}
