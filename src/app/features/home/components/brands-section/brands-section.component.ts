import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BannerService } from '../../../../core/services/banner.service';
import { Brand } from '../../../../core/models';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-brands-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="brands-section" *ngIf="brands.length > 0">
      <div class="container">
        <div class="section-title">
          <span class="subtitle">{{ 'EXPLORE_TOP_COMPANIES' | translate }}</span>
          <h2>{{ 'MOST_SELLING_BRANDS' | translate }}</h2>
        </div>

        <div class="brands-wrapper">
          <div #slider class="brands-slider">
            <div class="brand-card" *ngFor="let brand of brands">
              <div class="brand-logo">
                <img [src]="getBrandLogo(brand)" [alt]="brand.name" loading="lazy" 
                     onerror="this.onerror=null;this.src='assets/images/placeholder.svg'">
              </div>
              <span class="brand-name">{{ brand.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .brands-section {
      padding: 6rem 0;
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      overflow: hidden;
    }

    .brands-wrapper {
      position: relative;
      margin: 0 -1rem;
      padding: 1rem;

      &::before, &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100px;
        z-index: 2;
        pointer-events: none;
      }

      &::before {
        left: 0;
        background: linear-gradient(to right, #ffffff, transparent);
      }

      &::after {
        right: 0;
        background: linear-gradient(to left, #ffffff, transparent);
      }
    }

    .brands-slider {
      display: flex;
      gap: 2rem;
      overflow-x: hidden;
      padding: 1rem 0.5rem 2rem;
      scroll-behavior: auto;
      user-select: none;
    }

    .brand-card {
      flex: 0 0 180px;
      height: 120px;
      background: white;
      border: 1px solid rgba(226, 232, 240, 0.8);
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);

      &:hover {
        transform: translateY(-10px) scale(1.05);
        border-color: var(--primary-color, #3b82f6);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
        
        .brand-logo img {
          filter: grayscale(0);
          opacity: 1;
          transform: scale(1.1);
        }

        .brand-name {
          color: var(--primary-color, #3b82f6);
        }
      }
    }

    .brand-logo {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 1.5rem;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        filter: grayscale(100%);
        opacity: 0.6;
        transition: all 0.4s ease;
      }
    }

    .brand-name {
      font-size: 0.85rem;
      font-weight: 700;
      color: #64748b;
      transition: color 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    @media (max-width: 768px) {
      .brands-section { padding: 3rem 0; }
      .section-title { font-size: 1.8rem; }
      .brand-card { flex: 0 0 150px; height: 100px; }
      .brands-wrapper::before, .brands-wrapper::after { width: 50px; }
    }
  `]
})
export class BrandsSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('slider') slider?: ElementRef;
  brands: Brand[] = [];
  private scrollInterval: any;
  private storageBase = 'https://smartvillageapp.com/app';

  constructor(
    private bannerService: BannerService,
    public lang: LanguageService
  ) { }

  ngOnInit(): void {
    this.lang.lang$.subscribe(() => {
      this.loadBrands(true);
    });
  }

  private loadBrands(mostSelling: boolean): void {
    this.bannerService.getBrands(mostSelling).subscribe({
      next: (res) => {
        const data = res.data || [];
        if (data.length > 0) {
          this.initSliderData(data);
        } else if (mostSelling) {
          // Fallback to all brands if most selling is empty
          this.loadBrands(false);
        }
      },
      error: () => {
        if (mostSelling) this.loadBrands(false);
      }
    });
  }

  private initSliderData(data: Brand[]): void {
    // Buffer for infinite scroll
    let buffer = [...data];
    while (buffer.length < 12) { buffer = [...buffer, ...data]; }
    this.brands = [...buffer, ...buffer, ...buffer];

    setTimeout(() => this.initScroll(), 600);
  }

  ngAfterViewInit(): void {
    // Initialized in sub
  }

  ngOnDestroy(): void {
    this.stopScroll();
  }

  private initScroll(): void {
    if (!this.slider) return;
    const el = this.slider.nativeElement;
    const oneThird = el.scrollWidth / 3;
    el.scrollLeft = this.lang.isRtl ? -oneThird : oneThird;
    this.startScroll();
  }

  private startScroll(): void {
    this.stopScroll();
    this.scrollInterval = setInterval(() => {
      const el = this.slider?.nativeElement;
      if (el) {
        const oneThird = el.scrollWidth / 3;
        el.style.scrollBehavior = 'auto';

        if (this.lang.isRtl) {
          if (Math.abs(el.scrollLeft) >= (oneThird * 2)) {
            el.scrollLeft = -oneThird;
          } else if (el.scrollLeft >= 0) {
            el.scrollLeft = -oneThird;
          }
          el.scrollLeft -= 1.2;
        } else {
          if (el.scrollLeft >= (oneThird * 2)) {
            el.scrollLeft = oneThird;
          } else if (el.scrollLeft <= 0) {
            el.scrollLeft = oneThird;
          }
          el.scrollLeft += 1.2;
        }
      }
    }, 20);
  }

  private stopScroll(): void {
    if (this.scrollInterval) clearInterval(this.scrollInterval);
  }

  getBrandLogo(brand: Brand): string {
    const logo = brand.logo || brand.image || '';
    if (!logo) return 'assets/images/placeholder.svg';
    if (logo.startsWith('http')) return logo;
    return `${this.storageBase}/${logo}`;
  }
}
