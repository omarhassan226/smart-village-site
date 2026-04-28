import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CartComponent } from './cart.component';

const routes: Routes = [{ path: '', component: CartComponent }];

@NgModule({
  imports: [
    SharedModule, 
    RouterModule.forChild(routes),
    CartComponent
  ],
})
export class CartModule {}
