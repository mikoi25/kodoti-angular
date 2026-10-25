import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";

import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";


//sin validar 401 sin  validar token vencido
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  const request = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigateByUrl('/auth/login');
      }

      return throwError(() => error);
    })
  );
};
