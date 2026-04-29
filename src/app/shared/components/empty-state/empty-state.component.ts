import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  selector: 'app-empty-state',
  template: `
    <div class="empty-state">
      <div class="empty-state__icon-wrap">
        <div class="empty-state__icon-bg"></div>
        <i [class]="icon" class="empty-state__icon"></i>
      </div>
      <h3 class="empty-state__title">{{ title }}</h3>
      <p class="empty-state__desc" *ngIf="description">{{ description }}</p>
      <div class="empty-state__actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: 4rem 1.5rem;
      max-width: 400px;
      margin: 0 auto;
    }

    .empty-state__icon-wrap {
      position: relative;
      width: 100px;
      height: 100px;
      margin: 0 auto 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-state__icon-bg {
      position: absolute;
      inset: 0;
      background: var(--primary);
      opacity: 0.1;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .empty-state__icon {
      font-size: 2.8rem;
      color: var(--primary);
      position: relative;
      z-index: 1;
    }

    .empty-state__title {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
    }

    .empty-state__desc {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .empty-state__actions {
      display: flex;
      justify-content: center;
      gap: 12px;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.1; }
      50% { transform: scale(1.05); opacity: 0.15; }
      100% { transform: scale(0.95); opacity: 0.1; }
    }
  `],
})
export class EmptyStateComponent {
  @Input() icon = 'uil uil-inbox';
  @Input() title = '';
  @Input() description = '';
}
