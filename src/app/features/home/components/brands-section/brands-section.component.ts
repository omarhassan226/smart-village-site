import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BannerService } from '../../../../core/services/banner.service';
import { Brand } from '../../../../core/models';

@Component({
  selector: 'app-brands-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <section class="brands-section" *ngIf="brands.length > 0">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ 'TOP_BRANDS' | translate }}</h2>
          <p class="section-subtitle">{{ 'TOP_BRANDS_DESC' | translate }}</p>
        </div>

        <div class="brands-grid">
          <div class="brand-card" *ngFor="let brand of brands">
            <div class="brand-logo">
              <img [src]="brand.image" [alt]="brand.name" loading="lazy" 
                   onerror="this.onerror=null;this.src='assets/images/placeholder.svg'">
            </div>
            <span class="brand-name">{{ brand.name }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .brands-section {
      padding: 4rem 0;
      background: #f8fafc;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-title {
      font-size: 2rem;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .section-subtitle {
      color: #64748b;
      font-size: 1.1rem;
    }

    .brands-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1.5rem;
    }

    .brand-card {
      background: white;
      border: 1px solid #f1f5f9;
      border-radius: 20px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
        border-color: var(--primary-light);
        
        .brand-logo img {
          filter: grayscale(0);
          opacity: 1;
        }
      }
    }

    .brand-logo {
      width: 100px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        filter: grayscale(100%);
        opacity: 0.7;
        transition: all 0.3s ease;
      }
    }

    .brand-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: #334155;
    }

    @media (max-width: 576px) {
      .brands-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .brands-section { padding: 3rem 0; }
      .section-title { font-size: 1.5rem; }
    }
  `]
})
export class BrandsSectionComponent implements OnInit {
  brands: Brand[] = [];

  constructor(private bannerService: BannerService) {}

  ngOnInit(): void {
    this.bannerService.getBrands().subscribe({
      next: (res) => {
        this.brands = res.data;
      }
    });
  }
}
