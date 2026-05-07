/*
* PRODUCT LIST COMPONENT
* Componente "smart" (contenedor) — se comunica con servicios,
* gestiona el estado y pasa datos a los componentes hijos.
*
* CICLO DE VIDA de Angular:
*   constructor() → ngOnInit() → [uso] → ngOnDestroy()
*   - constructor: solo para inyección de dependencias
*   - ngOnInit: aquí sí cargas datos, inicializas lógica
*   - ngOnDestroy: limpieza (cancelar suscripciones, timers)
*/

import {
  Component, OnInit, OnDestroy, signal, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProductService } from '../product.service';
import { CartService } from '../../cart/cart.service';
import { Product } from '../../../shared/models/product.interface';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProductCard,
    LoadingSpinnerComponent,
    ErrorMessageComponent
  ],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductList implements OnInit, OnDestroy {

  // ─── Estado del componente con Signals ──────────────────────────────────────
  readonly products   = signal<Product[]>([]);
  readonly categories = signal<string[]>([]);
  readonly loading    = signal(false);
  readonly error      = signal<string | null>(null);

  // Estado del filtro y búsqueda
  readonly selectedCategory = signal<string>('all');
  readonly searchQuery      = signal<string>('');
  readonly minPrice = signal<number>(0);
  readonly maxPrice = signal<number>(1000);
  readonly minRating = signal<number>(0);
  readonly sortBy = signal<string>('default');
  readonly sidebarOpen = signal<boolean>(true);

  /**
   * computed() — filtra y busca en tiempo real.
   * Se recalcula automáticamente cuando cambia products,
   * selectedCategory o searchQuery.
   */
  readonly filteredProducts = computed(() => {
    let result = this.products();

    // Filtro por categoría
    const category = this.selectedCategory();
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    // Filtro por búsqueda
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Filtro por precio
    result = result.filter(p =>
      p.price >= this.minPrice() && p.price <= this.maxPrice()
    );

    // Filtro por rating mínimo
    result = result.filter(p => p.rating.rate >= this.minRating());

    // Ordenamiento
    const sort = this.sortBy();
    if (sort === 'price-asc')    result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc')   result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'rating')       result = [...result].sort((a, b) => b.rating.rate - a.rating.rate);
    if (sort === 'name')         result = [...result].sort((a, b) => a.title.localeCompare(b.title));

    return result;
  });

  // Precio máximo real de la API (para el slider)
  readonly realMaxPrice = computed(() => {
    const prices = this.products().map(p => p.price);
    return prices.length ? Math.ceil(Math.max(...prices)) : 1000;
  });


  // ─── Anti memory leak ───────────────────────────────────────────────────────
  // Subject que emite cuando el componente se destruye.
  // takeUntil(destroy$) cancela automáticamente todas las suscripciones.
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    // Notifica a takeUntil que cancele todas las suscripciones activas
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga productos y categorías en paralelo usando combineLatest.
   * combineLatest espera que AMBOS observables emitan antes de continuar.
   * Más eficiente que dos peticiones secuenciales.
   */
  loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    combineLatest([
      this.productService.getAllProducts(),
      this.productService.getCategories()
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ([products, categories]) => {
        this.products.set(products);
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  /** Filtra por categoría */
  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  /** Actualiza el término de búsqueda */
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  /** Agrega producto al carrito y lo delega al CartService */
  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  /** Verifica si un producto está en el carrito (para pasar al card) */
  isInCart(productId: number): boolean {
    return this.cartService.isInCart(productId);
  }

  /** trackBy mejora el rendimiento de *ngFor — Angular solo re-renderiza
   *  los items que realmente cambiaron, no toda la lista */
  trackByProductId(_index: number, product: Product): number {
    return product.id;
  }


  // Filtros
  onMinPrice(e: Event): void {
    this.minPrice.set(Number((e.target as HTMLInputElement).value));
  }

  onMaxPrice(e: Event): void {
    this.maxPrice.set(Number((e.target as HTMLInputElement).value));
  }

  onRating(rating: number): void {
    this.minRating.set(this.minRating() === rating ? 0 : rating);
  }

  onSort(e: Event): void {
    this.sortBy.set((e.target as HTMLSelectElement).value);
  }

  resetFilters(): void {
    this.selectedCategory.set('all');
    this.searchQuery.set('');
    this.minPrice.set(0);
    this.maxPrice.set(1000);
    this.minRating.set(0);
    this.sortBy.set('default');
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }
}
