// ============================================================
// APP COMPONENT (ROOT)
// El componente raíz de la aplicación.
// Contiene el Navbar y el <router-outlet> que es donde
// Angular inyecta el componente de la ruta activa.
// ============================================================

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
