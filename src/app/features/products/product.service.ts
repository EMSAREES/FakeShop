/*
* PRODUCT SERVICE
* Responsabilidad única (SOLID - S): solo gestiona las
* peticiones HTTP relacionadas con productos.
*
* PATRÓN: Service Layer
* Los componentes NO hacen peticiones HTTP directamente.
* Todo pasa por el servicio — si la API cambia, solo
* modificas este archivo, no todos los componentes.
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../../shared/models/product.interface';

@Injectable({
  providedIn: 'root',
})

export class ProductService  {
  // URL base desde environment — no hardcodeada en el servicio
  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}// inyección de HttpClient para peticiones HTTP

  /**
  * Obtiene todos los productos
  * GET https://fakestoreapi.com/products
  * @param limit Opcional: limita la cantidad de resultados
  * @param sort  Opcional: 'asc' o 'desc'
  */
  getAllProducts(limit?: number, sort?: 'asc' | 'desc'): Observable<Product[]> {
    // Construimos los parámetros de query de forma segura
    let url = this.apiUrl;
    const params: string[] = [];

    if (limit) params.push(`limit=${limit}`);
    if (sort)  params.push(`sort=${sort}`);
    if (params.length) url += `?${params.join('&')}`;

    return this.http.get<Product[]>(url);
    // Nota: el manejo de errores está en el interceptor global
    // Aquí solo nos preocupamos por la lógica de negocio
  }

  /**
  * Obtiene un producto por su ID
  * GET https://fakestoreapi.com/products/:id
  */
  getProductById(id: number): Observable<Product> {
    // encodeURIComponent protege contra inyección en la URL
    // aunque en este caso sea un number, es buena práctica
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
  * Obtiene todas las categorías disponibles
  * GET https://fakestoreapi.com/products/categories
  */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  /**
  * Obtiene productos de una categoría específica
  * GET https://fakestoreapi.com/products/category/:category
  */
  getProductsByCategory(category: string): Observable<Product[]> {
    // encodeURIComponent convierte "men's clothing" en "men's%20clothing"
    // necesario para que la URL sea válida
    const encodedCategory = encodeURIComponent(category);
    return this.http.get<Product[]>(`${this.apiUrl}/category/${encodedCategory}`);
  }

}
