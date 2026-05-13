import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FAQ {
  question: string;
  answer: string;
  open?: boolean;
}

export interface FAQResponse {
  questions: {
    current_page: number;
    data: FAQ[];
    last_page: number;
    total: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  constructor(private http: HttpClient) { }

  getFAQs(lang: string, page: number = 1): Observable<FAQResponse> {
    return this.http.get<FAQResponse>(`${environment.apiUrl}/questions/${lang}?page=${page}`);
  }
}
