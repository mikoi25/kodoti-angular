import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Token, UserCreate, UserLogin } from '../interfaces/auth.interface';
import { catchError, Observable, tap, throwError } from 'rxjs';

type AuthStatus = 'checking' |'authenticated'|'not-authenticated';

const baseUrl = environment.IdentityUrl;

@Injectable({providedIn: 'root'})
export class authService {
private http = inject(HttpClient);
  private router = inject(Router)
  private _token =signal<string|null>(localStorage.getItem('token'));
 private _status = signal<AuthStatus>('checking');
 token= this._token.asReadonly();
 status = this._status.asReadonly();

isAuthenticated = computed(() => this._status() === 'authenticated');
  constructor() {
    this.checkAuthStatus();

    // 🚀 EFFECT: navegación automática
    effect(() => {
      if (this._status() === 'authenticated') {
        this.router.navigateByUrl('/order');
      }

      if (this._status() === 'not-authenticated') {
        this.router.navigateByUrl('/auth/login');
      }
    });

    // 💾 EFFECT: persistencia
    effect(() => {
      const token = this._token();

      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    });
  }
  
  
  checkAuthStatus() {
    const token = this._token();

    if (!token) {
      this._status.set('not-authenticated');
      return;
    }

    this._status.set('authenticated');
  }
  //Identity
  authentication(login:UserLogin):Observable<Token>{
    return this.http.post<Token>(`${baseUrl}v1/identity/authentication`,login)
     .pipe(
       tap((resp) =>{
        this._status.set('authenticated');
         this._token.set(resp.accessToken);
       }),
       
       catchError(err => {
          this._status.set('not-authenticated');
          return throwError(() => err);
        })
     )
  }

  create(userCreate:UserCreate){
    return this.http.post(`${baseUrl}v1/identity`,userCreate)
  }

  logout(){
    this._token.set(null);
    this._status.set('not-authenticated');
    ['token','carrito'].forEach(k => localStorage.removeItem(k))
  }

}
