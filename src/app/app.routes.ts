// Este archivo ya se incluyó completo en el paso de Componentes.
// Lo reproducimos aquí para que tengas todos los archivos juntos.

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list')
        .then(m => m.ProductList)
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/product-detail/product-detail')
        .then(m => m.ProductDetail)
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart/cart')
        .then(m => m.Cart)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/admin/login/login')
        .then(m => m.Login)
  },
  {
    path: 'admin',
    canActivate: [authGuard],  // Ruta protegida
    loadComponent: () =>
      import('./features/admin/admin-layout/admin-layout')
        .then(m => m.AdminLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard')
            .then(m => m.Dashboard)
      },{
        path: 'products',
        loadComponent: () =>
          import('./features/admin/admin-products/admin-products')
            .then(m => m.AdminProducts)
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./features/admin/product-form/product-form')
            .then(m => m.ProductForm)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./features/admin/product-form/product-form')
            .then(m => m.ProductForm)
      },
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  },
  { path: '**', redirectTo: 'products' }
];
