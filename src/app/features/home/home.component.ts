import { Component } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { HeroSliderComponent } from './components/hero-slider/hero-slider.component';
import { BrandCarouselComponent } from './components/brand-carousel/brand-carousel.component';
import { ProductSectionComponent } from './components/product-section/product-section.component';
import { PromoBannerComponent } from './components/promo-banner/promo-banner.component';

@Component({
  standalone: true,
  imports: [
    SharedModule,
    HeroSliderComponent,
    BrandCarouselComponent,
    ProductSectionComponent,
    PromoBannerComponent
  ],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
