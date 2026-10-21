import { Routes } from "@angular/router";
import { OrdersPage } from "./pages/orders-page/orders-page";
import { OrdersList } from "./pages/orders-list/orders-list";
import { OrdersDetails } from "./pages/orders-details/orders-details";
import { OrdersNew } from "./pages/orders-new/orders-new";

const routes:Routes = [
 {
    path: '',
    component:OrdersPage,
    children: [
        {
            path:'list',
            component:OrdersList
        },
        {
            path:'details/:id',
            component:OrdersDetails
        },
        {
            path:'new',
            component:OrdersNew
        },
        {
            path:'**',
            redirectTo:'list'
        }
    ]
 }
];

export default routes;