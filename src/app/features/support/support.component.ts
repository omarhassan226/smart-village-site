import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { SupportService, FAQ } from '../../core/services/support.service';
import { BannerService } from '../../core/services/banner.service';
import { SocialLinks } from '../../core/models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, RouterModule],
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit, OnDestroy {
  faqs: FAQ[] = [];
  filteredFaqs: FAQ[] = [];
  socialLinks: SocialLinks = {};
  searchQuery = '';
  loading = true;
  private destroy$ = new Subject<void>();

  constructor(
    public lang: LanguageService,
    private supportService: SupportService,
    private bannerService: BannerService
  ) {}

  ngOnInit(): void {
    this.loadFAQs();

    this.lang.lang$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadFAQs();
    });

    this.bannerService.getSocialLinks().pipe(takeUntil(this.destroy$)).subscribe({
      next: (links) => {
        this.socialLinks = links;
      }
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
        this.filterFaqs();
        this.loading = false;
      },
      error: () => {
        this.faqs = [];
        this.filteredFaqs = [];
        this.loading = false;
      }
    });
  }

  filterFaqs(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredFaqs = this.faqs;
    } else {
      this.filteredFaqs = this.faqs.filter(faq =>
        (faq.question && faq.question.toLowerCase().includes(query)) ||
        (faq.answer && faq.answer.toLowerCase().includes(query))
      );
    }
  }

  toggleFaq(faq: FAQ) {
    faq.open = !faq.open;
  }

  getWhatsAppLink(phone?: string): string {
    if (!phone) return '#';
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('968') || cleanPhone.length > 8) {
      return `https://wa.me/${cleanPhone}`;
    }
    return `https://wa.me/968${cleanPhone}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
