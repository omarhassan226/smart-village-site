import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CategoryService } from '../../../core/services/category.service';
import { LanguageService } from '../../../core/services/language.service';
import { BannerService } from '../../../core/services/banner.service';
import { MainCategory, SocialLinks } from '../../../core/models';

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
  socialLinks: SocialLinks = {};
  searchQuery = '';
  cartCount = 0;
  isLoggedIn = false;
  isScrolled = false;
  mobileMenuOpen = false;
  activeDropdown: number | null = null;
  userDropdownOpen = false;

  constructor(
    public auth: AuthService,
    public cart: CartService,
    public wishlist: WishlistService,
    public lang: LanguageService,
    private categoryService: CategoryService,
    private bannerService: BannerService,
    private router: Router,
    private translate: TranslateService,
    private elRef: ElementRef
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

    this.bannerService.getSocialLinks().subscribe({
      next: (links) => (this.socialLinks = links),
      error: () => {},
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 60;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.userDropdownOpen) {
      const userEl = this.elRef.nativeElement.querySelector('.header__user');
      if (userEl && !userEl.contains(event.target as Node)) {
        this.userDropdownOpen = false;
      }
    }
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
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  toggleUserDropdown(): void {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  setDropdown(id: number | null): void {
    this.activeDropdown = id;
  }

  getCategoryName(cat: MainCategory | any): string {
    return this.lang.current === 'ar'
      ? cat.category_ar || cat.name_ar || cat.name || ''
      : cat.category_en || cat.name_en || cat.name || '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.body.style.overflow = '';
  }
}
