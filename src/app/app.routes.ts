import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './auth/guards/not-authenticated.guard';

export const routes: Routes = [
    {
        path:'auth',
        loadChildren : () => import('./auth/auth.routes')
    },
    {
        path:'orders',
        loadChildren : () => import('./orders/orders.routes')
    },
   {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full',
   },
   {
    path: '**',
    redirectTo: 'orders',
   }
];
