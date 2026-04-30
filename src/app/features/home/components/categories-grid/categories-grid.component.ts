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
        <div class="categories-grid">
          <a [routerLink]="['/products']" [queryParams]="{ category_id: cat.id }" 
             class="category-item" *ngFor="let cat of categories">
            <div class="category-icon">
              <img [src]="cat.image" [alt]="getName(cat)" 
                   onerror="this.onerror=null;this.src='assets/images/placeholder.svg'">
            </div>
            <span class="category-name">{{ getName(cat) }}</span>
          </a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .categories-section {
      padding: 2rem 0;
      background: #fff;
      margin-bottom: 1rem;
    }

    .categories-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 2rem;
    }

    .category-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
      transition: all 0.3s ease;
      width: 100px;

      &:hover {
        transform: translateY(-5px);
        
        .category-icon {
          background: var(--primary);
          box-shadow: 0 15px 30px -5px rgba(43, 188, 191, 0.3);
          
          img { filter: brightness(0) invert(1); }
        }
        
        .category-name { color: var(--primary); }
      }
    }

    .category-icon {
      width: 80px;
      height: 80px;
      background: #f8fafc;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      border: 1px solid #f1f5f9;

      img {
        width: 45px;
        height: 45px;
        object-fit: contain;
        transition: all 0.3s ease;
      }
    }

    .category-name {
      font-size: 0.9rem;
      font-weight: 700;
      color: #334155;
      text-align: center;
      line-height: 1.3;
    }

    @media (max-width: 576px) {
      .categories-grid { gap: 1.25rem; }
      .category-item { width: 80px; }
      .category-icon { width: 64px; height: 64px; border-radius: 18px; 
        img { width: 35px; height: 35px; }
      }
      .category-name { font-size: 0.8rem; }
    }
  `]
})
export class CategoriesGridComponent implements OnInit {
  categories: MainCategory[] = [];

  constructor(private categoryService: CategoryService, public lang: LanguageService) { }

  ngOnInit(): void {
    this.categoryService.getMainCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
      }
    });
  }

  getName(cat: MainCategory): string {
    return (this.lang.current === 'ar' ? cat.category_ar || cat.name_ar || cat.name || '' : cat.category_en || cat.name_en || cat.name || '');
  }
}
