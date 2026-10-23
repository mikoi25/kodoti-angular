import { Pipe, PipeTransform } from '@angular/core';
import { OrderPayment, OrderStatus } from '@orders/interface/order.interface';

@Pipe({ name: 'orderStatus' })
export class OrderStatusPipe implements PipeTransform {
  transform(value: OrderStatus | undefined): string {
    switch (value) {
      case OrderStatus.Pending: return 'Pendiente';
      case OrderStatus.Approved: return 'Pagado';
      case OrderStatus.Cancel: return 'Cancelado';
      default: return 'Desconocido' ;
    }
  }
}

@Pipe({ name: 'paymentType' })
export class PaymentTypePipe implements PipeTransform {
  transform(value: OrderPayment | undefined): string {
    switch (value) {
      case OrderPayment.PayPal: return 'Efectivo';
      case OrderPayment.CreditCard: return 'Tarjeta';
      case OrderPayment.BankTransfer: return 'Transferencia';
      default: return 'N/A' ;
    }
  }
}


@Pipe({name:'orderName'})
export class orderNamePipe implements PipeTransform{

  transform(value:number  | undefined)  :string{
      return "Order " +value;
  }
}



@Pipe({name:'clientName'})
export class clientNamePipe implements PipeTransform{

  transform(value:number  | undefined)  :string{
      return "Client " +value;
  }
}