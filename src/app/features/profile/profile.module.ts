import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { ProfileOrdersComponent } from './components/profile-orders/profile-orders.component';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' },
      { path: 'info', component: ProfileInfoComponent },
      { path: 'orders', component: ProfileOrdersComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    ProfileComponent,
    ProfileInfoComponent,
    ProfileOrdersComponent
  ],
})
export class ProfileModule { }
