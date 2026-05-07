# FakeShop Angular

> Learning project built to practice modern Angular architecture (standalone components, lazy routes, guards, interceptors, and state with signals).

---

# FakeShop URL
Link: [fakeshop-angular.netlify.app](https://fakeshop-angular.netlify.app)

## English

### 1) What this project is

This project is a fake e-commerce app built as a personal Angular learning base.  
It includes:

- Product catalog and product detail pages
- Shopping cart with reactive state
- Admin section (login, dashboard, product management)
- Route protection with guards
- HTTP interceptors for caching and error/loading handling

Main goal: keep a reusable structure so future Angular projects can start from this foundation.

### 2) Tech stack

- Angular `21` (standalone APIs)
- Angular Router (lazy loaded components)
- Angular HttpClient + functional interceptors
- Angular Signals for local/global UI state
- Chart.js (dashboard charts)
- TypeScript + SCSS

### 3) Run the project

```bash
npm install
npm start
```

Open `http://localhost:4200/`.

Other useful scripts:

```bash
npm run build
```

### 4) High-level architecture

- **Standalone app setup**: no `AppModule`; global providers are defined in `src/app/app.config.ts`.
- **Routing-first design**: routes live in `src/app/app.routes.ts` and most screens are lazy loaded.
- **Feature-based folders**: business features are grouped under `src/app/features`.
- **Shared UI layer**: reusable UI components live under `src/app/shared/components`.
- **Core layer**: cross-cutting concerns (auth, guards, interceptors, loading) are in `src/app/core`.

### 5) Project structure (where to find things)

```text
src/
  app/
    app.config.ts                  # Global providers (router, HttpClient, interceptors)
    app.routes.ts                  # Route map and lazy loading
    app.ts / app.html / app.scss   # Root component + layout shell

    core/
      guards/
        auth-guard.ts              # Protects /admin routes
      interceptors/
        cache.interceptor.ts       # Caches GET requests in memory
        http-error.interceptor.ts  # Global loading + user-friendly HTTP errors
      services/
        auth.service.ts            # Demo admin auth (localStorage + signals)
        loading.service.ts         # Global loading state

    features/
      products/
        product-list/              # Catalog screen
        product-detail/            # Product detail screen
        product.service.ts         # Product API calls
      cart/
        cart/                      # Cart screen
        cart.service.ts            # Cart state (signals + computed values)
      admin/
        login/                     # Admin login
        admin-layout/              # Admin shell with child routes
        dashboard/                 # Admin dashboard (charts/metrics)
        admin-products/            # Product admin list
        product-form/              # Create/edit product

    shared/
      components/
        navbar/
        product-card/
        loading-spinner/
        error-message/
      models/
        product.interface.ts       # Shared domain types

  environments/
    environment.ts                 # Dev environment values
    environment.prod.ts            # Production values
```

### 6) Route map

- `/products` -> product list
- `/products/:id` -> product detail
- `/cart` -> shopping cart
- `/login` -> admin login
- `/admin/...` -> admin area (protected by `authGuard`)
  - `/admin/dashboard`
  - `/admin/products`
  - `/admin/products/new`
  - `/admin/products/edit/:id`

### 7) Data and state flow

Typical read flow:

1. A component requests data through a feature service (`ProductService`).
2. Request goes through interceptors:
   - `cacheInterceptor` returns cached GET responses when available.
   - `httpErrorInterceptor` controls global loading and normalizes errors.
3. Component receives data and renders UI.

Cart/auth flow:

- `CartService` stores cart items in signals and exposes computed totals.
- `Auth` service stores admin session and is consumed by `authGuard`.

### 8) How to reuse this as a future Angular starter

If you want to build another Angular app using this as a base:

1. Keep `core/` pattern (guards, interceptors, global services).
2. Keep `features/` pattern (one folder per business area).
3. Keep `shared/` only for truly reusable components/models.
4. Define routes first (`app.routes.ts`) and lazy load screens by default.
5. Centralize API access in services (avoid HTTP calls directly in components).
6. Keep environments for URLs/keys and avoid hardcoding config.

Recommended process for a new project:

- Copy the structure
- Rename domain models and services first
- Replace API endpoints in feature services
- Add/adjust routes
- Build feature by feature without breaking architecture boundaries

### 9) Notes and improvements for production

- Current admin auth is demo-only (hardcoded credentials).
- Add real backend auth (JWT/refresh token) for production.
- Add stronger test coverage per feature and per service.
- Add e2e tests and CI pipeline.

---

## Español

### 1) De qué trata este proyecto

Este proyecto es un e-commerce falso creado como base personal para aprender Angular moderno.  
Incluye:

- Catálogo de productos y detalle
- Carrito de compras con estado reactivo
- Sección de administración (login, dashboard y gestión de productos)
- Protección de rutas con guards
- Interceptores HTTP para caché y manejo global de errores/loading

Objetivo principal: mantener una estructura reutilizable para iniciar proyectos Angular futuros.

### 2) Stack tecnológico

- Angular `21` (API standalone)
- Angular Router (carga perezosa de componentes)
- Angular HttpClient + interceptores funcionales
- Angular Signals para manejo de estado
- Chart.js (gráficas en dashboard)
- TypeScript + SCSS

### 3) Cómo ejecutar el proyecto

```bash
npm install
npm start
```

Abre `http://localhost:4200/`.

Scripts útiles:

```bash
npm run build
```

### 4) Arquitectura general

- **App standalone**: no hay `AppModule`; los providers globales se registran en `src/app/app.config.ts`.
- **Diseño orientado a rutas**: las rutas están en `src/app/app.routes.ts` y las pantallas se cargan en lazy loading.
- **Estructura por funcionalidades**: cada dominio vive en `src/app/features`.
- **Capa compartida**: componentes reutilizables en `src/app/shared/components`.
- **Capa core**: responsabilidades transversales (auth, guards, interceptores, loading) en `src/app/core`.

### 5) Estructura del proyecto (dónde está cada cosa)

La estructura principal está organizada así:

- `src/app/core`: reglas globales y servicios base
- `src/app/features`: funcionalidades del negocio (products, cart, admin)
- `src/app/shared`: componentes y modelos reutilizables
- `src/environments`: configuración por ambiente

Usa el bloque de estructura de la sección en inglés como referencia rápida completa.

### 6) Mapa de rutas

- `/products` -> lista de productos
- `/products/:id` -> detalle de producto
- `/cart` -> carrito
- `/login` -> login admin
- `/admin/...` -> área admin protegida por `authGuard`
  - `/admin/dashboard`
  - `/admin/products`
  - `/admin/products/new`
  - `/admin/products/edit/:id`

### 7) Flujo de datos y estado

Flujo típico de lectura:

1. Un componente pide datos a un servicio de feature (por ejemplo `ProductService`).
2. La petición pasa por interceptores:
   - `cacheInterceptor` devuelve respuestas GET desde memoria si existen.
   - `httpErrorInterceptor` maneja loading global y errores legibles.
3. El componente recibe la respuesta y renderiza la vista.

Estado en carrito/auth:

- `CartService` usa signals y computed para estado y totales.
- `Auth` guarda sesión de admin y lo consume `authGuard`.

### 8) Cómo usar este proyecto como base para otro

Si quieres volver a crear otro proyecto Angular basándote en este:

1. Mantén el patrón `core/` para lo global.
2. Mantén el patrón `features/` por dominio de negocio.
3. Deja `shared/` solo para lo realmente reutilizable.
4. Define rutas desde el inicio y usa lazy loading por defecto.
5. Centraliza llamadas HTTP en servicios.
6. Separa variables por ambiente (`environment.ts`).

Proceso recomendado:

- Copiar estructura base
- Renombrar modelos/servicios al nuevo dominio
- Cambiar endpoints de API
- Ajustar rutas
- Construir feature por feature sin romper límites de capas

### 9) Mejoras sugeridas para producción

- El login admin actual es demostrativo (credenciales hardcodeadas).
- Integrar autenticación real con backend (JWT).
- Aumentar cobertura de pruebas unitarias/e2e.
- Configurar pipeline de CI/CD.
