import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="features-section">
      <div class="container">
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon feature-icon--green">
              <i class="uil uil-truck"></i>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">{{ 'FREE_SHIPPING' | translate }}</h3>
              <p class="feature-desc">{{ 'FREE_SHIPPING_DESC' | translate }}</p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon feature-icon--blue">
              <i class="uil uil-shield-check"></i>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">{{ 'SECURE_PAYMENT' | translate }}</h3>
              <p class="feature-desc">{{ 'SECURE_PAYMENT_DESC' | translate }}</p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon feature-icon--red">
              <i class="uil uil-headset"></i>
            </div>
            <div class="feature-content">
              <h3 class="feature-title">{{ 'SUPPORT_247' | translate }}</h3>
              <p class="feature-desc">{{ 'SUPPORT_247_DESC' | translate }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .features-section {
      padding: 3rem 0;
      background: #fff;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 2rem;
      border-radius: 20px;
      transition: all 0.3s ease;
      background: #f8fafc;
      border: 1px solid #f1f5f9;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
        background: #fff;
        border-color: var(--primary-light);
      }
    }

    .feature-icon {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin-bottom: 1.5rem;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 50%;
        opacity: 0.1;
        background: currentColor;
      }

      &--green { color: #22c55e; }
      &--blue { color: #3b82f6; }
      &--red { color: #ef4444; }
    }

    .feature-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .feature-desc {
      font-size: 0.95rem;
      color: #64748b;
      line-height: 1.6;
    }

    @media (max-width: 992px) {
      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 576px) {
      .features-grid {
        grid-template-columns: 1fr;
      }
      .features-section { padding: 2rem 0; }
    }
  `]
})
export class FeaturesSectionComponent {}
