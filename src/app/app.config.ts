/*
* APP CONFIG
* Punto central de configuración de la aplicación Angular.
* En Angular 17+ reemplaza al AppModule.
* Aquí registramos los providers globales:
*   - provideRouter: sistema de rutas
*   - provideHttpClient: cliente HTTP con interceptores
*   - provideAnimations: animaciones de Angular Material (opcional)
*/
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withPreloading,
  PreloadAllModules,
  withComponentInputBinding
} from '@angular/router';
import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';


import { routes } from './app.routes';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { cacheInterceptor } from './core/interceptors/cache.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    // Sistema de rutas con preloading: carga módulos lazy en segundo plano
    // después de que la app inicial ya cargó — navegación instantánea
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      // Permite pasar parámetros de ruta como @Input() en componentes
      withComponentInputBinding()
    ),

    // Cliente HTTP con interceptores registrados en orden:
    // 1. cacheInterceptor  — devuelve desde cache si existe
    // 2. httpErrorInterceptor — maneja errores y loading global
    provideHttpClient(
      withInterceptors([cacheInterceptor, httpErrorInterceptor])
    ),
  ]
};
