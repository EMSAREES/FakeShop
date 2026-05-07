/*
* PRODUCT DETAIL COMPONENT
* Muestra el detalle completo de un producto.
* Usa ActivatedRoute para leer el parámetro :id de la URL.
*
* Ejemplo de URL: /products/3
* ActivatedRoute.snapshot.paramMap.get('id') devuelve '3'
*/

import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProductService } from '../product.service';
import { CartService } from '../../cart/cart.service';
import { Product } from '../../../shared/models/product.interface';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, LoadingSpinnerComponent, ErrorMessageComponent],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss']
})
export class ProductDetail implements OnInit, OnDestroy {

  readonly product  = signal<Product | null>(null);
  readonly loading  = signal(false);
  readonly error    = signal<string | null>(null);
  readonly quantity = signal(1);  // Cantidad a agregar al carrito
  readonly addedToCart = signal(false);  // Para feedback visual

  readonly relatedProducts = signal<Product[]>([]);
  readonly loadingRelated  = signal(false);

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,   // Lee parámetros de la URL
    private readonly router: Router,           // Para navegar programáticamente
    private readonly productService: ProductService,
    private readonly cartService: CartService
  ) {}

  ngOnInit(): void {
    // Lee el parámetro :id de la URL actual
    // snapshot = foto instantánea de la ruta (no reactivo)
    const idParam = this.route.snapshot.paramMap.get('id');

    // Validación de seguridad: verificamos que el ID sea un número válido
    const id = idParam ? parseInt(idParam, 10) : NaN;

    if (isNaN(id) || id <= 0) {
      // ID inválido — redirige a la lista
      this.router.navigate(['/products']);
      return;
    }

    this.loadProduct(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProductById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (product) => {
          this.product.set(product);
          this.loading.set(false);
          // Una vez que tenemos el producto, cargamos los similares
          this.loadRelatedProducts(product.category, product.id);
        },
        error: (err: Error) => {
          this.error.set(err.message);
          this.loading.set(false);
        }
      });
  }

  /**
  * Carga productos de la misma categoría y excluye el actual.
  * Limita a 4 productos para no saturar la pantalla.
  */
  private loadRelatedProducts(category: string, excludeId: number): void {
    this.loadingRelated.set(true);

    this.productService.getProductsByCategory(category)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          // Filtra el producto actual y toma máximo 4
          const related = products
            .filter(p => p.id !== excludeId)
            .slice(0, 4);
          this.relatedProducts.set(related);
          this.loadingRelated.set(false);
        },
        error: () => {
          // Si falla, simplemente no muestra relacionados — no es crítico
          this.loadingRelated.set(false);
        }
      });
  }

  /** Incrementa la cantidad (mínimo 1) */
  incrementQuantity(): void {
    this.quantity.update(q => q + 1);
  }

  /** Decrementa la cantidad (mínimo 1) */
  decrementQuantity(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  /** Agrega al carrito con feedback visual temporal */
  addToCart(): void {
    const p = this.product();
    if (!p) return;

    this.cartService.addToCart(p, this.quantity());
    this.addedToCart.set(true);

    // Resetea el feedback después de 2 segundos
    setTimeout(() => this.addedToCart.set(false), 2000);
  }

  /** Genera array de estrellas para el rating */
  get stars(): number[] {
    const product = this.product();
    if (!product) return [];
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.round(product.rating.rate) ? 1 : 0
    );
  }

  /** Verifica si el producto ya está en el carrito */
 /** Verifica si un producto está en el carrito */
  isInCart(productId: number): boolean {
    return this.cartService.isInCart(productId);
  }

  /**
   * Al hacer clic en un producto relacionado, navega a su detalle
   * y hace scroll al tope de la página automáticamente.
   */
  goToRelated(id: number): void {
    this.router.navigate(['/products', id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onAddRelatedToCart(event: Event, product: Product): void {
    event.stopPropagation(); // Evita que dispare goToRelated()
    this.cartService.addToCart(product);
  }
}
