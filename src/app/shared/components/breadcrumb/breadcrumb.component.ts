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
          <li class="breadcrumb__item" *ngFor="let item of items; let last = last; let i = index">
            <i class="uil uil-home-alt breadcrumb__home-icon" *ngIf="i === 0"></i>
            <a
              class="breadcrumb__link"
              [class.breadcrumb__link--active]="last"
              [routerLink]="last ? null : item.route"
            >{{ item.label }}</a>
            <i class="uil uil-angle-right-b breadcrumb__sep" *ngIf="!last"></i>
          </li>
        </ol>
      </div>
    </nav>
  `,
  styles: [`
    .breadcrumb {
      background: linear-gradient(135deg, var(--bg-secondary) 0%, #eef2f7 100%);
      border-bottom: 1px solid var(--border);
      padding: 14px 0;
    }

    .breadcrumb__list {
      display: flex;
      align-items: center;
      gap: 0;
      list-style: none;
      padding: 0;
      margin: 0;
      flex-wrap: wrap;
    }

    .breadcrumb__item {
      display: flex;
      align-items: center;
      gap: 0;
    }

    .breadcrumb__home-icon {
      font-size: 1rem;
      color: var(--primary);
      margin-inline-end: 4px;
    }

    .breadcrumb__link {
      font-size: 0.85rem;
      color: var(--text-light);
      text-decoration: none;
      transition: color 0.2s;
      padding: 2px 4px;
      border-radius: 4px;
    }

    .breadcrumb__link:hover:not(.breadcrumb__link--active) {
      color: var(--primary);
      background: rgba(43, 188, 191, 0.08);
    }

    .breadcrumb__link--active {
      color: var(--primary);
      font-weight: 600;
      pointer-events: none;
    }

    .breadcrumb__sep {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin: 0 2px;
    }

    :host-context([dir="rtl"]) .breadcrumb__sep {
      transform: scaleX(-1);
    }
  `],
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
}
