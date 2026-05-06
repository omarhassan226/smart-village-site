import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../../core/services/language.service';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, SharedModule],
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent implements OnInit, OnDestroy {
  secondsRemaining = 10;
  private intervalId: any;

  constructor(private router: Router, public lang: LanguageService) {}

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.secondsRemaining--;
      if (this.secondsRemaining <= 0) {
        this.goToOrders();
      }
    }, 1000);
  }

  goToOrders(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.router.navigate(['/profile/orders']);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
