import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface AdminUser {
  username: string;
  role: 'admin';
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // En un proyecto real esto vendría de un JWT del servidor
  private readonly _user = signal<AdminUser | null>(null);

  readonly user       = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly isAdmin    = computed(() => this._user()?.role === 'admin');

  constructor(private readonly router: Router) {
    // Recupera sesión del localStorage al recargar
    const saved = localStorage.getItem('admin_user');
    if (saved) this._user.set(JSON.parse(saved));
  }

  /**
   * Login simulado — en producción llamarías a tu API
   * con usuario/contraseña y recibirías un JWT
   */
  login(username: string, password: string): boolean {
    // Credenciales hardcodeadas solo para demo
    if (username === 'admin' && password === 'admin123') {
      const user: AdminUser = { username, role: 'admin' };
      this._user.set(user);
      localStorage.setItem('admin_user', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this._user.set(null);
    localStorage.removeItem('admin_user');
    this.router.navigate(['/login']);
  }
}
