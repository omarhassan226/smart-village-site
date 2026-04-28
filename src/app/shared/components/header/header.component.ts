import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CategoryService } from '../../../core/services/category.service';
import { LanguageService } from '../../../core/services/language.service';
import { MainCategory } from '../../../core/models';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, FormsModule],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  categories: MainCategory[] = [];
  searchQuery = '';
  cartCount = 0;
  isLoggedIn = false;
  isScrolled = false;
  mobileMenuOpen = false;
  activeDropdown: number | null = null;

  constructor(
    public auth: AuthService,
    public cart: CartService,
    public wishlist: WishlistService,
    public lang: LanguageService,
    private categoryService: CategoryService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.auth.user$.pipe(takeUntil(this.destroy$)).subscribe((u) => {
      this.isLoggedIn = !!u;
    });

    this.cart.cart$.pipe(takeUntil(this.destroy$)).subscribe((c) => {
      this.cartCount = c.items_count;
    });

    this.categoryService.getMainCategories().subscribe({
      next: (res) => (this.categories = res.data),
      error: () => {},
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 60;
  }

  search(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { key_word: this.searchQuery.trim() },
      });
      this.searchQuery = '';
    }
  }

  toggleLanguage(): void {
    this.lang.toggle();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  setDropdown(id: number | null): void {
    this.activeDropdown = id;
  }

  getCategoryName(cat: MainCategory): string {
    return this.lang.current === 'ar'
      ? cat.name_ar || cat.name
      : cat.name_en || cat.name;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
