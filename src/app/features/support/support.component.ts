import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { SupportService, FAQ } from '../../core/services/support.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit, OnDestroy {
  faqs: FAQ[] = [];
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(
    public lang: LanguageService,
    private supportService: SupportService
  ) {}

  ngOnInit(): void {
    this.loadFAQs();

    this.lang.lang$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadFAQs();
    });
  }

  loadFAQs(): void {
    this.loading = true;
    this.supportService.getFAQs(this.lang.current).subscribe({
      next: (res) => {
        if (res && res.questions && res.questions.data) {
          this.faqs = res.questions.data;
        } else {
          this.faqs = [];
        }
        this.loading = false;
      },
      error: () => {
        this.faqs = [];
        this.loading = false;
      }
    });
  }

  toggleFaq(faq: FAQ) {
    faq.open = !faq.open;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
