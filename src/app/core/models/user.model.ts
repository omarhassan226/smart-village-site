export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  image?: string;
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
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  password: string;
  password_confirmation: string;
}
