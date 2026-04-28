import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap, of, catchError } from 'rxjs';
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

  login(phone: string, password: string): Observable<any> {
    const body = {
      username: phone,
      password,
      grant_type: 'password',
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      provider: environment.provider,
    };
    return this.http.post<any>(environment.oauthUrl, body).pipe(
      tap((res) => {
        // Save token first
        localStorage.setItem('token', res.access_token);
      }),
      // If the OAuth response includes user data, use it directly
      // Otherwise, fetch user profile after obtaining the token
      switchMap((res) => {
        if (res.user && res.user.id) {
          this.saveUser(res.user);
          return of(res);
        }
        // Fetch user profile using the new token
        return this.fetchProfile().pipe(
          tap((user) => this.saveUser(user)),
          switchMap((user) => of({ ...res, user })),
          catchError(() => {
            // If profile fetch fails, create a minimal user from the phone
            const minimalUser: User = { id: 0, first_name: phone, last_name: '', phone };
            this.saveUser(minimalUser);
            return of({ ...res, user: minimalUser });
          })
        );
      })
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

  /** Fetch authenticated user profile */
  fetchProfile(): Observable<User> {
    return this.http.get<any>(`${environment.apiUrl}/user`).pipe(
      switchMap((res) => {
        // Handle various API response formats
        const user = res.user || res.data || res;
        return of(user as User);
      })
    );
  }

  private saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this._user$.next(user);
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
