import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage = 1;
  @Input() lastPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  pages: (number | '...')[] = [];

  constructor(public lang: LanguageService) {}

  ngOnChanges(): void {
    this.buildPages();
  }

  buildPages(): void {
    const pages: (number | '...')[] = [];
    const total = this.lastPage;
    const current = this.currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }

    this.pages = pages;
  }

  go(page: number | '...'): void {
    if (typeof page !== 'number') return;
    if (page === this.currentPage) return;
    this.pageChange.emit(page);
  }

  prev(): void {
    if (this.currentPage > 1) this.pageChange.emit(this.currentPage - 1);
  }

  next(): void {
    if (this.currentPage < this.lastPage) this.pageChange.emit(this.currentPage + 1);
  }
}
