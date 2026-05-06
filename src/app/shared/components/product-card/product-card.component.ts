import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../core/models';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { QuickViewComponent } from '../quick-view/quick-view.component';

@Component({
  standalone: true,
  imports: [CommonModule, TruncatePipe, RouterModule, TranslateModule, QuickViewComponent],
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() compact = false;
  @Output() wishlistToggled = new EventEmitter<Product>();

  addingToCart = false;
  quickViewOpen = false;

  constructor(
    public wishlist: WishlistService,
    private cart: CartService,
    private auth: AuthService,
    private notify: NotificationService,
    private translate: TranslateService,
    private router: Router,
    public lang: LanguageService
  ) { }

  get name(): string {
    if (this.lang.current === 'ar') return this.product.name_ar || this.product.name;
    return this.product.name_en || this.product.name;
  }

  get discount(): number {
    if (this.product.discount_percentage) return this.product.discount_percentage;
    if (this.product.original_price && this.product.original_price > this.product.price) {
      return Math.round(
        ((this.product.original_price - this.product.price) / this.product.original_price) * 100
      );
    }
    return 0;
  }

  get isWishlisted(): boolean {
    return this.wishlist.isInWishlist(Number(this.product.id));
  }

  navigate(): void {
    this.router.navigate(['/products', this.product.id]);
  }

  addToCart(e: Event): void {
    e.stopPropagation();
    
    // If the product has options, redirect to detail page to select options first!
    if (this.product.options && this.product.options.length > 0) {
      this.navigate();
      return;
    }

    this.addingToCart = true;
    this.cart.addProduct(this.product, 1);
    this.addingToCart = false;
    this.notify.success(this.translate.instant('ADDED_TO_CART'));
  }

  openQuickView(e: Event): void {
    e.stopPropagation();
    this.quickViewOpen = true;
  }

  toggleWishlist(e: Event): void {
    e.stopPropagation();
    const was = this.isWishlisted;
    this.wishlist.toggle(this.product.id, this.product).subscribe({
      next: () => {
        const key = was ? 'REMOVED_FROM_WISHLIST' : 'ADDED_TO_WISHLIST';
        this.notify.success(this.translate.instant(key));
        this.wishlistToggled.emit(this.product);
      },
      error: () => this.notify.error(this.translate.instant('ERROR')),
    });
  }
}
