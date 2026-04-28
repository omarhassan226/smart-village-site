import { SharedModule } from '../../../../shared/shared.module';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent implements OnInit {
  form: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private notify: NotificationService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.email],
    });
  }

  ngOnInit(): void {
    const user = this.auth.user;
    if (user) {
      this.form.patchValue({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email || '',
      });
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.auth.updateProfile(this.form.value).subscribe({
      next: () => {
        this.saving = false;
        this.notify.success(this.translate.instant('SUCCESS'));
      },
      error: () => {
        this.saving = false;
        this.notify.error(this.translate.instant('ERROR'));
      },
    });
  }
}
