/*
* CART COMPONENT
* Muestra todos los productos en el carrito.
* Lee el estado directamente del CartService (que usa Signals).
*/

import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../cart.service';
import { CartItem  } from '../../../shared/models/product.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class Cart {

  // Inyectamos el CartService — como usa Signals, el template
  // se actualiza automáticamente cuando el estado cambia.
  constructor(readonly cartService: CartService) {}

  /** Elimina un item del carrito */
  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  /** Actualiza la cantidad de un item */
  updateQty(item: CartItem, delta: number): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + delta);
  }

  /** Vacía el carrito con confirmación */
  clearCart(): void {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.cartService.clearCart();
    }
  }

  /** trackBy para ngFor */
  trackByItemId(_: number, item: CartItem): number {
    return item.product.id;
  }
}
