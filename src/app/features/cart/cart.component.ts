import { SharedModule } from '../../shared/shared.module';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Cart, CartItem } from '../../core/models';
import { LanguageService } from '../../core/services/language.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  cart: Cart = { items: [], total: 0, items_count: 0 };

  constructor(
    public cartService: CartService,
    private notify: NotificationService,
    private translate: TranslateService,
    public lang: LanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe((c) => {
      this.cart = c;
    });
  }

  getProductName(item: CartItem): string {
    const p = item.product;
    if (!p) return '';
    return (this.lang.current === 'ar' ? p.name_ar : p.name_en) || p.name;
  }

  getProductImage(item: CartItem): string {
    return item.product?.image || 'assets/images/placeholder.svg';
  }

  updateQty(item: CartItem, qty: number): void {
    if (qty < 1) return;
    this.cartService.updateQuantity(item.id, qty);
  }

  remove(item: CartItem): void {
    this.cartService.remove(item.id);
    this.notify.success(this.translate.instant('REMOVED_FROM_CART'));
  }

  clearAll(): void {
    this.cartService.clear();
    this.notify.success(this.translate.instant('CART_CLEARED'));
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
