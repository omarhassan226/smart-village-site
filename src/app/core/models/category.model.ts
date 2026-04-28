export interface Category {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  image?: string;
  icon?: string;
  parent_id?: number | null;
  children?: Category[];
  products_count?: number;
}

export interface MainCategory {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  image?: string;
  sub_categories?: Category[];
}
