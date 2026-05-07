/*
* LOADING SPINNER COMPONENT
* Componente "dumb" (presentacional) — solo muestra UI,
* no tiene lógica de negocio ni llamadas HTTP.
* Puede recibir un mensaje personalizado como Input
*/


import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss'
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Cargando...';
}
