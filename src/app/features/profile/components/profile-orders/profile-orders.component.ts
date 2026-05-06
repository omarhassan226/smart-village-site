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

  selectedOrderDetails: any | null = null;

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders(this.currentPage, this.status || undefined).subscribe({
      next: (res: any) => {
        this.orders = res.orders || res.data || [];
        this.lastPage = res.last_page || 1;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  toggleOrderDetails(order: any): void {
    if (this.selectedOrderDetails && this.selectedOrderDetails.id === order.id) {
      this.selectedOrderDetails = null;
    } else {
      this.selectedOrderDetails = order;
    }
  }

  closeOrderDetails(): void {
    this.selectedOrderDetails = null;
  }

  formatOptionImage(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `https://smartvillageapp.com/app/${path}`;
  }

  formatProductImage(path: string): string {
    if (!path) return 'assets/images/placeholder.svg';
    if (path.startsWith('http')) return path;
    return `https://smartvillageapp.com/app/${path}`;
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

  getStatusKey(status: any): string {
    const map: Record<string, string> = {
      new: 'STATUS_NEW',
      pending: 'STATUS_PENDING',
      confirmed: 'STATUS_CONFIRMED',
      processing: 'STATUS_PROCESSING',
      process: 'STATUS_PROCESSING',
      shipped: 'STATUS_SHIPPED',
      delivered: 'STATUS_DELIVERED',
      complete: 'STATUS_COMPLETED',
      completed: 'STATUS_COMPLETED',
      cancel: 'STATUS_CANCELLED',
      cancelled: 'STATUS_CANCELLED',
      returned: 'RETURNED',
      review: 'STATUS_PROCESSING',
      delivering: 'STATUS_SHIPPED',
    };
    return map[status] || status;
  }

  getStatusClass(status: any): string {
    const map: Record<string, string> = {
      new: 'warning',
      pending: 'warning',
      confirmed: 'info',
      processing: 'info',
      process: 'info',
      shipped: 'primary',
      delivered: 'success',
      complete: 'success',
      completed: 'success',
      cancel: 'danger',
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

  getPayStatusText(status: string): string {
    const map: Record<string, string> = {
      pending: 'PAY_STATUS_PENDING',
      paid: 'PAY_STATUS_PAID',
      failed: 'PAY_STATUS_FAILED',
    };
    return map[status] || status;
  }

  getProductName(item: any): string {
    return (this.lang.current === 'ar' ? item.product?.name_ar : item.product?.name_en) || item.product?.name || '';
  }
}
