import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { orderService } from '../../services/orders.service';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormUtils } from '../../../utils/form-utils';
import { ProductItemCart } from '../../interfaces/product.interface.';
import { CartService_V5 } from '../../services/cart-state/cart-state-v5.service';

@Component({
  imports: [ReactiveFormsModule ,CurrencyPipe],
  selector: 'app-orders-new',
  styleUrl: './orders-new.css',
  templateUrl: './orders-new.html',
})
export class OrdersNew {
    private readonly deps ={
    orderSevice :inject(orderService),
    router :inject(Router),
    fb : inject(FormBuilder)
  };

  public  cartService = inject(CartService_V5);
   
   // signals del carrito
  carrito = this.cartService.carrito;
  total = this.cartService.total;
 
   // Formulario
  orderForm = this.deps.fb.group({
      paymentType:[0,[Validators.required,Validators.pattern(FormUtils.notOnlySpacesPattern)]],
      clientId:[1,[Validators.required,Validators.pattern(FormUtils.notOnlySpacesPattern)]],
      productId:[ 1,[Validators.required, Validators.pattern(FormUtils.notOnlySpacesPattern)]]
    })
    //Select options
  public paymentType = [
    { id: 0, desc: 'CreditCard' },
    { id: 1, desc: 'PayPal' },
    { id: 2, desc: 'BankTransfer' },
  ];

  // Resources
  customersRx =rxResource({
    stream: () =>{
      return this.deps.orderSevice.GetAllCustomers();
    }
  })
  productsRx =rxResource({
    stream: () =>{
      return this.deps.orderSevice.GetAllProducts();
    }
  })

   // Métodos
  save() {
   
   this.deps.orderSevice.addOrder(this.cartService.carrito()).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.deps.router.navigate(['/order/list']);
      },
      error: (err) => {
        console.error('Error guardando orden', err);
      },
    });
  }
addItem() {
   const product = this.productsRx.value()?.items.find(p => p.productId == this.orderForm.value.productId!)!;

   if(!product) return ;
   const productItemCart1:ProductItemCart = { productId:product.productId, unitPrice: product.price, quantity:1, }; 
   this.cartService.addItem(productItemCart1); 
  }
  changepaymentType(){
      this.cartService.setPaymentType(Number(this.orderForm.value.paymentType!));
  }
  changeClientId(){
  this.cartService.setClient(Number(this.orderForm.value.clientId!));
  }
}
