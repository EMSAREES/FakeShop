/*
* PRODUCT CARD COMPONENT
* Tarjeta reutilizable para mostrar un producto.
* Recibe un producto como Input y emite eventos cuando
* el usuario interactúa con ella.
*
* PRINCIPIO: Componente "presentacional" — no sabe nada de
* servicios HTTP ni estado global. Solo muestra datos.
*/


import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss']
})
export class ProductCard {
  // El product es REQUERIDO — si el padre no lo pasa, hay error de TypeScript
  @Input({ required: true }) product!: Product;

  // Indica si el producto ya está en el carrito (para cambiar el botón)
  @Input() isInCart: boolean = false;

  // El componente padre escucha este evento:
  // <app-product-card (addToCart)="onAddToCart($event)">
  @Output() addToCart = new EventEmitter<Product>();

  constructor(private readonly router: Router) {}

  /**
   * Navega al detalle del producto.
   * Usamos el Router de Angular en lugar de <a href> para no recargar la página
   */
  goToDetail(): void {
    this.router.navigate(['/products', this.product.id]);
  }

  /**
   * Emite el evento addToCart al componente padre.
   * stopPropagation() evita que el click llegue a goToDetail()
   */
  onAddToCart(event: Event): void {
    event.stopPropagation(); // Evita que el click propague al div padre
    this.addToCart.emit(this.product);
  }

  /**
   * Trunca el título a un máximo de caracteres para mantener
   * todas las tarjetas con la misma altura
   */
  get truncatedTitle(): string {
    const maxLength = 50;
    return this.product.title.length > maxLength
      ? `${this.product.title.substring(0, maxLength)}...`
      : this.product.title;
  }

  /**
   * Genera un array para mostrar estrellas de rating
   * Convierte 3.9 → [1, 1, 1, 1, 0] para renderizar con *ngFor
   */
  get stars(): number[] {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.round(this.product.rating.rate) ? 1 : 0
    );
  }
}
