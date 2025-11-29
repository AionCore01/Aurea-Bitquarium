// src/Model/Bitquarium.ts (CON MEJORAS)

import { ISubject } from '../Observer/ISubject';
import { IObserver } from '../Observer/IObserver';

export class Bitquarium implements ISubject {
  // --- PROPIEDADES CRÍTICAS EXPUESTAS PARA LA OBSERVACIÓN (MPCs) ---
  public populationState: number = 0;
  public lastUpdateTimestamp: number = Date.now(); // Marca de tiempo del último cambio
  public inputsHash: string = "initial_hash_0000"; // Hash de la última data de entrada (Determinismo)
  public healthStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE' = 'ONLINE'; // Disponibilidad (MPC 1)
  
  private observers: IObserver[] = [];

  // --- Implementación de ISubject ---
  // (Attach, detach, notify se mantienen igual)
  attach(observer: IObserver): void {
    // ... (Lógica de attach)
  }

  detach(observer: IObserver): void {
    // ... (Lógica de detach)
  }

  notify(): void {
    console.log('Bitquarium: Notificando Observers...');
    for (const observer of this.observers) {
      observer.update(this); 
    }
  }

  // --- Lógica de Negocio (El Disparador Mejorado) ---

  /**
   * Simula un cambio en el estado del Bitquarium, actualizando todas las MPCs.
   * @param newPopulation - El nuevo conteo de peces/datos.
   * @param newHash - El hash de la nueva data que garantiza el determinismo.
   */
  public processDataUpdate(newPopulation: number, newHash: string): void {
    // 1. Actualizar el estado (lo que dispara la observación)
    this.populationState = newPopulation;
    this.inputsHash = newHash;
    this.lastUpdateTimestamp = Date.now(); // Actualizar el timestamp justo antes de notificar
    this.healthStatus = 'ONLINE'; // Asumimos que si procesa, está ONLINE
    
    console.log(`Bitquarium: Procesando y Notificando. Hash: ${this.inputsHash}`);
    this.notify(); // Notificar con el nuevo estado
  }
  
  /**
   * Método para simular una falla que afecte la MPC de Disponibilidad.
   */
  public simulateFailure(): void {
      this.healthStatus = 'DEGRADED';
      this.notify();
  }
}