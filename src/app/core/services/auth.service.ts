import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, AuthResponse, RegisterRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<User | null>(this.getSavedUser());
  user$ = this._user$.asObservable();

  constructor(private http: HttpClient) { }

  get user(): User | null {
    return this._user$.value;
  }

  get isLoggedIn(): boolean {
    return !!this._user$.value && !!this.getToken();
  }

  get token(): string | null {
    return this.getToken();
  }

  login(phone: string, password: string): Observable<AuthResponse> {
    const body = {
      username: phone,
      password,
      grant_type: 'password',
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      provider: environment.provider,
    };
    return this.http.post<AuthResponse>(environment.oauthUrl, body).pipe(
      tap((res) => this.saveSession(res))
    );
  }

  register(data: RegisterRequest): Observable<{ data: User; message: string }> {
    return this.http.post<{ data: User; message: string }>(`${environment.apiUrl}/register/user`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._user$.next(null);
  }

  updateProfile(data: Partial<User>): Observable<{ data: User }> {
    return this.http
      .post<{ data: User }>(`${environment.apiUrl}/user/update`, data)
      .pipe(tap((res) => this.patchUser(res.data)));
  }

  private saveSession(res: AuthResponse): void {
    localStorage.setItem('token', res.access_token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this._user$.next(res.user);
  }

  private patchUser(user: User): void {
    const merged = { ...this._user$.value, ...user };
    localStorage.setItem('user', JSON.stringify(merged));
    this._user$.next(merged);
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getSavedUser(): User | null {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
