import { Routes } from "@angular/router";
import { AuthPage } from "./pages/auth-page/auth-page";
import { AuthLogin } from "./pages/auth-login/auth-login";

const routes:Routes = [
  {
    path: '',
    component:AuthPage,
    children: [
        {
            path:'login',
            component:AuthLogin
        },
        {
           path: '**',
           redirectTo: 'login'
        }
    ]
  }
]


export default routes;
