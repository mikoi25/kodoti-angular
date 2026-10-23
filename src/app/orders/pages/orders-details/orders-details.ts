import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { orderService } from '../../services/orders.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrderItem } from '../../interfaces/order.interface';
import { OrderStatusPipe, PaymentTypePipe } from '../../pipe/trans.pipe';

@Component({
  imports: [OrderStatusPipe, PaymentTypePipe],
  selector: 'app-orders-details',
  styleUrl: './orders-details.css',
  templateUrl: './orders-details.html',
})
export class OrdersDetails {

   private readonly deps = {
    route: inject(ActivatedRoute),
    router: inject(Router),
    orderServ: inject(orderService),
    
  };
   // Creamos un observable con la orden
  private readonly order$ = this.deps.route.params.pipe(
    switchMap(({ id }) => this.deps.orderServ.GetById(id)),
  );

  
  order = toSignal<OrderItem | null>(this.order$, { initialValue: null });

   constructor() {
    // Si la orden no existe, redirigimos
    effect(() => {
      const value = this.order();
      if (value === null) return; // aún cargando
      if (!value) this.deps.router.navigate(['/order']);
    });
  }
  
}
