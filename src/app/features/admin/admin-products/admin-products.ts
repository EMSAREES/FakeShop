import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../products/product.service';
import { Product } from '../../../shared/models/product.interface';

// Estado extendido del producto para el admin
interface AdminProduct extends Product {
  status: 'active' | 'inactive' | 'low-stock';
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.scss'
})
export class AdminProducts implements OnInit {

  readonly products       = signal<AdminProduct[]>([]);
  readonly loading        = signal(false);
  readonly searchQuery    = signal('');
  readonly filterCategory = signal('all');
  readonly categories     = signal<string[]>([]);
  readonly deleteModal    = signal<AdminProduct | null>(null); // producto a eliminar

  readonly filteredProducts = () => {
    let list = this.products();
    if (this.filterCategory() !== 'all') {
      list = list.filter(p => p.category === this.filterCategory());
    }
    const q = this.searchQuery().toLowerCase();
    if (q) list = list.filter(p => p.title.toLowerCase().includes(q));
    return list;
  };

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.loading.set(true);
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        // Asigna status inicial — en un app real vendría del backend
        const withStatus: AdminProduct[] = data.map((p, i) => ({
          ...p,
          status: i % 7 === 0 ? 'low-stock' : i % 5 === 0 ? 'inactive' : 'active'
        }));
        this.products.set(withStatus);
        const cats = [...new Set(data.map(p => p.category))];
        this.categories.set(cats);
        this.loading.set(false);
      }
    });
  }

  onSearch(e: Event): void {
    this.searchQuery.set((e.target as HTMLInputElement).value);
  }

  onFilterCategory(e: Event): void {
    this.filterCategory.set((e.target as HTMLSelectElement).value);
  }

  /** Cicla entre active → inactive → active */
  toggleStatus(product: AdminProduct): void {
    this.products.update(list =>
      list.map(p => p.id === product.id
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
      )
    );
  }

  /** Abre el modal de confirmación */
  confirmDelete(product: AdminProduct): void {
    this.deleteModal.set(product);
  }

  /** Elimina el producto (simulado — la Fake Store API acepta DELETE) */
  deleteProduct(): void {
    const p = this.deleteModal();
    if (!p) return;

    // En un app real: this.productService.deleteProduct(p.id).subscribe(...)
    this.products.update(list => list.filter(x => x.id !== p.id));
    this.deleteModal.set(null);
  }

  cancelDelete(): void {
    this.deleteModal.set(null);
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'active':    'Activo',
      'inactive':  'Inactivo',
      'low-stock': 'Stock bajo'
    };
    return map[status] ?? status;
  }
}
