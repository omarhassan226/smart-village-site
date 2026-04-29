import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { NotificationToastComponent } from './components/notification-toast/notification-toast.component';
import { CartSidebarComponent } from './components/cart-sidebar/cart-sidebar.component';
import { QuickViewComponent } from './components/quick-view/quick-view.component';

import { TruncatePipe } from './pipes/truncate.pipe';
import { LocalNamePipe } from './pipes/local-name.pipe';

const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  ProductCardComponent,
  LoadingSpinnerComponent,
  EmptyStateComponent,
  PaginationComponent,
  BreadcrumbComponent,
  NotificationToastComponent,
  CartSidebarComponent,
  QuickViewComponent,
  TranslateModule,
];


const PIPES = [TruncatePipe, LocalNamePipe];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ...COMPONENTS,
    ...PIPES,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ...COMPONENTS,
    ...PIPES,
  ],
})
export class SharedModule {}
