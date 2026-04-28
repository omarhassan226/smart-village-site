import { SharedModule } from '../../shared/shared.module';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { LocationService } from '../../core/services/location.service';
import { NotificationService } from '../../core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Cart, Address, PaymentMethod } from '../../core/models';
import { LanguageService } from '../../core/services/language.service';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { AddressModalComponent } from './components/address-modal/address-modal.component';

@Component({
  standalone: true,
  imports: [SharedModule, OrderSummaryComponent, AddressModalComponent],
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  cart: Cart = { items: [], total: 0, items_count: 0 };
  addresses: Address[] = [];
  selectedAddressId: number | null = null;
  paymentMethod: PaymentMethod = 'cash_on_delivery';
  notes = '';
  loading = true;
  placing = false;
  addressModalOpen = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private locationService: LocationService,
    private notify: NotificationService,
    private translate: TranslateService,
    private router: Router,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    this.cartService.load().subscribe({
      next: (res) => {
        this.cart = res.data;
        if (this.cart.items.length === 0) this.router.navigate(['/cart']);
        this.loading = false;
      },
      error: () => { this.loading = false; this.router.navigate(['/cart']); },
    });
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.locationService.getUserAddresses().subscribe({
      next: (res) => {
        this.addresses = res.data;
        const def = res.data.find((a) => a.is_default);
        if (def) this.selectedAddressId = def.id;
        else if (res.data.length > 0) this.selectedAddressId = res.data[0].id;
      },
      error: () => {},
    });
  }

  onAddressAdded(): void {
    this.addressModalOpen = false;
    this.loadAddresses();
  }

  placeOrder(): void {
    if (!this.selectedAddressId) {
      this.notify.error(this.translate.instant('SELECT_ADDRESS'));
      return;
    }
    this.placing = true;
    this.orderService.placeOrder({
      address_id: this.selectedAddressId,
      payment_method: this.paymentMethod,
      notes: this.notes,
    }).subscribe({
      next: () => {
        this.placing = false;
        this.notify.success(this.translate.instant('SUCCESS'));
        this.router.navigate(['/profile/orders']);
      },
      error: () => {
        this.placing = false;
        this.notify.error(this.translate.instant('ERROR'));
      },
    });
  }
}
