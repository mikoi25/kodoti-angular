import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of} from 'rxjs';
import { Customer } from '../interfaces/customer.interface';
import { Product, ProductInStock, ProductItem } from '../interfaces/product.interface.';
import { Order, OrderItem } from '../interfaces/order.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class orderService {
    private _http = inject( HttpClient);
    // private readonly ApiOrderUrl = environment.OrderUrl + 'v1/orders';
    private readonly ApiOrderUrl = environment;

    
    GetAll(pag?:number ):Observable<Order>{ 
      return this._http.get<Order>(`${this.ApiOrderUrl.OrderUrl + 'v1/orders'}` , {
        params: {
          page: pag!,
          take: 8,
        },   
      }).pipe(
     
        catchError((error)=>{
         return  of(error);
        })
      );
    }
  
     GetById(id:number):Observable<OrderItem>{
      return this._http.get<OrderItem>(`${this.ApiOrderUrl.OrderUrl + 'v1/orders'}/${id}`).pipe(
        catchError((error)=>{
         return  of(error);
        })
      );
    }
  
    addOrder(order:OrderItem):Observable<boolean>{
      return this._http.post<Order>(`${this.ApiOrderUrl.OrderUrl + 'v1/orders'}`,order).pipe(
        catchError((error)=>{
         return  of(error);
        })
      );
    } 

    GetAllProducts():Observable<Product>{ 
      return this._http.get<Product>(`${this.ApiOrderUrl.CatalogUrl + 'v1/products'}`, {
        params: {
          take: 100
        },   
      }).pipe(
        catchError((error)=>{
         return  of(error);
        })
      );
    }

    
    GetAllStocks():Observable<ProductInStock>{ 
      return this._http.get<ProductInStock>(`${this.ApiOrderUrl.CatalogUrl + 'v1/stocks'}`, {
        params: {
          take: 100
        },   
      }).pipe(
      
        catchError((error)=>{
         return  of(error);
        })
      );
    }

      ProductsById(id:number){ 
      return this._http.post<ProductItem>(`${this.ApiOrderUrl.CatalogUrl + 'v1/products'}`,id
      );
    }


    GetAllCustomers():Observable<Customer>{ 
      return this._http.get<Customer>(`${this.ApiOrderUrl.CustomerUrl + 'v1/clients'}`, {
        params: {
          take: 100
        },   
      }
      ).pipe(
        catchError((error)=>{
         return  of(error);
        })
      );
    }
}

