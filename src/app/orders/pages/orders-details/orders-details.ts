import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { orderService } from '../../services/order.service';
import { switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrderItem } from '../../interfaces/order.interface';

@Component({
  imports: [RouterLink],
  selector: 'app-orders-details',
  styleUrl: './orders-details.css',
  templateUrl: './orders-details.html',
})
export class OrdersDetails {
    private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly  orderService = inject(orderService);
    private readonly order$ = this.activatedRoute.params.pipe(
    switchMap(({ id }) => this.orderService.GetById(id)),
  );
 
  order =toSignal<OrderItem | null>(this.order$);
}
