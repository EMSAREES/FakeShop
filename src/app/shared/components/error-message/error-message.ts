/*
* ERROR MESSAGE COMPONENT
* Componente reutilizable para mostrar errores.
* Emite un evento Output cuando el usuario quiere reintentar.
*/

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.html',
  styleUrl: './error-message.scss',
})

export class ErrorMessageComponent {
  @Input() title: string = 'Algo salió mal';
  @Input() message: string = 'Ocurrió un error inesperado.';
  @Input() showRetry: boolean = true;

  // @Output() + EventEmitter permite que este componente
  // envíe eventos al componente padre. El padre escucha:
  // <app-error-message (retry)="loadData()">
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
