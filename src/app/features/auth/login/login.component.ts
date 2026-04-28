import { SharedModule } from '../../../shared/shared.module';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private cart: CartService,
    private wishlist: WishlistService,
    private notify: NotificationService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.form = this.fb.group({
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get phoneControl() { return this.form.get('phone'); }
  get passwordControl() { return this.form.get('password'); }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const { phone, password } = this.form.value;

    this.auth.login(phone, password).subscribe({
      next: () => {
        this.loading = false;
        this.cart.load().subscribe();
        this.wishlist.load().subscribe();
        this.notify.success(this.translate.instant('SUCCESS'));
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading = false;
        this.notify.error(this.translate.instant('ERROR'));
      },
    });
  }
}
