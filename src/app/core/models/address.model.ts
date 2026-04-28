export interface Governorate {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
}

export interface City {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  governorate_id: number;
}

export interface Village {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  city_id: number;
  shipping_cost?: number;
}

export interface Address {
  id: number;
  user_id?: number;
  governorate_id: number;
  city_id: number;
  village_id: number;
  governorate?: Governorate;
  city?: City;
  village?: Village;
  address_type?: string;
  is_default?: boolean;
  notes?: string;
}

export interface AddressRequest {
  governorate_id: number;
  city_id: number;
  village_id: number;
  address_type?: string;
  is_default?: boolean;
  notes?: string;
}
