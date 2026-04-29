import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { LocationService } from '../../../../core/services/location.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Governorate, City, Village, Product } from '../../../../core/models';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, SharedModule, FormsModule],
  selector: 'app-shipping-modal',
  templateUrl: './shipping-modal.component.html',
  styleUrls: ['./shipping-modal.component.scss'],
})
export class ShippingModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() product: Product | null = null;
  @Output() close = new EventEmitter<void>();

  governorates: Governorate[] = [];
  cities: City[] = [];
  villages: Village[] = [];

  selectedGov: number | null = null;
  selectedCity: number | null = null;
  selectedVillage: number | null = null;
  shippingCost: number | null = null;
  loadingCost = false;

  constructor(
    private location: LocationService,
    public auth: AuthService,
    public lang: LanguageService
  ) { }

  ngOnChanges(): void {
    if (this.isOpen && this.governorates.length === 0) {
      this.location.getGovernorates(this.lang.current).subscribe({
        next: (res: any) => (this.governorates = res.governorates),
        error: () => { },
      });
    }
  }

  onGovChange(id: number): void {
    this.selectedGov = id;
    this.cities = [];
    this.villages = [];
    this.selectedCity = null;
    this.selectedVillage = null;
    this.shippingCost = null;
    if (id) {
      this.location.getCities(id).subscribe({ next: (r: any) => (this.cities = r.cities) });
    }
  }

  onCityChange(id: number): void {
    this.selectedCity = id;
    this.villages = [];
    this.selectedVillage = null;
    this.shippingCost = null;
    if (id) {
      this.location.getVillages(id).subscribe({ next: (r: any) => (this.villages = r.villages) });
    }
  }

  onVillageChange(id: number): void {
    this.selectedVillage = id;
    this.shippingCost = null;
    if (id) {
      this.loadingCost = true;
      this.location.getShippingCost(id).subscribe({
        next: (r) => { this.shippingCost = r.cost; this.loadingCost = false; },
        error: () => { this.loadingCost = false; },
      });
    }
  }

  getName(item: Governorate | City | Village): string {
    return (this.lang.current === 'ar' ? (item as any).name_ar : (item as any).name_en) || item.name;
  }
}
