import { SharedModule } from '../../../../shared/shared.module';
import { Component } from '@angular/core';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-promo-banner',
  template: `
    <section class="promo">
      <div class="container promo__grid">
        <div class="promo__card promo__card--primary">
          <div class="promo__text">
            <h3>{{ lang.current === 'ar' ? 'عروض حصرية' : 'Exclusive Deals' }}</h3>
            <p>{{ lang.current === 'ar' ? 'اكتشف أفضل الأسعار' : 'Discover the best prices' }}</p>
            <a routerLink="/products" class="btn btn-light btn-sm">{{ 'VIEW_ALL' | translate }}</a>
          </div>
          <div class="promo__icon">🛍️</div>
        </div>
        <div class="promo__card promo__card--secondary">
          <div class="promo__text">
            <h3>{{ lang.current === 'ar' ? 'شحن سريع' : 'Fast Delivery' }}</h3>
            <p>{{ lang.current === 'ar' ? 'توصيل لجميع المحافظات' : 'Delivery to all governorates' }}</p>
            <a routerLink="/products" class="btn btn-light btn-sm">{{ 'VIEW_ALL' | translate }}</a>
          </div>
          <div class="promo__icon">🚚</div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .promo {
      padding: 2rem 0;
    }

    .promo__grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    @media (max-width: 640px) { 
      .promo__grid { grid-template-columns: 1fr; } 
    }

    .promo__card {
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      overflow: hidden;
      position: relative;
    }

    .promo__card--primary { 
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); 
      color: #fff; 
    }

    .promo__card--secondary { 
      background: linear-gradient(135deg, var(--secondary) 0%, #2d5a8e 100%); 
      color: #fff; 
    }

    .promo__text h3 { 
      font-size: 1.3rem; 
      font-weight: 700; 
      margin-bottom: 0.5rem; 
    }

    .promo__text p { 
      font-size: 0.875rem; 
      opacity: 0.85; 
      margin-bottom: 1rem; 
    }

    .promo__icon { 
      font-size: 3.5rem; 
      flex-shrink: 0; 
    }
  `],
})
export class PromoBannerComponent {
  constructor(public lang: LanguageService) { }
}
