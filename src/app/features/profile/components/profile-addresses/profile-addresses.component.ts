import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ShippingService, Address } from '../../../../core/services/shipping.service';
import { LocationService } from '../../../../core/services/location.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { LanguageService } from '../../../../core/services/language.service';
import { Governorate, City, Village } from '../../../../core/models';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, SharedModule],
  selector: 'app-profile-addresses',
  templateUrl: './profile-addresses.component.html',
  styleUrls: ['./profile-addresses.component.scss']
})
export class ProfileAddressesComponent implements OnInit {
  addresses: any[] = []; // Using any to handle raw API response keys
  loading = true;
  modalOpen = false;
  isEdit = false;
  
  governorates: Governorate[] = [];
  cities: City[] = [];
  villages: Village[] = [];
  
  currentAddress: Address = this.getEmptyAddress();

  constructor(
    private shipping: ShippingService,
    private location: LocationService,
    private notify: NotificationService,
    private translate: TranslateService,
    public lang: LanguageService
  ) {}

  ngOnInit(): void {
    this.loadAddresses();
    this.loadGovernorates();
  }

  loadAddresses(): void {
    this.loading = true;
    this.shipping.getAddresses().subscribe({
      next: (res) => { this.addresses = res.address; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  loadGovernorates(): void {
    this.location.getGovernorates(this.lang.current).subscribe((res: any) => this.governorates = res.governorates);
  }

  onGovChange(id: number): void {
    this.cities = [];
    this.villages = [];
    this.currentAddress.state_id = 0;
    this.currentAddress.village_id = 0;
    if (id) this.location.getCities(id).subscribe((res: any) => this.cities = res.cities);
  }

  onCityChange(id: number): void {
    this.villages = [];
    this.currentAddress.village_id = 0;
    if (id) this.location.getVillages(id).subscribe((res: any) => this.villages = res.villages);
  }

  openAdd(): void {
    this.isEdit = false;
    this.currentAddress = this.getEmptyAddress();
    this.modalOpen = true;
  }

  openEdit(addr: any): void {
    this.isEdit = true;
    // Map response keys to payload keys
    this.currentAddress = { 
      id: addr.id,
      receiver_name: addr.receiver_name,
      phone_number: addr.phone_number,
      governorate_id: addr.country_id || addr.governorate_id,
      state_id: addr.city_id || addr.state_id,
      village_id: addr.village_id,
      address: addr.address,
      type_address: addr.type_address || 'home',
      default: String(addr.default) === 'true'
    };
    this.modalOpen = true;
    
    if (this.currentAddress.governorate_id) this.onGovChange(this.currentAddress.governorate_id);
    if (this.currentAddress.state_id) this.onCityChange(this.currentAddress.state_id);
    
    setTimeout(() => {
        this.currentAddress.state_id = addr.city_id || addr.state_id;
        this.currentAddress.village_id = addr.village_id;
    }, 500);
  }

  save(): void {
    const obs = this.isEdit && this.currentAddress.id 
      ? this.shipping.updateAddress(this.currentAddress.id, this.currentAddress)
      : this.shipping.addAddress(this.currentAddress);

    obs.subscribe({
      next: () => {
        this.notify.success(this.translate.instant('SUCCESS'));
        this.modalOpen = false;
        this.loadAddresses();
      },
      error: () => this.notify.error(this.translate.instant('ERROR'))
    });
  }

  delete(id: number): void {
    if (!confirm(this.translate.instant('CONFIRM_DELETE'))) return;
    this.shipping.deleteAddress(id).subscribe(() => {
      this.notify.success(this.translate.instant('SUCCESS'));
      this.loadAddresses();
    });
  }

  private getEmptyAddress(): Address {
    return {
      receiver_name: '',
      phone_number: '',
      governorate_id: 0,
      state_id: 0,
      village_id: 0,
      address: '',
      type_address: 'home',
      default: false
    };
  }

  isDefault(addr: any): boolean {
    return String(addr.default) === 'true';
  }
}
