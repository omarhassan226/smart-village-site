import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LanguageService } from './core/services/language.service';
import { Subject, takeUntil, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthRoute = false;
  private destroy$ = new Subject<void>();

  constructor(private lang: LanguageService, private router: Router) {}

  ngOnInit(): void {
    // LanguageService constructor already applies the saved language
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e: any) => {
        this.isAuthRoute = e.urlAfterRedirects?.startsWith('/auth');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
