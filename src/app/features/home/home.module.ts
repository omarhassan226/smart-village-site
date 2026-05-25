import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home.component';
import { HeroSliderComponent } from './components/hero-slider/hero-slider.component';
import { BrandCarouselComponent } from './components/brand-carousel/brand-carousel.component';
import { ProductSectionComponent } from './components/product-section/product-section.component';
import { PromoBannerComponent } from './components/promo-banner/promo-banner.component';
import { OffersSliderComponent } from './components/offers-slider/offers-slider.component';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    HomeComponent,
    PromoBannerComponent,
    OffersSliderComponent,
    ProductSectionComponent,
    HeroSliderComponent,
    BrandCarouselComponent,
  ],
})
export class HomeModule { }
