import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, MainCategory } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCategories(): Observable<{ data: Category[] }> {
    return this.http.get<{ data: Category[] }>(`${this.base}/categories`);
  }

  getMainCategories(): Observable<{ data: MainCategory[] }> {
    return this.http.get<{ data: MainCategory[] }>(`${this.base}/categories/main`);
  }

  getCategory(id: number): Observable<{ data: Category }> {
    return this.http.get<{ data: Category }>(`${this.base}/categories/${id}`);
  }
}
