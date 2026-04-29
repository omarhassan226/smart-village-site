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
      <div class="dashboard__welcome">
        <h2>{{ 'WELCOME_USER' | translate }} {{ auth.user?.first_name }}</h2>
        <p>{{ 'DASHBOARD_WELCOME_DESC' | translate }}</p>
      </div>

      <div class="dashboard__grid">
        <a routerLink="../orders" class="dash-card">
          <div class="dash-card__icon"><i class="uil uil-clipboard-notes"></i></div>
          <span class="dash-card__title">{{ 'MY_ORDERS' | translate }}</span>
        </a>

        <a [routerLink]="['../orders']" [queryParams]="{ status: 'review' }" class="dash-card">
          <div class="dash-card__icon"><i class="uil uil-box"></i></div>
          <span class="dash-card__title">{{ 'PREPARING' | translate }}</span>
        </a>

        <a [routerLink]="['../orders']" [queryParams]="{ status: 'delivering' }" class="dash-card">
          <div class="dash-card__icon"><i class="uil uil-truck"></i></div>
          <span class="dash-card__title">{{ 'DELIVERING' | translate }}</span>
        </a>

        <a routerLink="../info" class="dash-card">
          <div class="dash-card__icon"><i class="uil uil-user-circle"></i></div>
          <span class="dash-card__title">{{ 'UPDATE_PROFILE' | translate }}</span>
        </a>

        <a routerLink="/wishlist" class="dash-card">
          <div class="dash-card__icon"><i class="uil uil-heart"></i></div>
          <span class="dash-card__title">{{ 'WISHLIST' | translate }}</span>
        </a>

        <button (click)="logout()" class="dash-card dash-card--danger">
          <div class="dash-card__icon"><i class="uil uil-signout"></i></div>
          <span class="dash-card__title">{{ 'LOGOUT' | translate }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      &__welcome {
        margin-bottom: 2rem;
        h2 { font-size: 1.5rem; font-weight: 700; color: var(--text); margin-bottom: 0.5rem; }
        p { color: var(--text-light); font-size: 0.9rem; }
      }

      &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
      }
    }

    .dash-card {
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
        border-color: var(--primary);
        .dash-card__icon { background: var(--primary-light); color: var(--primary); }
      }

      &__icon {
        width: 60px;
        height: 60px;
        background: var(--bg-secondary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        color: var(--text-light);
        transition: all 0.3s;
      }

      &__title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text);
      }

      &--danger:hover {
        border-color: var(--danger);
        .dash-card__icon { background: #fee2e2; color: var(--danger); }
      }
    }

    @media (max-width: 576px) {
      .dashboard__grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
      .dash-card { padding: 1.5rem 1rem; }
      .dash-card__icon { width: 50px; height: 50px; font-size: 1.5rem; }
      .dash-card__title { font-size: 0.85rem; }
    }
  `]
})
export class ProfileDashboardComponent {
  constructor(public auth: AuthService) {}
  logout() { this.auth.logout(); }
}
