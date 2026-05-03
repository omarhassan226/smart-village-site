export interface Banner {
  id: number;
  image: string;
  image_ar?: string;
  image_en?: string;
  banner_type?: string;
  title?: string;
  title_ar?: string;
  title_en?: string;
  desc_ar?: string;
  desc_en?: string;
  subtitle?: string;
  link?: string;
  category_id?: number;
  product_id?: number;
  order?: number;
  is_active?: boolean;
}

export interface Brand {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  image?: string;
  logo?: string;
  products_count?: number;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
  youtube?: string;
  phone?: string;
}
