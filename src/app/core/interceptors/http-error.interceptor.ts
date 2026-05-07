/*
* HTTP ERROR INTERCEPTOR
* Los interceptores interceptan TODAS las peticiones HTTP
* antes de que salgan y todas las respuestas antes de que
* lleguen al servicio. Son como un middleware de Express en frontend.
*
* Este interceptor hace 2 cosas:
*   1. Activa/desactiva el loading global
*   2. Transforma los errores HTTP en mensajes legibles
*
* NOTA: En Angular 17+ los interceptors son funciones, no clases.
*/

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  // inject() es la forma moderna de obtener servicios fuera de constructores
  const loadingService = inject(LoadingService);

  // 1. Antes de enviar el request: activa el loading
  loadingService.show();

  // 2. Deja pasar el request y maneja la respuesta
  return next(req).pipe(
    // catchError captura cualquier error HTTP que regrese el servidor
    catchError((error: HttpErrorResponse) => {
      let userMessage = 'Ocurrió un error desconocido. Por favor, intenta de nuevo.';

      if (error.status === 0) {
        // status 0 = sin conexión o CORS bloqueado
        userMessage = 'Sin conexión a internet. Verifica tu red.';
      } else if (error.status === 400) {
        userMessage = 'Solicitud incorrecta. Verifica los datos.';
      } else if (error.status === 401) {
        userMessage = 'No autorizado. Inicia sesión nuevamente.';
      } else if (error.status === 403) {
        userMessage = 'Acceso denegado.';
      } else if (error.status === 404) {
        userMessage = 'El recurso solicitado no existe.';
      } else if (error.status >= 500) {
        userMessage = 'Error en el servidor. Intenta más tarde.';
      }

      // Registra el error técnico en consola (solo en dev — en prod usarías Sentry, etc.)
      console.error(`[HTTP Error] ${error.status}: ${error.message}`);

      // throwError() propaga el error transformado al componente que hizo la petición
      return throwError(() => new Error(userMessage));
    }),

    /*
    * finalize() se ejecuta SIEMPRE al terminar, con exito o error.
    * Aquí desactivamos el loading global, asegurando que no quede
    * activo si algo falla.
    * Es el equivalente a un bloque finally en un try/catch.
    */
    finalize(() => loadingService.hide())
  );
}
