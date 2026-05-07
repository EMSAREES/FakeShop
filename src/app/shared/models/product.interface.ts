/*
* INTERFACES DE PRODUCTO
* TypeScript usa interfaces para definir la "forma" de un objeto.
* Ventaja: si la API devuelve un campo que no existe aquí,
* TypeScript te avisa en tiempo de compilación — no en producción.
*/

/*
 * Rating — sub-objeto dentro de cada producto
 * Ejemplo de la API: { "rate": 3.9, "count": 120 }
*/
export interface Rating {
  rate: number;   // Puntuación del 0 al 5
  count: number;  // Cantidad de reseñas
}


/*
* Product — representa un producto de la Fake Store API
* Endpoint: GET /products o GET /products/:id
*/
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;      // URL de la imagen
  rating: Rating;
}

/*
* CartItem — un producto dentro del carrito, con cantidad
*/
export interface CartItem {
  product: Product;
  quantity: number;
}

/*
* ApiState<T> — patrón genérico para manejar cualquier
* respuesta HTTP con sus tres estados posibles:
* cargando / datos listos / error
*
* T es un "tipo genérico" — puede ser Product, Product[], string[], etc.
* Ejemplo: ApiState<Product[]> para la lista de productos
*/
export interface ApiState<T> {
  data: T | null;      // Los datos cuando la petición termina bien
  loading: boolean;    // true mientras espera respuesta
  error: string | null; // Mensaje de error si algo falla
}
