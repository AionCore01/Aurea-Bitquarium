// src/Observer/ISubject.ts

import { IObserver } from './IObserver';

/**
 * Define los métodos necesarios para gestionar a los Observers (Subscriptores).
 */
export interface ISubject {
  // Adjuntar: Permite a un Observer suscribirse
  attach(observer: IObserver): void;

  // Desadjuntar: Permite a un Observer cancelar la suscripción
  detach(observer: IObserver): void;

  // Notificar: Llama al método update() de todos los observers adjuntos.
  notify(): void;
}