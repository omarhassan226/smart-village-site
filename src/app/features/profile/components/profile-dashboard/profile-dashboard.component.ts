import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  selector: 'app-profile-dashboard',
  template: `
    <div class="dashboard">
      <!-- Header Section -->
      <div class="dashboard__header">
        <div class="welcome-card">
          <div class="welcome-card__content">
            <h2 class="welcome-card__title">
              {{ 'WELCOME_USER' | translate }}, <span>{{ auth.user?.first_name }}</span>!
            </h2>
            <p class="welcome-card__desc">{{ 'DASHBOARD_WELCOME_DESC' | translate }}</p>
          </div>
          <div class="welcome-card__actions">
             <button (click)="logout()" class="logout-btn" [title]="'LOGOUT' | translate">
               <i class="uil uil-signout"></i>
               <span>{{ 'LOGOUT' | translate }}</span>
             </button>
          </div>
        </div>
      </div>

      <!-- Quick Stats / Navigation Grid -->
      <div class="dashboard__grid">
        <!-- My Orders -->
        <a routerLink="../orders" class="dash-card dash-card--primary">
          <div class="dash-card__icon"><i class="uil uil-clipboard-notes"></i></div>
          <div class="dash-card__info">
            <span class="dash-card__title">{{ 'MY_ORDERS' | translate }}</span>
            <span class="dash-card__subtitle">{{ 'DASH_ORDERS_SUB' | translate }}</span>
          </div>
          <div class="dash-card__arrow"><i class="uil uil-angle-right-b"></i></div>
        </a>

        <!-- Preparing Orders -->
        <a [routerLink]="['../orders']" [queryParams]="{ status: 'review' }" class="dash-card dash-card--warning">
          <div class="dash-card__icon"><i class="uil uil-box"></i></div>
          <div class="dash-card__info">
            <span class="dash-card__title">{{ 'PREPARING' | translate }}</span>
            <span class="dash-card__subtitle">{{ 'DASH_PREPARING_SUB' | translate }}</span>
          </div>
          <div class="dash-card__arrow"><i class="uil uil-angle-right-b"></i></div>
        </a>

        <!-- Delivering Orders -->
        <a [routerLink]="['../orders']" [queryParams]="{ status: 'delivering' }" class="dash-card dash-card--info">
          <div class="dash-card__icon"><i class="uil uil-truck"></i></div>
          <div class="dash-card__info">
            <span class="dash-card__title">{{ 'DELIVERING' | translate }}</span>
            <span class="dash-card__subtitle">{{ 'DASH_DELIVERING_SUB' | translate }}</span>
          </div>
          <div class="dash-card__arrow"><i class="uil uil-angle-right-b"></i></div>
        </a>

        <!-- Wishlist -->
        <a routerLink="/wishlist" class="dash-card dash-card--danger">
          <div class="dash-card__icon"><i class="uil uil-heart"></i></div>
          <div class="dash-card__info">
            <span class="dash-card__title">{{ 'WISHLIST' | translate }}</span>
            <span class="dash-card__subtitle">{{ 'DASH_WISHLIST_SUB' | translate }}</span>
          </div>
          <div class="dash-card__arrow"><i class="uil uil-angle-right-b"></i></div>
        </a>

        <!-- Profile Info -->
        <a routerLink="../info" class="dash-card dash-card--success">
          <div class="dash-card__icon"><i class="uil uil-user-circle"></i></div>
          <div class="dash-card__info">
            <span class="dash-card__title">{{ 'UPDATE_PROFILE' | translate }}</span>
            <span class="dash-card__subtitle">{{ 'DASH_PROFILE_SUB' | translate }}</span>
          </div>
          <div class="dash-card__arrow"><i class="uil uil-angle-right-b"></i></div>
        </a>

        <!-- Addresses -->
        <a routerLink="../addresses" class="dash-card dash-card--purple">
          <div class="dash-card__icon"><i class="uil uil-map-marker"></i></div>
          <div class="dash-card__info">
            <span class="dash-card__title">{{ 'MY_ADDRESSES' | translate }}</span>
            <span class="dash-card__subtitle">{{ 'DASH_ADDRESS_SUB' | translate }}</span>
          </div>
          <div class="dash-card__arrow"><i class="uil uil-angle-right-b"></i></div>
        </a>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 1rem 0;
    }

    .dashboard {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;

      .dashboard__header {
        position: relative;
      }

      .dashboard__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
      }
    }

    /* Welcome Card */
    .welcome-card {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border-radius: 28px;
      padding: 3rem;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      overflow: hidden;
      position: relative;
      border: 1px solid rgba(255, 255, 255, 0.1);

      &::before {
        content: '';
        position: absolute;
        top: -100px;
        right: -100px;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(43, 188, 191, 0.15) 0%, transparent 70%);
        border-radius: 50%;
      }

      .welcome-card__content {
        position: relative;
        z-index: 2;
      }

      .welcome-card__title {
        font-size: 2.2rem;
        font-weight: 800;
        margin-bottom: 0.75rem;
        letter-spacing: -0.5px;
        span { color: var(--primary); }
      }

      .welcome-card__desc {
        font-size: 1.1rem;
        color: #94a3b8;
        max-width: 500px;
        line-height: 1.6;
      }
    }

    .logout-btn {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #f87171;
      padding: 0.85rem 1.75rem;
      border-radius: 14px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 2;

      &:hover {
        background: #ef4444;
        color: white;
        transform: translateY(-3px);
        box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.4);
      }

      i { font-size: 1.4rem; }
    }

    /* Dash Cards */
    .dash-card {
      background: #ffffff;
      border: 1px solid #f1f5f9;
      border-radius: 24px;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      text-decoration: none;
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
      position: relative;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.08);
        border-color: var(--primary-light, #e2e8f0);

        .dash-card__arrow {
          transform: translateX(8px);
          color: var(--primary);
          opacity: 1;
        }

        .dash-card__icon {
          transform: scale(1.1) rotate(5deg);
        }
      }

      .dash-card__icon {
        width: 64px;
        height: 64px;
        border-radius: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        flex-shrink: 0;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          opacity: 0.15;
          background: currentColor;
        }
      }

      .dash-card__info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }

      .dash-card__title {
        font-size: 1.2rem;
        font-weight: 800;
        color: #1e293b;
        letter-spacing: -0.3px;
      }

      .dash-card__subtitle {
        font-size: 0.9rem;
        color: #64748b;
        line-height: 1.4;
      }

      .dash-card__arrow {
        font-size: 1.5rem;
        color: #cbd5e1;
        opacity: 0.5;
        transition: all 0.3s ease;
      }

      /* Variations with Premium Colors */
      &.dash-card--primary { 
        .dash-card__icon { color: #3b82f6; } 
        &:hover { border-bottom: 4px solid #3b82f6; }
      }
      &.dash-card--warning { 
        .dash-card__icon { color: #f59e0b; } 
        &:hover { border-bottom: 4px solid #f59e0b; }
      }
      &.dash-card--info { 
        .dash-card__icon { color: #06b6d4; } 
        &:hover { border-bottom: 4px solid #06b6d4; }
      }
      &.dash-card--danger { 
        .dash-card__icon { color: #ef4444; } 
        &:hover { border-bottom: 4px solid #ef4444; }
      }
      &.dash-card--success { 
        .dash-card__icon { color: #10b981; } 
        &:hover { border-bottom: 4px solid #10b981; }
      }
      &.dash-card--purple { 
        .dash-card__icon { color: #8b5cf6; } 
        &:hover { border-bottom: 4px solid #8b5cf6; }
      }
    }

    /* RTL Support */
    [dir="rtl"] {
      .dash-card__arrow { transform: scaleX(-1); }
      .dash-card:hover .dash-card__arrow { transform: scaleX(-1) translateX(8px); }
      .welcome-card::before { right: auto; left: -100px; }
    }

    @media (max-width: 992px) {
      .welcome-card {
        padding: 2.5rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 2rem;
      }
      .logout-btn { width: 100%; justify-content: center; }
      .welcome-card__title { font-size: 1.8rem; }
    }

    @media (max-width: 640px) {
      .dashboard__grid {
        grid-template-columns: 1fr;
      }
      .dash-card { padding: 1.5rem; }
      .dash-card__icon { width: 56px; height: 56px; font-size: 1.75rem; }
    }
  `]
})
export class ProfileDashboardComponent {
  constructor(public auth: AuthService) { }
  logout() { this.auth.logout(); }
}
