import { effect, Injectable, signal } from '@angular/core';
import { Carrito } from '@orders/interface/product.interface.';

@Injectable({providedIn: 'root'})
export class CartStorageService {
  private readonly STORAGE_KEY = 'carrito';

  readonly carritoSignal = signal<Carrito>(this.load());

  constructor() {
    effect(() => {     
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.carritoSignal()));
    });
  }

  private load(): Carrito {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    
    if (saved) {
      try {
        return JSON.parse(saved) as Carrito;
      } catch {
        console.warn('Error leyendo el carrito. Reiniciando...');
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }

    return { paymentType: 0, clientId: 0, items: [] };
  }

  clear() {
    const empty: Carrito = { paymentType: 0, clientId: 0, items: [] };
    this.carritoSignal.set(empty);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}