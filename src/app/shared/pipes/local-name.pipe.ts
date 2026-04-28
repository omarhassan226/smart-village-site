import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
  standalone: true, name: 'localName', pure: false })
export class LocalNamePipe implements PipeTransform {
  constructor(private lang: LanguageService) {}

  transform(item: any, field = 'name'): string {
    if (!item) return '';
    const langSuffix = this.lang.current === 'ar' ? '_ar' : '_en';
    return item[field + langSuffix] || item[field] || '';
  }
}
