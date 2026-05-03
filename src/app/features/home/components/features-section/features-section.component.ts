import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-features-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="trust-section">
      <div class="container">
        <div class="trust-grid">
          <div class="trust-card card--green" style="--delay: 0.1s">
            <div class="icon-box">
              <i class="uil uil-truck"></i>
            </div>
            <div class="trust-content">
              <h3>{{ 'FREE_SHIPPING' | translate }}</h3>
              <p>{{ 'FREE_SHIPPING_DESC' | translate }}</p>
            </div>
          </div>

          <div class="trust-card card--blue" style="--delay: 0.2s">
            <div class="icon-box">
              <i class="uil uil-shield-check"></i>
            </div>
            <div class="trust-content">
              <h3>{{ 'SECURE_PAYMENT' | translate }}</h3>
              <p>{{ 'SECURE_PAYMENT_DESC' | translate }}</p>
            </div>
          </div>

          <div class="trust-card card--red" style="--delay: 0.3s">
            <div class="icon-box">
              <i class="uil uil-headphones"></i>
            </div>
            <div class="trust-content">
              <h3>{{ 'SUPPORT_247' | translate }}</h3>
              <p>{{ 'SUPPORT_247_DESC' | translate }}</p>
            </div>
          </div>

          <div class="trust-card card--gold" style="--delay: 0.4s">
            <div class="icon-box">
              <i class="uil uil-award"></i>
            </div>
            <div class="trust-content">
              <h3>{{ 'BEST_QUALITY' | translate }}</h3>
              <p>{{ 'BEST_QUALITY_DESC' | translate }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .trust-section {
      padding: 6rem 0;
      background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
      position: relative;
      overflow: hidden;
    }

    .trust-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }

    .trust-card {
      background: white;
      padding: 3rem 1.5rem;
      border-radius: 40px;
      border: 1px solid rgba(226, 232, 240, 0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      animation: fadeInUp 0.8s ease backwards var(--delay);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        inset: 0;
        opacity: 0;
        transition: opacity 0.5s ease;
        z-index: 0;
      }

      &:hover {
        transform: translateY(-12px);
        border-color: transparent;
        
        &::before { opacity: 0.1; }

        .icon-box {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 15px 30px -5px currentColor;
        }

        &.card--green { box-shadow: 0 30px 60px -15px rgba(16, 185, 129, 0.25); }
        &.card--blue { box-shadow: 0 30px 60px -15px rgba(59, 130, 246, 0.25); }
        &.card--red { box-shadow: 0 30px 60px -15px rgba(244, 63, 94, 0.25); }
        &.card--gold { box-shadow: 0 30px 60px -15px rgba(245, 158, 11, 0.25); }
      }

      &.card--green { &::before { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); } color: #10b981; }
      &.card--blue { &::before { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); } color: #3b82f6; }
      &.card--red { &::before { background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); } color: #f43f5e; }
      &.card--gold { &::before { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); } color: #f59e0b; }
    }

    .icon-box {
      width: 80px;
      height: 80px;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      margin-bottom: 2rem;
      position: relative;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1;
      background: #ffffff;
      box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.05);

      i { position: relative; z-index: 2; color: currentColor; }
    }

    .trust-content {
      position: relative;
      z-index: 1;
      
      h3 {
        font-size: 1.25rem;
        font-weight: 800;
        color: #1e293b;
        margin-bottom: 0.75rem;
      }

      p {
        font-size: 0.9rem;
        color: #64748b;
        line-height: 1.6;
        font-weight: 500;
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 1200px) {
      .trust-grid { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
    }

    @media (max-width: 640px) {
      .trust-grid { grid-template-columns: 1fr; }
      .trust-section { padding: 4rem 0; }
      .trust-card { padding: 2.5rem 1.5rem; }
    }
  `]
})
export class FeaturesSectionComponent implements OnInit {
  ngOnInit(): void { }
}
