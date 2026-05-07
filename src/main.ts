// ============================================================
// MAIN.TS — Punto de entrada de la aplicación
// Este es el primer archivo que ejecuta Angular.
// bootstrapApplication inicia la app con AppComponent
// como componente raíz y appConfig como configuración.
// ============================================================

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// bootstrapApplication reemplaza el antiguo AppModule.bootstrap
// Si ocurre un error fatal al iniciar, lo capturamos aquí
bootstrapApplication(App, appConfig)
  .catch((err) => console.error('Error iniciando la aplicación:', err));
