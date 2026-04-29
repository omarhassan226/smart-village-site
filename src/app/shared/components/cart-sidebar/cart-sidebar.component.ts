import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { LanguageService } from '../../../core/services/language.service';
import { Cart, CartItem } from '../../../core/models';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.scss'],
})
export class CartSidebarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isOpen = false;
  cart: Cart = { items: [], total: 0, items_count: 0 };

  constructor(
    public cartService: CartService,
    public lang: LanguageService,
    private notify: NotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.cartService.sidebarOpen$.pipe(takeUntil(this.destroy$)).subscribe((open) => {
      this.isOpen = open;
      document.body.style.overflow = open ? 'hidden' : '';
    });

    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe((cart) => {
      this.cart = cart;
    });
  }

  close(): void {
    this.cartService.closeSidebar();
  }

  getProductName(item: CartItem): string {
    const p = item.product;
    if (!p) return '';
    return (this.lang.current === 'ar' ? p.name_ar : p.name_en) || p.name;
  }

  getProductImage(item: CartItem): string {
    return item.product?.image || 'assets/images/placeholder.svg';
  }

  increaseQty(item: CartItem): void {
    const max = item.product?.quantity;
    if (max !== undefined && item.quantity >= max) return;
    this.cartService.updateQuantity(item.id, item.quantity + 1);
  }

  decreaseQty(item: CartItem): void {
    if (item.quantity <= 1) return;
    this.cartService.updateQuantity(item.id, item.quantity - 1);
  }

  remove(item: CartItem): void {
    this.cartService.remove(item.id);
    this.notify.success(this.translate.instant('REMOVED_FROM_CART'));
  }

  trackById(_: number, item: CartItem): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.body.style.overflow = '';
  }
}
