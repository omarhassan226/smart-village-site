export interface Product {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  price: number;
  original_price?: number;
  discount?: number;
  discount_percentage?: number;
  image: string;
  images?: string[];
  category_id: number;
  category_name?: string;
  brand_id?: number;
  brand_name?: string;
  is_new?: boolean;
  is_featured?: boolean;
  in_stock?: boolean;
  quantity?: number;
  rating?: number;
  reviews_count?: number;
  colors?: ProductColor[];
  types?: ProductType[];
  seller?: string;
  tags?: string[];
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
  brand_id?: number | number[];
  name?: string;
  priceFrom?: number;
  priceTo?: number;
  status?: 'asc' | 'desc';
  key_word?: number | string;
  page?: number;
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
