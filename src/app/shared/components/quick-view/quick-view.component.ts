import { SharedModule } from '../../shared.module';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { Product, ProductColor, ProductType } from '../../../core/models';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, FormsModule],
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.scss'],
})
export class QuickViewComponent implements OnInit, OnChanges {
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  selectedImage = '';
  allImages: string[] = [];
  selectedColor: ProductColor | null = null;
  selectedType: ProductType | null = null;
  quantity = 1;

  isWishlisted = false;
  addingToCart = false;

  // Zoom
  zoomVisible = false;
  zoomX = 0;
  zoomY = 0;
  zoomBgPos = '0% 0%';
  zoomBgSize = '200%';

  constructor(
    public lang: LanguageService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.allImages = [this.product.image, ...(this.product.images || [])].filter(img => !!img);
      this.selectedImage = this.allImages[0] || '';
      this.selectedColor = this.product.colors?.[0] || null;
      this.selectedType = this.product.types?.[0] || null;
      this.quantity = 1;
      this.checkWishlist();
    }
    if (changes['isOpen'] && this.isOpen) {
      document.body.style.overflow = 'hidden';
    } else if (changes['isOpen'] && !this.isOpen) {
      document.body.style.overflow = '';
    }
  }

  selectImage(img: string): void {
    this.selectedImage = img;
  }

  // Zoom
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

  addToCart(): void {
    if (!this.product) return;
    this.addingToCart = true;
    this.cartService.addProduct(
      this.product,
      this.quantity,
      this.selectedColor?.id,
      this.selectedColor?.name,
      this.selectedType?.id,
      this.selectedType?.name
    );
    setTimeout(() => {
      this.addingToCart = false;
      this.close.emit();
    }, 500);
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

  checkWishlist(): void {
    if (this.product) {
      this.isWishlisted = this.wishlistService.isInWishlist(this.product.id);
    }
  }

  onOverlayClick(): void {
    this.close.emit();
  }

  goToDetail(): void {
    if (this.product) {
      this.close.emit();
      this.router.navigate(['/products', this.product.id]);
    }
  }

  get name(): string {
    return this.lang.current === 'ar' ? this.product?.name_ar || '' : this.product?.name_en || '';
  }

  get currentPrice(): number {
    let p = this.product?.price || 0;
    if (this.selectedType?.extra_price) p += Number(this.selectedType.extra_price);
    return p;
  }

  get discount(): number {
    if (!this.product?.original_price || this.product.original_price <= this.product.price) return 0;
    return Math.round(((this.product.original_price - this.product.price) / this.product.original_price) * 100);
  }
}
