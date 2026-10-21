// =========================
// auth.guard.ts
// =========================
// order
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { authService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {

  const authServices = inject(authService);
  const router = inject(Router);

  if (authServices.isAuthenticated()) {
    return true;
  }

  router.navigateByUrl('/auth/login');
  return false;
};


// =========================
// no-auth.guard.ts
// =========================
// auth
export const noAuthGuard: CanActivateFn = () => {

  const authServices = inject(authService);
  const router = inject(Router);

  if (!authServices.isAuthenticated()) {
    return true;
  }

  router.navigateByUrl('/order');
  return false;
};

