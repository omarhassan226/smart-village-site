import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BannerService } from '../../core/services/banner.service';
import { LanguageService } from '../../core/services/language.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-policy',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  template: `
    <div class="policy-page">
      <div class="container">
        <h1 class="policy-page__title">{{ getTitle() | translate }}</h1>
        
        <div class="policy-page__content" *ngIf="content">
          <div [innerHTML]="content"></div>
        </div>

        <!-- Static Shipping Page Fallback -->
        <div class="policy-page__content" *ngIf="!content && type === 'shipping'">
          <div class="static-policy">
            <h2>{{ 'SHIPPING_DELIVERY' | translate }}</h2>
            <p>{{ 'SHIPPING_DESC_1' | translate }}</p>
            <ul>
              <li>{{ 'SHIPPING_POINT_1' | translate }}</li>
              <li>{{ 'SHIPPING_POINT_2' | translate }}</li>
              <li>{{ 'SHIPPING_POINT_3' | translate }}</li>
            </ul>
            <p>{{ 'SHIPPING_DESC_2' | translate }}</p>
          </div>
        </div>
        
        <div class="policy-page__loading" *ngIf="!content && type !== 'shipping'">
          <div class="spinner"></div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./policy.component.scss']
})
export class PolicyComponent implements OnInit {
  type: string = '';
  content: SafeHtml | null = null;

  constructor(
    private route: ActivatedRoute,
    private bannerService: BannerService,
    public lang: LanguageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type') || '';
      this.content = null; // Reset content
      this.loadContent();
    });
  }

  loadContent(): void {
    if (this.type === 'shipping') {
      this.bannerService.getShippingPolicy().subscribe({
        next: (res) => {
          if (res && res.status && res.shipping && res.shipping.shipping) {
            const rawHtml = res.shipping.shipping;
            this.content = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
          }
        },
        error: () => {
          // Keep content null to allow elegant static fallback
        }
      });
    } else {
      this.bannerService.getSocialLinks().subscribe({
        next: (links) => {
          let rawHtml = '';
          if (this.type === 'secure') {
            rawHtml = links.Secure_policy || '';
          } else if (this.type === 'sales') {
            rawHtml = links.Sales_policy || '';
          }
          
          if (rawHtml) {
            this.content = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
          }
        }
      });
    }
  }

  getTitle(): string {
    switch (this.type) {
      case 'secure': return 'WARRANTY';
      case 'sales': return 'SELL_POLICY';
      case 'shipping': return 'SHIPPING_POLICY';
      default: return 'POLICY';
    }
  }
}
