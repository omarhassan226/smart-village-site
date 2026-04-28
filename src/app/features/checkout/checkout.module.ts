import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CheckoutComponent } from './checkout.component';
import { AddressModalComponent } from './components/address-modal/address-modal.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';

const routes: Routes = [{ path: '', component: CheckoutComponent }];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    CheckoutComponent,
    AddressModalComponent,
    OrderSummaryComponent
  ],
})
export class CheckoutModule { }
