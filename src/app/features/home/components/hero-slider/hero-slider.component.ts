import { SharedModule } from '../../../../shared/shared.module';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BannerService } from '../../../../core/services/banner.service';
import { Banner } from '../../../../core/models';
import { LanguageService } from '../../../../core/services/language.service';

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

  constructor(private bannerService: BannerService, public lang: LanguageService) { }

  ngOnInit(): void {
    this.bannerService.getBanners().subscribe({
      next: (res: any) => {
        this.banners = res.data;
        this.loading = false;
        if (this.banners.length > 1) this.startAutoPlay();
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

  private startAutoPlay(): void {
    this.timer = setInterval(() => this.next(), 5000);
  }

  private resetTimer(): void {
    if (this.timer) clearInterval(this.timer);
    this.startAutoPlay();
  }

  getBannerImage(banner: Banner): string {
    return banner.image || '';
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
