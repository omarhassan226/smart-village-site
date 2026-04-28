import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LangInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const lang = (localStorage.getItem('lang') as string) || 'ar';
    const cloned = req.clone({
      setHeaders: { 'Accept-Language': lang },
    });
    return next.handle(cloned);
  }
}
