import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryService } from '../../../../core/services/category.service';
import { MainCategory } from '../../../../core/models';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-categories-grid',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <section class="categories-section" *ngIf="categories.length > 0">
      <div class="container">
        <div class="section-title">
           <span class="subtitle">{{ 'EXPLORE_OUR_CATEGORIES' | translate }}</span>
           <h2>{{ 'SHOP_BY_CATEGORY' | translate }}</h2>
        </div>
        
        <div class="categories-grid">
          <!-- Static Deals & Offers Card -->
          <a [routerLink]="['/products']" [queryParams]="{ status: 'desc' }" 
             class="category-card" style="--cat-color: #ef4444">
            <div class="category-icon-wrapper">
              <div class="category-bg"></div>
              <i class="uil uil-percentage static-icon"></i>
            </div>
            <span class="category-name">{{ 'OFFERS_DISCOUNTS' | translate }}</span>
          </a>

          <a [routerLink]="['/products']" [queryParams]="{ category_id: cat.id }" 
             class="category-card" *ngFor="let cat of categories; let i = index"
             [style.--cat-color]="getCategoryColor(i)">
            <div class="category-icon-wrapper">
              <div class="category-bg"></div>
              <ng-container *ngIf="getCategoryIcon(cat) as iconName; else imgTpl">
                <i class="uil cat-icon" [ngClass]="iconName"></i>
              </ng-container>
              <ng-template #imgTpl>
                <img [src]="cat.image" [alt]="getName(cat)" class="cat-img"
                     onerror="this.onerror=null;this.src='assets/images/placeholder.svg'">
              </ng-template>
            </div>
            <span class="category-name">{{ getName(cat) }}</span>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .categories-section {
      padding: 4rem 0;
      background: #ffffff;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 3.5rem 2.5rem;
      justify-content: center;
    }

    .category-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      text-decoration: none;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        transform: translateY(-15px);
        
        .category-icon-wrapper {
          box-shadow: 0 25px 50px -12px var(--cat-color);
          transform: scale(1.1) rotate(4deg);
          border-color: transparent;
        }
        
        .category-bg { opacity: 0.15; transform: scale(1.2); }
        .category-name { color: var(--cat-color); transform: scale(1.05); }
        .cat-icon, .cat-img, .static-icon { transform: scale(1.1); }
      }
    }

    .category-icon-wrapper {
      width: 90px;
      height: 90px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 42px;
      background: #f8fafc;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid #f1f5f9;
      
      .cat-img, .cat-icon, .static-icon {
        width: 55%;
        height: 55%;
        object-fit: contain;
        position: relative;
        z-index: 2;
        transition: all 0.5s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cat-icon, .static-icon {
        font-size: 2.2rem;
        color: var(--cat-color);
      }
    }

    .category-bg {
      position: absolute;
      inset: 0;
      background: var(--cat-color);
      opacity: 0.04;
      transition: all 0.5s ease;
      z-index: 1;
      border-radius: inherit;
    }

    .category-name {
      font-size: 1.1rem;
      font-weight: 800;
      color: #1e293b;
      text-align: center;
      line-height: 1.3;
      transition: all 0.4s ease;
      max-width: 140px;
      letter-spacing: -0.01em;
    }

    @media (max-width: 768px) {
      .categories-section { padding: 4rem 0; }
      .categories-grid { 
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 2.5rem 1.5rem;
      }
      .category-icon-wrapper { width: 100px; height: 100px; border-radius: 32px; }
      .section-title { font-size: 2rem; }
    }

    @media (max-width: 480px) {
      .categories-grid { 
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem 1rem;
      }
      .category-icon-wrapper { width: 85px; height: 85px; border-radius: 28px; }
      .category-name { font-size: 0.9rem; }
    }
  `]
})
export class CategoriesGridComponent implements OnInit {
  categories: MainCategory[] = [];

  private colors = [
    '#2bbcbf', '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#f43f5e', '#6366f1', '#14b8a6'
  ];

  constructor(private categoryService: CategoryService, public lang: LanguageService) { }

  ngOnInit(): void {
    this.categoryService.getMainCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
      }
    });
  }

  getCategoryIcon(cat: MainCategory): string | null {
    const name = this.getName(cat).toLowerCase();

    // Exact & Keyword mapping with plural and variant support
    if (name.includes('عطر') || name.includes('perfume') || name.includes('بخور') || name.includes('عود')) return 'uil-flask';

    // Phones & Accessories
    if (name.includes('جوال') || name.includes('هاتف') || name.includes('هواتف') || name.includes('mobile') || name.includes('phone') || name.includes('اتصال')) return 'uil-mobile-android';

    if (name.includes('ساع') || name.includes('watch')) return 'uil-watch';

    // Beauty & Makeup
    if (name.includes('جمال') || name.includes('عناية') || name.includes('beauty') || name.includes('care') || name.includes('مكياج') || name.includes('تجميل')) return 'uil-heart';

    // Electronics & Appliances
    if (name.includes('إلكترو') || name.includes('كهربا') || name.includes('electro') || name.includes('أجهزة')) return 'uil-laptop';

    if (name.includes('منزل') || name.includes('بيت') || name.includes('home') || name.includes('أدوات')) return 'uil-home';

    if (name.includes('ملابس') || name.includes('أزياء') || name.includes('fashion') || name.includes('clothing') || name.includes('ثوب') || name.includes('رجالي') || name.includes('نسائي')) return 'uil-shirt';

    if (name.includes('نظار') || name.includes('glass')) return 'uil-eyeglasses';

    if (name.includes('حقائب') || name.includes('bags') || name.includes('شنط')) return 'uil-shopping-bag';

    if (name.includes('أحذية') || name.includes('shoes') || name.includes('جزمة')) return 'uil-step-forward';

    if (name.includes('ألعاب') || name.includes('game') || name.includes('بلايستيشن') || name.includes('جيمنج')) return 'uil-game-structure';

    if (name.includes('هدايا') || name.includes('gift')) return 'uil-gift';

    // Computers & Networks
    if (name.includes('كمبيوتر') || name.includes('حاسوب') || name.includes('حواسيب') || name.includes('computer') || name.includes('شبكات') || name.includes('طابعات')) return 'uil-desktop';

    if (name.includes('سماعات') || name.includes('headphone') || name.includes('audio')) return 'uil-headphones';

    if (name.includes('كاميرا') || name.includes('camera') || name.includes('تصوير')) return 'uil-camera';

    // Generic/Other
    if (name.includes('أخرى') || name.includes('other') || name.includes('إكسسوار') || name.includes('access')) return 'uil-apps';

    // Cables & Adapters
    if (name.includes('وصل') || name.includes('محول') || name.includes('cable') || name.includes('adapter') || name.includes('usb')) return 'uil-plug';

    return null;
  }

  getCategoryColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  getName(cat: MainCategory): string {
    const name = (this.lang.current === 'ar' ? cat.category_ar || cat.name_ar || cat.name || '' : cat.category_en || cat.name_en || cat.name || '');
    if (this.lang.current === 'en' && name === 'عروض حصرية') return 'Exclusive Offers';
    return name;
  }
}
