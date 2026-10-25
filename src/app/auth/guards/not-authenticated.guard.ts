import { inject } from "@angular/core";
import {  CanMatchFn, Route, Router, UrlSegment, UrlTree } from "@angular/router";
import { authService } from "../services/auth.service";



export const authGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
): boolean | UrlTree => {

  const auth = inject(authService);
  const router = inject(Router);

  // mientras valida token/sesión
  if (auth.status() === 'checking') {
    return router.createUrlTree(['/auth/login']);
  }

  return auth.isAuthenticated()
    ? true
    : router.createUrlTree(['/auth/login']);
};


/**
 * Evita entrar al módulo auth
 * cuando el usuario ya está autenticado
 *
 * Ej:
 * /auth/login
 * /auth/register
 */
export const noAuthGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
): boolean | UrlTree => {

  const auth = inject(authService);
  const router = inject(Router);

  if (auth.status() === 'checking') {
    return false;
  }

  return auth.isAuthenticated()
    ? router.createUrlTree(['/orders'])
    : true;
};
