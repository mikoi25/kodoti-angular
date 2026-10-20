import { Routes } from '@angular/router';

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