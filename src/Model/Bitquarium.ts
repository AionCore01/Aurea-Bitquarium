// src/Model/Bitquarium.ts (CON SOLUCIÓN DE CONFLICTO Y MPCs)

import { ISubject } from '../Observer/ISubject';
import { IObserver } from '../Observer/IObserver';
// Nota: Tendrás que importar crypto si quieres usar el hash.
// import * as crypto from 'crypto'; 

export class Bitquarium implements ISubject {
    private static instance: Bitquarium; // Implementando el Singleton
    
    // Capital total acumulado (la métrica principal)
    public totalCapitalValue: number = 0; 
    
    // --- PROPIEDADES CRÍTICAS EXPUESTAS PARA LA OBSERVACIÓN (MPCs) ---
    public populationState: number = 0;
    public lastUpdateTimestamp: number = Date.now();
    public inputsHash: string = "initial_hash_0000"; 
    public healthStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE' = 'ONLINE'; 
    
    private observers: IObserver[] = [];

    attach(observer: IObserver): void {
        const isExist = this.observers.includes(observer);
        if (!isExist) {
            this.observers.push(observer);
        }
    }

    detach(observer: IObserver): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex !== -1) {
            this.observers.splice(observerIndex, 1);
        }
    }

    // Patrón Singleton
    private constructor() {
        console.log('Bitquarium: Inicializando Capital (Valor actual: 0)');
    }
    public static getInstance(): Bitquarium {
        if (!Bitquarium.instance) {
            Bitquarium.instance = new Bitquarium();
        }
        return Bitquarium.instance;
    }

    // --- Implementación de ISubject (Attach, detach, notify...) ---
    // (Usa la lógica estándar que ya tenías)
    // ...

    notify(): void {
        console.log(`Bitquarium: Notificando Observers de Visión. Capital: ${this.totalCapitalValue}`);
        for (const observer of this.observers) {
            observer.update(this); 
        }
    }

    // --- Lógica de Depósito y Actualización de MPCs ---

    /**
     * Recibe Tokens de Valor, actualiza el Capital y notifica a los Observers de Visión.
     * @param value - El Token de Valor de la tarea auditada.
     * @param taskId - La ID de la tarea para el Sigilo.
     * @param workHash - El Sigilo Criptográfico del ciclo de trabajo.
     */
    public processValueDeposit(value: number, taskId: string, workHash: string): void {
        // 1. Actualización de la métrica central
        this.totalCapitalValue += value;
        
        // 2. Actualización de las MPCs de Visión
        this.populationState = this.totalCapitalValue; // populationState = capital
        this.inputsHash = workHash; // Usamos el Hash del ciclo como el Hash de entrada
        this.lastUpdateTimestamp = Date.now(); 
        this.healthStatus = 'ONLINE'; 
        
        console.log(`Bitquarium: Depósito de ${value} USD de ${taskId}. Capital Total: ${this.totalCapitalValue} USD.`);
        this.notify(); // 3. Notificar a los Observadores de Visión (ej. FishPopulationObserver)
    }

    /**
     * Registra un gasto o re-inversión de capital (OPEX/CAPEX) y notifica.
     * @param amount La cantidad de USD a gastar/invertir.
     * @param reason La razón de la salida de capital (ej: "CAPEX Biológico: Sueño").
     */
    public processExpense(amount: number, reason: string): void {
        if (amount <= 0) {
            console.error('Bitquarium ERROR: El monto del gasto debe ser positivo.');
            return;
        }

        if (this.totalCapitalValue >= amount) {
            // 1. Deducir el monto del capital total
            this.totalCapitalValue -= amount;
            
            // 2. Registrar el evento (se puede usar un log especial para gastos en el futuro)
            // Por ahora, solo logueamos la acción en consola.
            console.log(`\nBitquarium: Gasto/Inversión de ${amount.toFixed(2)} USD para "${reason}".`);
            console.log(`Bitquarium: Capital Total actualizado: ${this.totalCapitalValue.toFixed(2)} USD.`);

            // 3. Actualizar timestamp y notificar a los Observadores (VisionObserver)
            this.lastUpdateTimestamp = Date.now();
            this.notify();
            
        } else {
            console.error(`Bitquarium ERROR: Capital insuficiente. Total: ${this.totalCapitalValue.toFixed(2)} USD. Intento de gasto: ${amount.toFixed(2)} USD.`);
        }
    }
}