import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  readonly username = signal('');
  readonly password = signal('');
  readonly error = signal('');
  readonly loading = signal(false);

  constructor(
    private readonly auth: Auth,
    private readonly router: Router
  ) {
    // Si ya está logueado, redirige al dashboard
    if (this.auth.isAdmin()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onUsername(e: Event): void {
    this.username.set((e.target as HTMLInputElement).value);
  }

  onPassword(e: Event): void {
    this.password.set((e.target as HTMLInputElement).value);
  }

  onSubmit(): void {
    this.error.set('');
    this.loading.set(true);

    // Simula delay de red
    setTimeout(() => {
      const ok = this.auth.login(this.username(), this.password());
      if (ok) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.error.set('Usuario o contraseña incorrectos');
      }
      this.loading.set(false);
    }, 800);
  }
}
