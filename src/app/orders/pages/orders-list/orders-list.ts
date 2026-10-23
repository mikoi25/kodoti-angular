import { Component, computed, inject, signal } from '@angular/core';
import { orderService } from '../../services/orders.service';
import { PaginationService } from '../../../shared/components/pagination/pagination.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { RouterLink } from '@angular/router';
import { clientNamePipe, OrderStatusPipe, PaymentTypePipe } from '../../pipe/trans.pipe';

@Component({
  imports: [PaginationComponent,RouterLink, PaymentTypePipe, OrderStatusPipe, clientNamePipe],
  selector: 'app-orders-list',
  styleUrl: './orders-list.css',
  templateUrl: './orders-list.html',
})
export class OrdersList {

     public readonly  OrderService = inject(orderService);
    paginationService =inject(PaginationService);
  orderResource = rxResource({
  params: () => ({page:this.paginationService.currentPage()}),
   stream:({params}) => {
     return this.OrderService.GetAll(params.page);
     
   },
  })


   sortAsc = signal<boolean>(true);

  // Computed para devolver la lista ordenada
  ordersSorted = computed(() =>
    [...this.orderResource.value()!.items].sort((a, b) => {
      const aId = a.orderId ?? 0;
      const bId = b.orderId ?? 0;
      return this.sortAsc() ? aId - bId : bId - aId;
    })
  );

  toggleSort() {
    this.sortAsc.update(v => !v);
  }
}
