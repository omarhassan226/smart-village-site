import { SharedModule } from '../../../../shared/shared.module';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { LocationService } from '../../../../core/services/location.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../core/services/language.service';
import { Governorate, City, Village } from '../../../../core/models';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent implements OnInit {
  form: FormGroup;
  saving = false;
  
  governorates: Governorate[] = [];
  cities: City[] = [];
  villages: Village[] = [];

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private location: LocationService,
    private notify: NotificationService,
    private translate: TranslateService,
    public lang: LanguageService
  ) {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.email],
      phone: [{ value: '', disabled: true }],
      country_id: [null],
      city_id: [null],
      village_id: [null],
      address: [''],
      current_password: [''],
      password: ['', [Validators.minLength(6)]],
      password_confirmation: [''],
    });
  }

  ngOnInit(): void {
    this.loadGovernorates();
    const user = this.auth.user;
    if (user) {
      this.form.patchValue({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email || '',
        phone: user.phone,
        country_id: user.country_id,
        city_id: user.city_id,
        village_id: user.village_id,
        address: user.address,
      });
      
      if (user.country_id) this.onGovChange(user.country_id);
      if (user.city_id) this.onCityChange(user.city_id);
    }
  }

  loadGovernorates(): void {
    this.location.getGovernorates(this.lang.current).subscribe((res: any) => this.governorates = res.governorates);
  }

  onGovChange(id: any): void {
    this.cities = [];
    this.villages = [];
    if (id) {
      this.location.getCities(id).subscribe((res: any) => this.cities = res.cities);
    }
  }

  onCityChange(id: any): void {
    this.villages = [];
    if (id) {
      this.location.getVillages(id).subscribe((res: any) => this.villages = res.villages);
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    
    // Check password confirmation if password is provided
    if (this.form.value.password && this.form.value.password !== this.form.value.password_confirmation) {
        this.notify.error(this.translate.instant('PASSWORD_MISMATCH'));
        return;
    }

    this.saving = true;
    const data = { ...this.form.getRawValue() };
    
    // Clean up empty password fields
    if (!data.password) {
        delete data.password;
        delete data.password_confirmation;
        delete data.current_password;
    }

    this.auth.updateProfile(data).subscribe({
      next: () => {
        this.saving = false;
        this.notify.success(this.translate.instant('SUCCESS'));
        this.form.patchValue({ current_password: '', password: '', password_confirmation: '' });
      },
      error: () => {
        this.saving = false;
        this.notify.error(this.translate.instant('ERROR'));
      },
    });
  }
}
