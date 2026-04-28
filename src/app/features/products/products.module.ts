import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { FilterSidebarComponent } from './components/filter-sidebar/filter-sidebar.component';
import { ShippingModalComponent } from './components/shipping-modal/shipping-modal.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: ':id', component: ProductDetailComponent },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    ProductListComponent,
    ProductDetailComponent,
    FilterSidebarComponent,
    ShippingModalComponent
  ],
})
export class ProductsModule { }
