import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  selector: 'app-breadcrumb',
  template: `
    <nav class="breadcrumb" aria-label="breadcrumb">
      <div class="container">
        <ol class="breadcrumb__list">
          <li class="breadcrumb__item" *ngFor="let item of items; let last = last">
            <a
              class="breadcrumb__link"
              [class.breadcrumb__link--active]="last"
              [routerLink]="last ? null : item.route"
            >{{ item.label }}</a>
            <i class="icon-chevron-end breadcrumb__sep" *ngIf="!last"></i>
          </li>
        </ol>
      </div>
    </nav>
  `,
  styles: [`
    .breadcrumb {
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border);
      padding: 10px 0;
    }

    .breadcrumb__list {
      display: flex;
      align-items: center;
      gap: 6px;
      list-style: none;
      padding: 0;
      margin: 0;
      flex-wrap: wrap;
    }

    .breadcrumb__item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .breadcrumb__link {
      font-size: 0.85rem;
      color: var(--text-light);
      text-decoration: none;
      transition: color 0.2s;
    }

    .breadcrumb__link:hover:not(.breadcrumb__link--active) {
      color: var(--primary);
    }

    .breadcrumb__link--active {
      color: var(--primary);
      font-weight: 600;
      pointer-events: none;
    }

    .breadcrumb__sep {
      font-size: 0.65rem;
      color: var(--text-light);
    }

    [dir="rtl"] .breadcrumb__sep {
      transform: scaleX(-1);
    }
  `],
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}
