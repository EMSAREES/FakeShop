/*
* CART SERVICE
* Gestiona el estado del carrito de compras usando Signals
* de Angular 17+. Los Signals son la alternativa moderna a
* BehaviorSubject para el estado local/global.
*
* PATRÓN: State Management local con Signals
* signal()    = crea un estado mutable
* computed()  = estado derivado que se recalcula solo
* effect()    = efecto secundario cuando cambia un signal
*/

import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../../shared/models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService  {

  // Estado privado — solo este servicio puede modificarlo directamente
  // signal<CartItem[]>([]) crea un Signal con array vacío como valor inicial
  private readonly _items = signal<CartItem[]>([]);

  // ─── Estado público de solo lectura ─────────────────────────────────────────

  /** Lista de items del carrito (solo lectura para componentes) */
  readonly items = this._items.asReadonly()

  /*
  * computed() calcula el total automáticamente cada vez que _items cambia.
  * NO hace la suma manualmente — Angular sabe cuándo recalcular.
  */
  readonly totalPrice = computed(() =>
    this._items().reduce(
      (sum, item) => sum + (item.product.price * item.quantity),
      0
    )
  )

  /* Cantidad total de productos (no items únicos, sino unidades) */
  readonly totalItems = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  /* true si el carrito tiene al menos un producto */
  readonly hasItems = computed(() => this._items().length > 0);

  // ─── Métodos públicos ────────────────────────────────────────────────────────

  /**
  * Agrega un producto al carrito.
  * Si ya existe, incrementa la cantidad en lugar de duplicarlo.
  */
  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this._items();
    const existingIndex = currentItems.findIndex(
      item => item.product.id === product.id
    );

    if (existingIndex >= 0) {
      // Producto ya existe: actualiza la cantidad de forma inmutable
      // (no mutamos el array directamente — creamos uno nuevo)
      const updatedItems = currentItems.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      this._items.set(updatedItems);
    } else {
      // Producto nuevo: agrega al final del array
      this._items.set([...currentItems, { product, quantity }]);
    }
  }

  /*
  * Elimina completamente un producto del carrito por su ID
  */
  removeFromCart(productId: number): void {
    this._items.set(
      this._items().filter(item => item.product.id !== productId)
    );
  }

  /*
  * Actualiza la cantidad de un item específico.
  * Si la nueva cantidad es 0 o menos, elimina el item.
  */
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this._items.set(
      this._items().map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  /*
  * Vacía el carrito completamente
  */
  clearCart(): void {
    this._items.set([]);
  }

  /*
  * Verifica si un producto ya está en el carrito
  */
  isInCart(productId: number): boolean {
    return this._items().some(item => item.product.id === productId);
  }

}
