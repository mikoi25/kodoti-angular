import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { authService } from '../services/auth.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authServices = inject(authService);
  const token = authServices.token();

  if (!token) return next(req);

  const newReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(newReq);
};
