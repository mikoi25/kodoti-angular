import { computed, inject, Injectable, signal } from "@angular/core";
import { orderService } from "../orders.service";
import { ProductInStockItem } from "../../interfaces/product.interface.";


@Injectable({providedIn: 'root'})
export class CartStockService {
   private readonly order = inject(orderService);

   //signal que guarda el stock
   private readonly _productStock = signal<ProductInStockItem[]>([]);
  productStock = computed(() => this._productStock()); // acceso público

  constructor() {
    this.loadStock();

  }

  private loadStock() {
    this.order.GetAllStocks().subscribe({
      next: res => this._productStock.set(res.items),
      error: err => console.error('Error cargando stock', err)
    });
  }

  getAvailableStock(productId: number): number {
    const item = this._productStock().find(p => p.productId === productId);
    return item?.stock ?? 0;
  }
}