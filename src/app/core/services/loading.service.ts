/*
* LOADING SERVICE
* Servicio singleton que gestiona el estado de carga GLOBAL
* de la aplicación. Cuando cualquier petición HTTP está en
* curso, este servicio lo sabe y lo comunica a todos los
* componentes que lo necesiten.
*
* PATRÓN: Observable + BehaviorSubject
* BehaviorSubject guarda el último valor emitido y lo entrega
* inmediatamente a cualquier nuevo suscriptor.
*/


import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'; // BehaviorSubject guarda último valor, Observable maneja flujos

// providedIn: 'root' = instancia única para toda la app (Singleton)
@Injectable({
  providedIn: 'root',
})

export class LoadingService {

  /*
  * BehaviorSubject privado — solo este servicio puede cambiar el valor
  * El $ al final es convención en Angular para nombrar Observables
  * El readonly se utiliza para declarar que una variable, propiedad o campo de una clase solo puede ser asignado una vez, ya sea al momento de declararlo o en el constructor de la clase
  */
  private readonly loadingSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /*
  * Observable público — los componentes se suscriben a este para saber el estado de carga
  * Solo lectura desde fuera del servicio (readonly)
  */
  readonly loading$: Observable<boolean> = this.loadingSubject$.asObservable();

  /*
  * Activa el indicador de carga global
  * Llamado por el interceptor HTTP al iniciar cada request
  */
  show(): void {
    this.loadingSubject$.next(true); // Cambia el valor a true, notificando a los suscriptores
  }

  /*
  * Desactiva el indicador de carga global
  * Llamado por el interceptor HTTP al terminar cada request
  */
  hide(): void {
    this.loadingSubject$.next(false);
  }

  /**
   * Getter para leer el valor actual sin suscribirse
   * Útil en guards o lógica condicional
   */
  get isLoading(): boolean {
    return this.loadingSubject$.getValue();
  }
}
