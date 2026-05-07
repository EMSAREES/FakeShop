import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import {
  ReactiveFormsModule, FormBuilder, FormGroup, Validators
} from '@angular/forms';
import { ProductService } from '../../products/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm implements OnInit {

  readonly isEditMode = signal(false);
  readonly loading    = signal(false);
  readonly saving     = signal(false);
  readonly saved      = signal(false);
  readonly productId  = signal<number | null>(null);

  // Categorías disponibles en la Fake Store
  readonly categories = [
    "men's clothing",
    "women's clothing",
    'jewelery',
    'electronics'
  ];

  // FormGroup — formulario reactivo con validaciones
  form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    // Construye el formulario con sus validaciones
    this.form = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]],
      price: ['', [
        Validators.required,
        Validators.min(0.01),
        Validators.max(99999)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10)
      ]],
      category: ['', Validators.required],
      image: ['', [
        Validators.required,
        Validators.pattern('https?://.+') // Debe ser una URL válida
      ]]
    });

    // Detecta si estamos en modo edición leyendo el parámetro :id
    const id = this.route.snapshot.paramMap.get('id');
    if (id && !isNaN(+id)) {
      this.isEditMode.set(true);
      this.productId.set(+id);
      this.loadProduct(+id);
    }
  }

  private loadProduct(id: number): void {
    this.loading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        // Rellena el formulario con los datos del producto
        this.form.patchValue({
          title:       product.title,
          price:       product.price,
          description: product.description,
          category:    product.category,
          image:       product.image
        });
        this.loading.set(false);
      }
    });
  }

  // Getter helper: facilita acceder a los controles en el template
  // Uso: this.f['title'].errors
  get f() { return this.form.controls; }

  onSubmit(): void {
    // Marca todos los campos como tocados para mostrar errores
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.saving.set(true);

    // La Fake Store API tiene endpoints POST y PUT pero no persiste datos realmente
    // En producción aquí llamarías a tu propio backend
    setTimeout(() => {
      this.saving.set(false);
      this.saved.set(true);
      setTimeout(() => {
        this.router.navigate(['/admin/products']);
      }, 1500);
    }, 1000);
  }

  /** Verifica si un campo tiene error y fue tocado */
  hasError(field: string, error: string): boolean {
    const ctrl = this.f[field];
    return ctrl.hasError(error) && (ctrl.dirty || ctrl.touched);
  }
}
