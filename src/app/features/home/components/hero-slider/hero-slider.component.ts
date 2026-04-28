import { SharedModule } from '../../../../shared/shared.module';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BannerService } from '../../../../core/services/banner.service';
import { Banner } from '../../../../core/models';
import { LanguageService } from '../../../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-hero-slider',
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.scss'],
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  banners: Banner[] = [];
  activeIndex = 0;
  loading = true;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private bannerService: BannerService, public lang: LanguageService, private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    console.log(this.lang.current);
  }

  ngOnInit(): void {
    this.bannerService.getBanners().subscribe({
      next: (res) => {
        this.banners = res.data;
        this.loading = false;
        this.startAutoPlay();
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
    this.timer = setInterval(() => this.next(), 4500);
  }

  private resetTimer(): void {
    if (this.timer) clearInterval(this.timer);
    this.startAutoPlay();
  }

  getBannerImage(banner: Banner): string {
    return (this.lang.current === 'ar' ? banner.image_ar : banner.image_en) || banner.image;
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
