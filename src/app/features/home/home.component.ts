import { Component } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { HeroSliderComponent } from './components/hero-slider/hero-slider.component';
import { BrandsSectionComponent } from './components/brands-section/brands-section.component';
import { FeaturesSectionComponent } from './components/features-section/features-section.component';
import { CategoriesGridComponent } from './components/categories-grid/categories-grid.component';
import { ProductSectionComponent } from './components/product-section/product-section.component';
import { PromoBannerComponent } from './components/promo-banner/promo-banner.component';
import { OffersSliderComponent } from './components/offers-slider/offers-slider.component';
// import { NewsletterComponent } from './components/newsletter/newsletter.component';
// import { TestimonialsComponent } from './components/testimonials/testimonials.component';

@Component({
  standalone: true,
  imports: [
    SharedModule,
    HeroSliderComponent,
    BrandsSectionComponent,
    FeaturesSectionComponent,
    CategoriesGridComponent,
    ProductSectionComponent,
    PromoBannerComponent,
    OffersSliderComponent,
    // NewsletterComponent,
    // TestimonialsComponent
  ],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent { }
