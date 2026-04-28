import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true, name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 60, trail = '...'): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
