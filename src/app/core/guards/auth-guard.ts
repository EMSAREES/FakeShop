import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth.service';

// Guard funcional (Angular 17+) — protege rutas del dashboard
// Si el usuario no es admin, lo redirige al login
export const authGuard: CanActivateFn = () => {
  const auth   = inject(Auth);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true; //  Tiene acceso
  }

  //  No tiene acceso — redirige al login
  router.navigate(['/login']);
  return false;
};
