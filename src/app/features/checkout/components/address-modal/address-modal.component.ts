import { SharedModule } from '../../../../shared/shared.module';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from '../../../../core/services/location.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { Governorate, City, Village } from '../../../../core/models';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-address-modal',
  templateUrl: './address-modal.component.html',
  styleUrls: ['./address-modal.component.scss'],
})
export class AddressModalComponent implements OnChanges {
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
      governorate_id: [null, Validators.required],
      city_id: [null, Validators.required],
      village_id: [null, Validators.required],
      address_type: [''],
      is_default: [false],
    });
  }

  ngOnChanges(): void {
    if (this.isOpen && this.governorates.length === 0) {
      this.location.getGovernorates().subscribe({ next: (r: any) => (this.governorates = r.data) });
    }
  }

  onGovChange(id: number): void {
    this.form.patchValue({ city_id: null, village_id: null });
    this.cities = [];
    this.villages = [];
    if (id) this.location.getCities(id).subscribe({ next: (r: any) => (this.cities = r.data) });
  }

  onCityChange(id: number): void {
    this.form.patchValue({ village_id: null });
    this.villages = [];
    if (id) this.location.getVillages(id).subscribe({ next: (r: any) => (this.villages = r.data) });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.location.addAddress(this.form.value).subscribe({
      next: () => {
        this.saving = false;
        this.notify.success(this.translate.instant('SUCCESS'));
        this.saved.emit();
        this.form.reset();
      },
      error: () => {
        this.saving = false;
        this.notify.error(this.translate.instant('ERROR'));
      },
    });
  }

  getName(item: Governorate | City | Village): string {
    return (this.lang.current === 'ar' ? (item as any).name_ar : (item as any).name_en) || item.name;
  }
}
