import { SharedModule } from '../../../../shared/shared.module';
import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../../../../core/services/location.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Governorate, City, Village } from '../../../../core/models';
import { LanguageService } from '../../../../core/services/language.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  selector: 'app-address-modal',
  templateUrl: './address-modal.component.html',
  styleUrls: ['./address-modal.component.scss'],
})
export class AddressModalComponent implements OnChanges, OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  form: FormGroup;
  governorates: Governorate[] = [];
  cities: City[] = [];
  villages: Village[] = [];
  saving = false;

  constructor(
    private fb: FormBuilder,
    private location: LocationService,
    private notify: NotificationService,
    private translate: TranslateService,
    public lang: LanguageService
  ) {
    this.form = this.fb.group({
      receiver_name: ['', Validators.required],
      phone_number: ['', Validators.required],
      governorate_id: [null, Validators.required],
      state_id: [null, Validators.required],
      village_id: [null, Validators.required],
      address: ['', Validators.required],
      type_address: ['home'],
      default: [false],
    });
  }

  ngOnInit(): void {
    this.loadGovernorates();
  }

  ngOnChanges(): void {
    if (this.isOpen && this.governorates.length === 0) {
      this.loadGovernorates();
    }
  }

  loadGovernorates(): void {
    this.location.getGovernorates(this.lang.current).subscribe({
      next: (r: any) => (this.governorates = r.governorates)
    });
  }

  onGovChange(id: number): void {
    this.form.patchValue({ state_id: null, village_id: null });
    this.cities = [];
    this.villages = [];
    if (id) {
      this.location.getCities(id).subscribe({ next: (r: any) => (this.cities = r.cities) });
    }
  }

  onCityChange(id: number): void {
    this.form.patchValue({ village_id: null });
    this.villages = [];
    if (id) {
      this.location.getVillages(id).subscribe({ next: (r: any) => (this.villages = r.villages) });
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;

    this.location.addAddress(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving = false;
        this.notify.success(this.translate.instant('SUCCESS'));
        this.saved.emit();
        this.form.reset({ type_address: 'home', default: false });
        this.close.emit();
      },
      error: () => {
        this.saving = false;
        this.notify.error(this.translate.instant('ERROR'));
      },
    });
  }

  getName(item: Governorate | City | Village): string {
    return (this.lang.current === 'ar' ? item.name_ar : item.name_en) || item.name || '';
  }
}
