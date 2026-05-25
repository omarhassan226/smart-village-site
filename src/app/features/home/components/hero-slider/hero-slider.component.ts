import { SharedModule } from '../../../../shared/shared.module';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BannerService } from '../../../../core/services/banner.service';
import { Banner } from '../../../../core/models';
import { LanguageService } from '../../../../core/services/language.service';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule],
  selector: 'app-hero-slider',
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.scss'],
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  banners: Banner[] = [];
  activeIndex = 0;
  loading = true;
  private timer: any = null;

  constructor(
    private bannerService: BannerService,
    public lang: LanguageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bannerService.getBanners().subscribe({
      next: (res: any) => {
        this.banners = res.data;
        this.loading = false;
        if (this.banners.length > 1) this.startAutoPlay(800);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  goTo(index: number): void {
    this.activeIndex = index;
    this.resetTimer();
  }

  prev(): void {
    this.activeIndex = (this.activeIndex - 1 + this.banners.length) % this.banners.length;
    this.resetTimer();
  }

  next(): void {
    this.activeIndex = (this.activeIndex + 1) % this.banners.length;
    this.resetTimer();
  }

  private startAutoPlay(delay: number = 5000): void {
    this.timer = setTimeout(() => this.next(), delay);
  }

  private resetTimer(): void {
    if (this.timer) clearTimeout(this.timer);
    this.startAutoPlay(5000);
  }

  getBannerImage(banner: Banner): string {
    return banner.image || '';
  }

  getBannerType(banner: Banner): string {
    const type = banner.banner_type || 'Elite Collection';
    if (this.lang.current === 'en' && type === 'عروض حصرية') {
      return 'Exclusive Offers';
    }
    return type;
  }

  onBannerClick(banner: Banner, event: Event): void {
    if (banner.link && (banner.link.startsWith('http://') || banner.link.startsWith('https://'))) {
      // Let standard anchor tag navigate externally
      return;
    }
    event.preventDefault();
    if (banner.product_id) {
      this.router.navigate(['/products', banner.product_id]);
    } else if (banner.category_id) {
      this.router.navigate(['/products'], { queryParams: { category_id: banner.category_id } });
    } else if (banner.link) {
      this.router.navigate([banner.link]);
    } else {
      this.router.navigate(['/offers']);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }
}
