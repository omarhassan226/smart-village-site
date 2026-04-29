import { SharedModule } from '../../shared/shared.module';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../core/models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(private wishlistService: WishlistService) { }

  ngOnInit(): void {
    // 1. Listen to wishlist changes (handles guest & logged-in users)
    this.wishlistService.products$.pipe(takeUntil(this.destroy$)).subscribe((products) => {
      this.products = products;
      console.log(products);

      this.loading = false;
    });

    // 2. Trigger initial load if needed (syncs with server if logged in)
    this.wishlistService.load().subscribe();
  }

  onWishlistToggled(product: Product): void {
    // Optimistic UI update: remove item from local list if toggled off
    this.products = this.products.filter((p) => p.id !== product.id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
