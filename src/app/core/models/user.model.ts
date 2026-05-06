export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  image?: string;
  address?: string;
  country_id?: number;
  city_id?: number;
  village_id?: number;
  token?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
  grant_type: 'password';
  client_id: string;
  client_secret: string;
}

export interface RegisterRequest {
  Fname: string;
  Lname: string;
  phone: string;
  email?: string;
  type_address?: string;
  governorate_id?: number;
  state_id?: number;
  village_id?: number;
  password: string;
  password_confirmation?: string;
}
