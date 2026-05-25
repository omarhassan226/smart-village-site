export interface Product {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  full_name?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  content_en?: string;
  content_ar?: string;
  price: number;
  discount_price?: number | null;
  original_price?: number;
  discount?: number;
  discount_percentage?: number;
  image: string | any;
  images?: string[];
  sliders?: ProductSlider[];
  category_id: number;
  category_name?: string;
  categories?: any[];
  brand_id?: number;
  brand_name?: string;
  is_new?: boolean;
  is_featured?: boolean;
  is_choice?: string;
  in_stock?: boolean;
  stock?: number;
  quantity?: number;
  min_quantity?: number | null;
  product_unit?: number;
  number?: number;
  seller_id?: number;
  rating?: number;
  reviews_count?: number;
  colors?: ProductColor[];
  types?: ProductType[];
  options?: ProductOption[];
  offer_status?: boolean;
  seller?: string;
  salesman?: { id: number; name: string; content_en?: string };
  unit?: { id: number; unit_en?: string; unit_ar?: string };
  secure?: { id: number; duration_en?: string; duration_ar?: string };
  tags?: string[];
}

export interface ProductSlider {
  id: number;
  image: string;
  product_id: number;
}

export interface ProductOption {
  id: number;
  label_en?: string;
  label_ar?: string;
  type: string;
  product_id: number;
  values: ProductOptionValue[];
}

export interface ProductOptionValue {
  id: number;
  name_ar?: string;
  name_en?: string;
  display_value?: string | null;
  randam_key?: string;
  option_id: number;
}

export interface ProductColor {
  id: number;
  name: string;
  hex?: string;
  image?: string;
}

export interface ProductType {
  id: number;
  name: string;
  extra_price?: number;
}

export interface ProductFilter {
  category_id?: number;
  main_category?: number;
  main_category_id?: number;
  brand_id?: number | number[];
  name?: string;
  priceFrom?: number;
  priceTo?: number;
  status?: 'asc' | 'desc' | string;
  key_word?: string;
  page?: number;
  most_selling?: string;
  banner?: string;
}

export interface ProductListResponse {
  data: Product[];
  products?: {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url?: string | null;
  };
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
