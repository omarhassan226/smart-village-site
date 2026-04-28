import { SharedModule } from '../../shared/shared.module';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Cart, CartItem } from '../../core/models';
import { LanguageService } from '../../core/services/language.service';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [], total: 0, items_count: 0 };
  loading = true;

  constructor(
    public cartService: CartService,
    private notify: NotificationService,
    private translate: TranslateService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    this.cartService.load().subscribe({
      next: (res) => { this.cart = res.data; this.loading = false; },
      error: () => { this.loading = false; },
    });
    this.cartService.cart$.subscribe((c) => { this.cart = c; });
  }

  updateQty(item: CartItem, qty: number): void {
    if (!item.id) return;
    this.cartService.updateQuantity(item.id, qty).subscribe({
      error: () => this.notify.error(this.translate.instant('ERROR')),
    });
  }

  remove(item: CartItem): void {
    if (!item.id) return;
    this.cartService.remove(item.id).subscribe({
      next: () => this.notify.success(this.translate.instant('REMOVED_FROM_CART')),
      error: () => this.notify.error(this.translate.instant('ERROR')),
    });
  }

  getProductName(item: CartItem): string {
    const p = item.product;
    if (!p) return '';
    return (this.lang.current === 'ar' ? p.name_ar : p.name_en) || p.name;
  }
}
