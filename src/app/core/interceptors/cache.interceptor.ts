/*
* CACHE INTERCEPTOR (opcional pero profesional)
* Guarda en memoria las respuestas de la API para no hacer
* la misma petición dos veces durante la sesión.
* Esto mejora la UX y reduce la carga en la API.
*/

import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

// Cache en memoria: Map<url, HttpResponse>
// Se limpia al recargar la página
const cache = new Map<string, HttpResponse<unknown>>();

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo cachear peticiones GET (no POST, PUT, DELETE)
  if (req.method !== 'GET') {
    return next(req);
  }

  // Si ya tenemos la respuesta en cache, la devolvemos directamente
  const cachedResponse = cache.get(req.url);
  if (cachedResponse) {
    // of() convierte un valor en Observable — simula una respuesta HTTP
    return of(cachedResponse);
  }

  // Si no hay cache, hacemos la petición real y guardamos el resultado
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.set(req.url, event);
      }
    })
  );
};
