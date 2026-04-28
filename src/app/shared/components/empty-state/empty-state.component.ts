import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  selector: 'app-empty-state',
  template: `
    <div class="empty-state">
      <div class="empty-state__icon">
        <i [class]="icon"></i>
      </div>
      <h3 class="empty-state__title">{{ title }}</h3>
      <p class="empty-state__desc" *ngIf="description">{{ description }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
    }

    .empty-state__icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--primary-light);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
      color: var(--primary);
    }

    .empty-state__icon i { 
      font-size: 2.2rem; 
    }

    .empty-state__title {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 0.5rem;
    }

    .empty-state__desc {
      color: var(--text-light);
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
  `],
})
export class EmptyStateComponent {
  @Input() icon = 'icon-inbox';
  @Input() title = '';
  @Input() description = '';
}
