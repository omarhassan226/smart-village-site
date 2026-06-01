import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, MainCategory } from '../models';
import { LanguageService } from './language.service';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private baseWithoutApi = environment.apiUrlWithoutApi;
  private base = environment.apiUrl;

  constructor(private http: HttpClient, private lang: LanguageService) { }

  /** GET /api/categories – flat subcategories list */
  getCategories(): Observable<{ data: Category[] }> {
    return this.http
      .get<{ categoires: Category[] }>(`${this.base}/categories`)
      .pipe(map((res) => ({ data: res.categoires || [] })));
  }

  /** GET /admin/category – main categories (for header nav) */
  getMainCategories(): Observable<{ data: MainCategory[] }> {
    return this.http
      .get<{ categories: MainCategory[] }>(`${this.base}/show/main/category/${this.lang.current}`)
      .pipe(
        map((res) => {
          const cats = res.categories || [];
          cats.sort((a, b) => (a.sortnumber ?? 0) - (b.sortnumber ?? 0));
          return { data: cats };
        })
      );
  }

  /**
   * GET /api/show/category/{lang}?main_category={id}
   * Subcategories for a specific main category (used in filter sidebar)
   */
  getSubcategories(mainCategoryId: number): Observable<Category[]> {
    const url = `${this.base}/show/category/${this.lang.current}?main_category=${mainCategoryId}`;
    return this.http
      .post<{ categories: Category[] }>(url, { main_category: mainCategoryId })
      .pipe(map((res) => res.categories || []));
  }

  /**
   * GET /api/category/keywords/{lang}?category_id={id}
   * Keywords/tags for a category (for search suggestions)
   */
  getCategoryKeywords(categoryId: number): Observable<string[]> {
    return this.http
      .post<any[]>(`${this.base}/category/keywords/${this.lang.current}?category_id=${categoryId}`, {})
      .pipe(
        map((res) => {
          if (Array.isArray(res)) {
            return res.map((k: any) => k.keyword || k.name || k);
          }
          return [];
        })
      );
  }

  getCategory(id: number): Observable<{ data: Category }> {
    return this.http.get<{ data: Category }>(`${this.base}/categories/${id}`);
  }
}
