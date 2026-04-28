import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'ar' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private _lang$ = new BehaviorSubject<Lang>(this.getSaved());
  lang$ = this._lang$.asObservable();

  constructor(private translate: TranslateService) {
    this.apply(this.getSaved());
  }

  get current(): Lang {
    return this._lang$.value;
  }

  get isRtl(): boolean {
    return this._lang$.value === 'ar';
  }

  toggle(): void {
    this.set(this.current === 'ar' ? 'en' : 'ar');
  }

  set(lang: Lang): void {
    localStorage.setItem('lang', lang);
    this._lang$.next(lang);
    this.apply(lang);
  }

  private apply(lang: Lang): void {
    this.translate.use(lang).subscribe();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-en', lang === 'en');
    document.body.classList.toggle('lang-ar', lang === 'ar');
  }

  private getSaved(): Lang {
    return (localStorage.getItem('lang') as Lang) || 'ar';
  }
}
