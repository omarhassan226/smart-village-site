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

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, SharedModule, FormsModule, ShippingModalComponent],
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  similarProducts: Product[] = [];
  loading = true;

  selectedImage = '';
  allImages: string[] = [];
  currentSlide = 0;

  selectedColor: ProductColor | null = null;
  selectedType: ProductType | null = null;
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
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) this.loadProduct(id);
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
        const p = res.data;
        this.allImages = [p.image, ...(p.images || [])].filter((img: any) => !!img);
        this.selectedImage = this.allImages[0] || '';
        this.selectedColor = p.colors?.[0] || null;
        this.selectedType = p.types?.[0] || null;
        this.checkWishlist();
        this.loadSimilar(p.category_id);
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
    this.cartService.addProduct(
      this.product,
      this.quantity,
      this.selectedColor?.id,
      this.selectedColor?.name,
      this.selectedType?.id,
      this.selectedType?.name
    );
    setTimeout(() => { this.addingToCart = false; }, 500);
  }

  get name(): string {
    return this.lang.current === 'ar' ? this.product?.name_ar || '' : this.product?.name_en || '';
  }

  get description(): string {
    return this.lang.current === 'ar' ? this.product?.description_ar || '' : this.product?.description_en || '';
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

  ngOnDestroy(): void { }
}
