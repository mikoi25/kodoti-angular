import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Token, UserCreate, UserLogin } from '../interfaces/auth.interface';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

const baseUrl = environment.IdentityUrl;

@Injectable({providedIn: 'root'})
export class authService  {
     private http = inject(HttpClient);
  private router = inject(Router);

  private _status = signal<AuthStatus>('checking');
  private _token = signal<string | null>(localStorage.getItem('token'));

  token = this._token.asReadonly();
  status = this._status.asReadonly();

  isAuthenticated = computed(() => this._status() === 'authenticated');

  constructor() {
    this.initAuth();

    // 🚀 EFFECT 1: persistencia
    effect(() => {
      const token = this._token();

      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('orders')
      }
    });
 
    // 🚀 EFFECT 2: navegación controlada
    effect(() => {
      const status = this._status();

      if (status === 'authenticated') {
        this.router.navigateByUrl('/orders');
      }

      if (status === 'not-authenticated') {
        this.router.navigateByUrl('/auth/login');
      }
    });
  }

  // =========================
  // INIT
  // =========================

  private initAuth() {
    const token = localStorage.getItem('token');

    if (!token) {
      this._status.set('not-authenticated');
      return;
    }

    this._token.set(token);
    this._status.set('authenticated');

    // 🔥 aquí puedes validar token con backend después
  }


  //Identity
  authentication(login: UserLogin): Observable<Token> {
    return this.http.post<Token>(`${baseUrl}v1/identity/authentication`, login)
      .pipe(
        tap((resp) => {
          this._status.set('authenticated')
          this._token.set(resp.accessToken);

        }),
        catchError(err => {
          this._status.set('not-authenticated');
          return throwError(() => err);
        })
      );
  }
  create(userCreate: UserCreate) {
    return this.http.post(`${baseUrl}v1/identity`, userCreate)
  }

  logout() {
    this._token.set(null);
    this._status.set('not-authenticated');
    ['token','orders'].forEach(k => localStorage.removeItem(k));

  }
}


