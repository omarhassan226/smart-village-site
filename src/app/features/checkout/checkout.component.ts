import { SharedModule } from '../../shared/shared.module';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { LocationService } from '../../core/services/location.service';
import { NotificationService } from '../../core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Cart, Address } from '../../core/models';
import { LanguageService } from '../../core/services/language.service';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';
import { AddressModalComponent } from './components/address-modal/address-modal.component';
import { PaymentDocumentModalComponent } from './components/payment-document-modal/payment-document-modal.component';

@Component({
  standalone: true,
  imports: [SharedModule, OrderSummaryComponent, AddressModalComponent, PaymentDocumentModalComponent],
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  cart: Cart = { items: [], total: 0, items_count: 0 };
  addresses: Address[] = [];
  selectedAddressId: number | null = null;
  paymentMethod: string = 'Pay on receipt'; // "Pay on receipt" or "Transfer via Bank"
  notes = '';
  loading = true;
  placing = false;
  addressModalOpen = false;
  paymentDocModalOpen = false;
  paymentReceiptFile: string | null = null;
  paymentReceiptName = '';
  paymentReceiptSize = '';

  shippingCompanies: any[] = [];
  selectedCompanyId: number | null = null;
  loadingCompanies = false;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private locationService: LocationService,
    private notify: NotificationService,
    private translate: TranslateService,
    private router: Router,
    public lang: LanguageService
  ) { }

  ngOnInit(): void {
    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe((cart) => {
      this.cart = cart;
      if (this.cart.items.length === 0 && !this.placing) {
        this.router.navigate(['/cart']);
      }
      this.loading = false;
    });

    // Listen to language changes
    this.lang.lang$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadAddresses();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAddresses(): void {
    this.locationService.getUserAddresses().subscribe({
      next: (res: any) => {
        this.addresses = res.data || res || [];
        console.log(this.addresses);

        // We do not auto-select any address on load.
        // This ensures shipping companies only load when the user explicitly clicks an address.
        this.selectedAddressId = null;
        this.shippingCompanies = [];
        this.selectedCompanyId = null;
      },
      error: () => { },
    });
  }

  onAddressChange(): void {
    this.loadShippingCompanies();
  }

  onPaymentChange(): void {
    this.loadShippingCompanies();
    if (this.paymentMethod === 'Transfer via Bank' && !this.paymentReceiptFile) {
      this.paymentDocModalOpen = true;
    }
  }

  onPaymentReceiptConfirmed(event: { base64: string; name: string; size: string }): void {
    this.paymentReceiptFile = event.base64;
    this.paymentReceiptName = event.name;
    this.paymentReceiptSize = event.size;
    this.paymentDocModalOpen = false;
  }

  clearPaymentReceipt(): void {
    this.paymentReceiptFile = null;
    this.paymentReceiptName = '';
    this.paymentReceiptSize = '';
  }

  loadShippingCompanies(): void {
    if (!this.selectedAddressId || !this.paymentMethod) return;

    this.loadingCompanies = true;
    this.shippingCompanies = [];
    this.selectedCompanyId = null;

    const orderCost = this.cart.total; // total cart cost

    this.orderService.getShippingCompanies(String(this.selectedAddressId), orderCost, this.paymentMethod).subscribe({
      next: (res: any) => {
        // Map res.shipings from the server response
        this.shippingCompanies = res.shipings || res.data || res || [];
        this.selectedCompanyId = null;
        this.loadingCompanies = false;
      },
      error: () => {
        this.loadingCompanies = false;
      }
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

    if (!this.selectedCompanyId) {
      this.notify.error(this.translate.instant('SELECT_SHIPPING_COMPANY'));
      return;
    }

    if (this.paymentMethod === 'Transfer via Bank' && !this.paymentReceiptFile) {
      this.notify.error(this.translate.instant('PLEASE_UPLOAD_RECEIPT') || 'Please upload bank transfer receipt');
      this.paymentDocModalOpen = true;
      return;
    }

    const selectedCompany = this.shippingCompanies.find(c =>
      (c.id || c.company_shipping_id) === this.selectedCompanyId
    );

    const priceShipping = selectedCompany ? Number(selectedCompany.f_price || selectedCompany.price_shipping || selectedCompany.cost || 0) : 0;
    const cost = this.cart.total + priceShipping; // Grand total including shipping cost

    const payload = {
      shipping_address_id: String(this.selectedAddressId),
      company_shipping_id: this.selectedCompanyId,
      cost: cost,
      file: this.paymentReceiptFile || "",
      price_shipping: priceShipping,
      products: this.cart.items.map(i => ({
        detail_id: i.detail_id || i.type_id || i.color_id || null,
        product_id: i.product_id,
        quantity: i.quantity,
        productTotalPrice: i.total,
        selectedOptions: i.selectedOptions || []
      })),
      way_pay: this.paymentMethod
    };

    this.placing = true;
    this.orderService.saveWebOrder(payload).subscribe({
      next: () => {
        this.placing = false;
        this.paymentDocModalOpen = false;
        this.cartService.clear();
        this.notify.success(this.translate.instant('SUCCESS'));
        this.router.navigate(['/checkout/success']);
      },
      error: () => {
        this.placing = false;
        this.notify.error(this.translate.instant('ERROR'));
      },
    });
  }

  getName(item: any): string {
    if (!item) return '';
    return (this.lang.current === 'ar' ? item.name_ar : item.name_en) || item.name || item.name_ar || '';
  }

  get selectedShippingCost(): number | null {
    if (!this.selectedCompanyId || this.shippingCompanies.length === 0) return null;
    const company = this.shippingCompanies.find(c => (c.id || c.company_shipping_id) === this.selectedCompanyId);
    if (!company) return null;
    return Number(company.f_price || company.price_shipping || company.cost || 0);
  }
}
