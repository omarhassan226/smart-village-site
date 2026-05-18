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
  wishlistCount = 0;
  isLoggedIn = false;
  isScrolled = false;
  mobileMenuOpen = false;
  activeDropdown: number | null = null;
  userDropdownOpen = false;
  searchCategoryId = '';

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
  ) { }

  ngOnInit(): void {
    this.auth.user$.pipe(takeUntil(this.destroy$)).subscribe((u) => {
      this.isLoggedIn = !!u;
    });

    this.cart.cart$.pipe(takeUntil(this.destroy$)).subscribe((c) => {
      this.cartCount = c.items?.length;
    });

    this.wishlist.ids$.pipe(takeUntil(this.destroy$)).subscribe((ids) => {
      this.wishlistCount = ids.size;
    });

    this.categoryService.getMainCategories().subscribe({
      next: (res) => (this.categories = res.data),
      error: () => { },
    });

    this.bannerService.getSocialLinks().subscribe({
      next: (links) => (this.socialLinks = links),
      error: () => { },
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
    if (this.searchQuery.trim() || this.searchCategoryId) {
      const queryParams: any = {};
      if (this.searchQuery.trim()) queryParams.key_word = this.searchQuery.trim();
      if (this.searchCategoryId) queryParams.main_category = this.searchCategoryId;

      this.router.navigate(['/products'], { queryParams });

      this.searchQuery = '';
      // We keep searchCategoryId or clear it based on preference. Let's clear it for a fresh start.
      this.searchCategoryId = '';
      if (this.mobileMenuOpen) this.toggleMobileMenu();
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
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  toggleUserDropdown(): void {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  setDropdown(id: number | null): void {
    this.activeDropdown = id;
  }

  getCategoryName(cat: MainCategory | any): string {
    const name = this.lang.current === 'ar'
      ? cat.category_ar || cat.name_ar || cat.name || ''
      : cat.category_en || cat.name_en || cat.name || '';
      
    if (this.lang.current === 'en' && name === 'عروض حصرية') return 'Exclusive Offers';
    return name;
  }

  openCart(e: Event): void {
    e.preventDefault();
    this.cart.openSidebar();
  }

  getWhatsAppLink(phone?: string): string {
    if (!phone) return '#';
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('968') || cleanPhone.length > 8) {
      return `https://wa.me/${cleanPhone}`;
    }
    return `https://wa.me/968${cleanPhone}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    document.body.style.overflow = '';
  }
}
