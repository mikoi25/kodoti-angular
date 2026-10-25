import { Component, inject } from '@angular/core';
import { SharedPagination } from '../../../shared/pages/shared-pagination/shared-pagination';
import { RouterLink } from '@angular/router';
import { orderService } from '../../services/order.service';
import { createPagedSearch } from '../../../shared/services/paginacion.service';
import { OrderItem } from '../../interfaces/order.interface';

@Component({
  imports: [SharedPagination,RouterLink],
  selector: 'app-orders-list',
  styleUrl: './orders-list.css',
  templateUrl: './orders-list.html',
})
export class OrdersList {
    private orderService = inject(orderService);
  readonly search =createPagedSearch<OrderItem>({
    fetchPage: (page, perPage) => this.orderService.GetAll(page,perPage),
    matches : (item,term) =>
    String(item.orderNumber).includes(term),
    initialPerPage: 5,
  })
}
