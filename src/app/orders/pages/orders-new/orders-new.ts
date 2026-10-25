import { Component, computed, inject } from '@angular/core';
import { ProductItemCart } from '../../interfaces/product.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';
import { orderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { CartService_V5 } from '../../services/cart-state/v5/cart-state-v5.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe,ReactiveFormsModule],
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
 private customersRx =rxResource({
    stream: () =>{
      return this.deps.orderSevice.GetAllCustomers();
    }
  })
private  productsResource = rxResource({
  stream: () =>
    forkJoin({
      products: this.deps.orderSevice.GetAllProducts(),
      stocks: this.deps.orderSevice.GetAllStocks()
    })
});

  productos = computed(() => this.productsResource.value()?.products.items ?? []);
  productsWithStock = computed(() =>  {
      const data = this.productsResource.value();
      
  if (!data) {
    return [];
  }
    const stockMap =  new Map(
      data.stocks.items.map(stock => [
         stock.productId,
         stock.stock
      ])
    );

    return data.products.items
       .map(product => ({
         ...product,
         stock: stockMap.get(product.productId) ?? 0
       }))
       .filter(prod =>prod.stock > 0);
  })
  customers = computed(() => this.customersRx.value()?.items ?? []);

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

  //  const product = this.productsRx.value()?.items.find(p => p.productId == this.orderForm.value.productId!)!;
   const product = this.productos().find(item => item.productId == this.orderForm.value.productId);

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
