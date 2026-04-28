export interface Category {
  id: number;
  name?: string;
  name_ar?: string;
  name_en?: string;
  category_ar: string;
  category_en: string;
  image?: string;
  icon?: string;
  parent_id?: number | null;
  main_category?: number | null;
  children?: Category[];
  products_count?: number;
}

export interface MainCategory {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  category_ar?: string;
  category_en?: string;
  image?: string;
  sub_categories?: Category[];
  categories?: Category[];
}
