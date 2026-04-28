import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { WishlistComponent } from './wishlist.component';

const routes: Routes = [{ path: '', component: WishlistComponent }];

@NgModule({
  declarations: [],
  imports: [SharedModule, RouterModule.forChild(routes), WishlistComponent],
})
export class WishlistModule { }
