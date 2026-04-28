import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Category, ProductFilter } from '../../../../core/models';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, SharedModule, FormsModule],
  selector: 'app-filter-sidebar',
  templateUrl: './filter-sidebar.component.html',
  styleUrls: ['./filter-sidebar.component.scss'],
})
export class FilterSidebarComponent implements OnChanges {
  @Input() categories: Category[] = [];
  @Input() filter: ProductFilter = {};
  @Output() categorySelect = new EventEmitter<number | null>();
  @Output() priceFilter = new EventEmitter<[number, number]>();
  @Output() close = new EventEmitter<void>();

  priceFrom = 0;
  priceTo = 1000;

  constructor(public lang: LanguageService) {}

  ngOnChanges(): void {
    this.priceFrom = this.filter.priceFrom ?? 0;
    this.priceTo = this.filter.priceTo ?? 1000;
  }

  getCatName(cat: Category): string {
    return (this.lang.current === 'ar' ? cat.name_ar : cat.name_en) || cat.name;
  }

  applyPrice(): void {
    this.priceFilter.emit([this.priceFrom, this.priceTo]);
  }

  isSelected(id: number): boolean {
    return this.filter.category_id === id;
  }
}
