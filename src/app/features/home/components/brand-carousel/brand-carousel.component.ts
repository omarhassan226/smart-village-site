import { SharedModule } from '../../../../shared/shared.module';
import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../../../core/services/banner.service';
import { Brand } from '../../../../core/models';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-brand-carousel',
  templateUrl: './brand-carousel.component.html',
  styleUrls: ['./brand-carousel.component.scss'],
})
export class BrandCarouselComponent implements OnInit {
  brands: Brand[] = [];
  loading = true;
  private storageBase = 'https://smartvillageapp.com/app';

  constructor(private bannerService: BannerService, public lang: LanguageService) { }

  ngOnInit(): void {
    this.bannerService.getBrands().subscribe({
      next: (res) => { this.brands = res.data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  getBrandName(brand: Brand): string {
    return (this.lang.current === 'ar' ? brand.name_ar : brand.name_en) || brand.name || '';
  }

  getBrandLogo(brand: Brand): string {
    const logo = brand.logo || brand.image || '';
    if (!logo) return 'assets/images/placeholder.svg';
    if (logo.startsWith('http')) return logo;
    return `${this.storageBase}/${logo}`;
  }
}
