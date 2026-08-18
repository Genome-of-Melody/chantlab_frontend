import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AUTH_TOKEN_KEY } from '../constants/datasets';
import { backendApiRoot } from '../utils/api-root';

export interface AuthUser {
  id: number;
  username: string;
}

interface AuthResponse {
  token: string;
  username: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authUrl = `${backendApiRoot()}/api/auth`;
  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  get username(): string {
    return this.currentUserSubject.value?.username ?? '';
  }

  restoreSession(): Observable<AuthUser | null> {
    if (!this.getToken()) {
      this.currentUserSubject.next(null);
      return of(null);
    }
    return this.http.get<AuthUser>(`${this.authUrl}/me/`).pipe(
      tap(user => this.currentUserSubject.next(user)),
      catchError(() => {
        this.clearToken();
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }

  login(username: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login/`, { username, password }).pipe(
      tap(response => this.setSession(response)),
      map(response => ({ id: response.id, username: response.username }))
    );
  }

  register(username: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthResponse>(`${this.authUrl}/register/`, { username, password }).pipe(
      tap(response => this.setSession(response)),
      map(response => ({ id: response.id, username: response.username }))
    );
  }

  logout(): Observable<void> {
    const request = this.isLoggedIn()
      ? this.http.post(`${this.authUrl}/logout/`, {}).pipe(catchError(() => of(null)))
      : of(null);
    return request.pipe(
      tap(() => this.clearSession()),
      map(() => undefined)
    );
  }

  private setSession(response: AuthResponse): void {
    window.localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    this.currentUserSubject.next({ id: response.id, username: response.username });
  }

  private clearSession(): void {
    this.clearToken();
    this.currentUserSubject.next(null);
  }

  private clearToken(): void {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}
