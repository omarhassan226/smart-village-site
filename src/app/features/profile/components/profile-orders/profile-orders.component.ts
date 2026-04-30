import { SharedModule } from '../../../../shared/shared.module';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../core/services/order.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Order, OrderStatus } from '../../../../core/models';
import { LanguageService } from '../../../../core/services/language.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-profile-orders',
  templateUrl: './profile-orders.component.html',
  styleUrls: ['./profile-orders.component.scss'],
})
export class ProfileOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  currentPage = 1;
  lastPage = 1;
  status: string | null = null;

  activeTab: 'all' | 'processing' | 'shipped' | 'delivered' = 'all';
  returnModalOpen = false;
  selectedOrderId: number | null = null;
  returnReason = '';

  constructor(
    private orderService: OrderService,
    private notify: NotificationService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    public lang: LanguageService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.status = params['status'] || null;
      this.loadOrders();
    });
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders(this.currentPage, this.status || undefined).subscribe({
      next: (res) => {
        this.orders = res.data || [];
        this.lastPage = res.last_page || 1;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  get filteredOrders(): Order[] {
    if (this.activeTab === 'all') return this.orders;
    const map: Record<'all' | 'processing' | 'shipped' | 'delivered', OrderStatus[]> = {
      all: [],
      processing: ['pending', 'confirmed', 'processing'],
      shipped: ['shipped'],
      delivered: ['delivered'],
    };
    return this.orders.filter((o) => map[this.activeTab].includes(o.status));
  }

  getStatusKey(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      pending: 'STATUS_PENDING',
      confirmed: 'STATUS_CONFIRMED',
      processing: 'STATUS_PROCESSING',
      shipped: 'STATUS_SHIPPED',
      delivered: 'STATUS_DELIVERED',
      cancelled: 'CANCEL',
      returned: 'RETURN_ORDER',
      review: 'STATUS_PROCESSING',
      delivering: 'STATUS_SHIPPED',
    };
    return map[status] || status;
  }

  getStatusClass(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger',
      returned: 'danger',
      review: 'info',
      delivering: 'primary',
    };
    return map[status] || '';
  }

  openReturn(orderId: number): void {
    this.selectedOrderId = orderId;
    this.returnModalOpen = true;
    this.returnReason = '';
  }

  submitReturn(): void {
    if (!this.selectedOrderId || !this.returnReason.trim()) return;
    this.orderService.returnOrder({ order_id: this.selectedOrderId, reason: this.returnReason }).subscribe({
      next: () => {
        this.notify.success(this.translate.instant('SUCCESS'));
        this.returnModalOpen = false;
        this.loadOrders();
      },
      error: () => this.notify.error(this.translate.instant('ERROR')),
    });
  }

  getProductName(item: any): string {
    return (this.lang.current === 'ar' ? item.product?.name_ar : item.product?.name_en) || item.product?.name || '';
  }
}
