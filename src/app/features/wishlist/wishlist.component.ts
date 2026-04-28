import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../core/models';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, SharedModule],
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(private wishlist: WishlistService) {}

  ngOnInit(): void {
    this.wishlist.load().subscribe({
      next: (res) => { this.products = res.data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  onWishlistToggled(product: Product): void {
    this.products = this.products.filter((p) => p.id !== product.id);
  }
}
