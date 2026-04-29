import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductColor, ProductType } from '../../../core/models';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, FormsModule],
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.scss'],
})
export class QuickViewComponent implements OnChanges {
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  selectedImage = '';
  selectedColor: ProductColor | null = null;
  selectedType: ProductType | null = null;
  quantity = 1;
  addingToCart = false;

  // Image zoom
  zoomVisible = false;
  zoomX = 0;
  zoomY = 0;
  zoomBgPos = '0% 0%';
  zoomBgSize = '300% 300%';

  constructor(
    private cart: CartService,
    public wishlist: WishlistService,
    private auth: AuthService,
    private notify: NotificationService,
    private translate: TranslateService,
    public lang: LanguageService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.selectedImage = this.product.image;
      this.selectedColor = this.product.colors?.[0] || null;
      this.selectedType = this.product.types?.[0] || null;
      this.quantity = 1;
    }
    if (changes['isOpen']) {
      document.body.style.overflow = this.isOpen ? 'hidden' : '';
    }
  }

  get name(): string {
    if (!this.product) return '';
    return (this.lang.current === 'ar' ? this.product.name_ar : this.product.name_en) || this.product.name;
  }

  get currentPrice(): number {
    const base = this.product?.price || 0;
    return base + (this.selectedType?.extra_price || 0);
  }

  get discount(): number {
    if (!this.product) return 0;
    if (this.product.discount_percentage) return this.product.discount_percentage;
    if (this.product.original_price && this.product.original_price > this.product.price) {
      return Math.round(((this.product.original_price - this.product.price) / this.product.original_price) * 100);
    }
    return 0;
  }

  get allImages(): string[] {
    if (!this.product) return [];
    const sliderImgs = (this.product.sliders || []).map(
      (s) => `https://smartvillageapp.com/app/${s.image}`
    );
    const imgs = sliderImgs.length ? sliderImgs : this.product.images || [];
    const main = this.product.image;
    const all = [main, ...imgs.filter((i) => i !== main)];
    return [...new Set(all)].filter(Boolean);
  }

  get isWishlisted(): boolean {
    return this.wishlist.isInWishlist(Number(this.product?.id || 0));
  }

  selectImage(img: string): void {
    this.selectedImage = img;
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
        this.notify.success(this.translate.instant(was ? 'REMOVED_FROM_WISHLIST' : 'ADDED_TO_WISHLIST'));
      },
      error: () => this.notify.error(this.translate.instant('ERROR')),
    });
  }

  goToDetail(): void {
    if (!this.product) return;
    this.close.emit();
    this.router.navigate(['/products', this.product.id]);
  }

  onImgMouseMove(event: MouseEvent): void {
    const container = (event.currentTarget as HTMLElement);
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;

    this.zoomVisible = true;
    this.zoomX = x - 30;
    this.zoomY = y - 30;
    this.zoomBgPos = `${xPct}% ${yPct}%`;
    this.zoomBgSize = '300% 300%';
  }

  onImgMouseLeave(): void {
    this.zoomVisible = false;
  }

  onOverlayClick(): void {
    this.close.emit();
  }
}
