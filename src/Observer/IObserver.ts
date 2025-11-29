// src/Observer/IObserver.ts

import { ISubject } from './ISubject';

/**
 * Define el método de reacción que el Observer debe implementar.
 */
export interface IObserver {
  // El método que se llama cuando el Sujeto cambia de estado.
  update(subject: ISubject): void;
}