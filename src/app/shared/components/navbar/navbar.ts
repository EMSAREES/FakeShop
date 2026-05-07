/*
* NAVBAR COMPONENT
* Barra de navegación principal.
* Lee el total de items del carrito desde CartService (Signal)
* para mostrar el badge en tiempo real.
*/

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../features/cart/cart.service';
import { LoadingService } from '../../../core/services/loading.service';
import { Auth } from '../../../core/services/auth.service';
import { readonly } from '@angular/forms/signals';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  constructor(
    readonly cartService: CartService,
    readonly loadingService: LoadingService,
    readonly auth: Auth
  ) {}
}
