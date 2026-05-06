import { SharedModule } from '../../../../shared/shared.module';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cart } from '../../../../core/models';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss']
})
export class OrderSummaryComponent {
  @Input() cart!: Cart;
  @Input() shippingCost: number | null = null;
  @Input() placing = false;
  @Output() placeOrder = new EventEmitter<void>();
}
