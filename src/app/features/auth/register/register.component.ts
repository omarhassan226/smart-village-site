import { SharedModule } from '../../../shared/shared.module';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { LocationService } from '../../../core/services/location.service';
import { LanguageService } from '../../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;

  // Location data
  governorates: any[] = [];
  cities: any[] = [];
  villages: any[] = [];
  loadingGovernorates = false;
  loadingCities = false;
  loadingVillages = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private notify: NotificationService,
    private translate: TranslateService,
    private router: Router,
    private locationService: LocationService,
    public langService: LanguageService
  ) {
    this.form = this.fb.group(
      {
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', Validators.email],
        governorate_id: [null, Validators.required],
        city_id: [null, Validators.required],
        village_id: [null, Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirmation: ['', Validators.required],
        accept_terms: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadGovernorates();

    // Reload governorates when language changes
    this.langService.lang$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadGovernorates();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private passwordMatchValidator(g: AbstractControl) {
    const pass = g.get('password')?.value;
    const confirm = g.get('password_confirmation')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  get f() { return this.form.controls; }

  get currentLang(): string {
    return this.langService.current;
  }

  getLocationName(item: any): string {
    if (!item) return '';
    return this.currentLang === 'ar'
      ? (item.name_ar || item.name || '')
      : (item.name_en || item.name || '');
  }

  toggleLanguage(): void {
    this.langService.toggle();
  }

  loadGovernorates(): void {
    this.loadingGovernorates = true;
    const lang = this.currentLang;
    this.locationService.getGovernorates(lang)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.governorates = res.governorates || [];
          this.loadingGovernorates = false;
        },
        error: () => {
          this.loadingGovernorates = false;
        }
      });
  }

  onGovernorateChange(): void {
    const id = this.form.get('governorate_id')?.value;

    // Reset dependent dropdowns
    this.cities = [];
    this.villages = [];
    this.form.patchValue({ city_id: null, village_id: null });

    if (!id) return;

    this.loadingCities = true;
    this.locationService.getCities(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.cities = res.cities || [];
          this.loadingCities = false;
        },
        error: () => {
          this.loadingCities = false;
        }
      });
  }

  onCityChange(): void {
    const id = this.form.get('city_id')?.value;

    // Reset village dropdown
    this.villages = [];
    this.form.patchValue({ village_id: null });

    if (!id) return;

    this.loadingVillages = true;
    this.locationService.getVillages(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.villages = res.villages || [];
          this.loadingVillages = false;
        },
        error: () => {
          this.loadingVillages = false;
        }
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.form.value;

    this.auth.register(formData).subscribe({
      next: () => {
        this.loading = false;
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
