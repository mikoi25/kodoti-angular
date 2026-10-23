import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { CartStorageService } from "./storage.service";
import { CartStockService } from "./cart-stock.service";
import { PaginationService } from "./pagination.service";
import { ProductItemCart } from "../../interfaces/product.interface.";

@Injectable({providedIn: 'root'})
export class CartService_V5 {

  private deps = {
    storage :inject(CartStorageService),
    stock:inject(CartStockService)
  }
  constructor(){
    effect(()=> {
         console.log(this.itemCount());
    })
  }
  stockError = signal<string>('');
  readonly carrito = computed(() => this.deps.storage.carritoSignal());
  readonly total = computed(() =>
    this.carrito().items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  );
  readonly itemCount = computed(() =>
    this.carrito().items.reduce((count, item) => count + item.quantity, 0)
  );
  readonly isEmpty = computed(() => this.carrito().items.length === 0);

  // 📌 Servicio de paginación reutilizable
readonly items = computed(() => this.carrito().items);

// en la paginación usas ese signal
readonly pagination = new PaginationService(this.items);
  showStockError(message: string, duration = 1500) {
    this.stockError.set(message);
    setTimeout(() => this.stockError.set(''), duration);
  }

  addItem(product: ProductItemCart) {
    const available = this.deps.stock.getAvailableStock(product.productId);
    
    const carrito = this.deps.storage.carritoSignal();
    const existing = carrito.items.find(p => p.productId === product.productId);
    const currentQty = existing?.quantity ?? 0;
    const newQty = currentQty + product.quantity;

    if (newQty > available) {
      this.showStockError(`Stock insuficiente. Stock: ${available}, solicitado: ${newQty}`);
      return;
    }

    if (existing) {
      this.updateQuantity(product.productId, product.quantity);
    } else {
      this.stockError.set('');
      this.deps.storage.carritoSignal.update(state => ({
        ...state,
        items: [...state.items, { ...product, quantity: Math.min(product.quantity, available) }]
      }));
    }
    this.pagination.adjustCurrentPage();
  }

  updateQuantity(productId: number, delta: number) {
    const available = this.deps.stock.getAvailableStock(productId);

    this.deps.storage.carritoSignal.update(state => {
      const updatedItems = state.items.map(item => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          const limitedQty = Math.max(1, Math.min(newQty, available));
          return { ...item, quantity: limitedQty };
        }
        return item;
      }).filter(item => item.quantity > 0);

      return { ...state, items: updatedItems };
    });

    this.pagination.adjustCurrentPage();
  }

  increaseQuantity(productId: number) {
    const available = this.deps.stock.getAvailableStock(productId);
    const currentItem = this.carrito().items.find(i => i.productId === productId);
    const currentQty = currentItem?.quantity ?? 0;

    if (currentQty + 1 > available) {
      this.showStockError(`Stock disponible: ${available}`);
      return;
    }

    this.updateQuantity(productId, 1);
  }

  decreaseQuantity(productId: number) {
    this.stockError.set('');
    this.updateQuantity(productId, -1);
  }

  removeItem(productId: number) {
    this.deps.storage.carritoSignal.update(state => ({
      ...state,
      items: state.items.filter(item => item.productId !== productId)
    }));
    this.pagination.adjustCurrentPage();
  }

  clearCart() {
    this.deps.storage.clear();
    this.pagination.currentPage.set(1);
  }

  setClient(clientId: number) {
    this.deps.storage.carritoSignal.update(state => ({ ...state, clientId }));
  }

  setPaymentType(paymentType: number) {
    this.deps.storage.carritoSignal.update(state => ({ ...state, paymentType }));
  }
}