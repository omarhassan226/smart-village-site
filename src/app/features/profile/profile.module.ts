import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { ProfileOrdersComponent } from './components/profile-orders/profile-orders.component';
import { ProfileComponent } from './profile.component';

import { ProfileDashboardComponent } from './components/profile-dashboard/profile-dashboard.component';
import { ProfileAddressesComponent } from './components/profile-addresses/profile-addresses.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ProfileDashboardComponent },
      { path: 'info', component: ProfileInfoComponent },
      { path: 'addresses', component: ProfileAddressesComponent },
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
    ProfileDashboardComponent,
    ProfileInfoComponent,
    ProfileAddressesComponent,
    ProfileOrdersComponent
  ],
})
export class ProfileModule { }
