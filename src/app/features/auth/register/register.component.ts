import { SharedModule } from '../../../shared/shared.module';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private notify: NotificationService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', Validators.email],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator(g: AbstractControl) {
    const pass = g.get('password')?.value;
    const confirm = g.get('password_confirmation')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  get f() { return this.form.controls; }

  submit(): void {
    console.log('register');

    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    console.log('valid');

    this.loading = true;
    const { password_confirmation, ...data } = this.form.value;
    console.log(data);

    this.auth.register({ ...data, password_confirmation }).subscribe({
      next: () => {
        this.loading = false;
        console.log('success');

        this.notify.success(this.translate.instant('SUCCESS'));
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.loading = false;
        this.notify.error(this.translate.instant('ERROR'));
      },
    });
  }
}
