import { Routes } from "@angular/router";
import { OrdersPage } from "./pages/orders-page/orders-page";
import { OrdersList } from "./pages/orders-list/orders-list";
import { OrdersNew } from "./pages/orders-new/orders-new";
import { OrdersDetails } from "./pages/orders-details/orders-details";

const routes: Routes = [
    {
        path: '',
        component: OrdersPage,
        children: [
            {
                path: 'list',
                component: OrdersList
            },
            {
                path: 'new',
                component: OrdersNew
            },
            {
                path: 'details/:id',
                component: OrdersDetails
            },
            {
                path: '**',
                redirectTo: 'list'
            }
        ]

    }
];

export default routes;