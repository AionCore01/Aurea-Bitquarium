// src/Model/WorkState.ts (COMPLETO)

import { ISubject } from '../Observer/ISubject';
import { IObserver } from '../Observer/IObserver';

export interface ITaskCompletion {
    taskId: string;
    timeSpentHours: number;
    valueGenerated: number; // Ej: Puntos de valor o USD
}

export class WorkState implements ISubject {
    public currentTasks: ITaskCompletion[] = [];
    public lastUpdateTimestamp: number = Date.now();
    public healthStatus: 'MAX_FOCUS' | 'NORMAL' | 'DEGRADED' = 'MAX_FOCUS';
    public totalValueGeneratedHash: string = "initial_work_hash";
    
    private observers: IObserver[] = [];

    // --- IMPLEMENTACIÓN DE ISUBJECT (COPIADA DE BITQUARIUM) ---

    attach(observer: IObserver): void {
        const isExist = this.observers.includes(observer);
        if (!isExist) {
            this.observers.push(observer);
            // Logger: Este log se eliminará luego, pero confirma la conexión
            console.log('WorkState: Observer Profesional adjunto.'); 
        } else {
            console.warn('WorkState: Intentando adjuntar un Observer ya existente.');
        }
    }

    detach(observer: IObserver): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex !== -1) {
            this.observers.splice(observerIndex, 1);
            console.log('WorkState: Observer desadjunto.');
        }
    }

    notify(): void {
        console.log('WorkState: Notificando Observers Profesionales...');
        for (const observer of this.observers) {
            observer.update(this); 
        }
    }
    // --- FIN DE IMPLEMENTACIÓN DE ISUBJECT ---


    /**
     * Simula la finalización de un ciclo de trabajo crítico.
     */
    public completeTaskCycle(task: ITaskCompletion): void {
        this.currentTasks.push(task);
        this.lastUpdateTimestamp = Date.now();
        
        // Simulación: Generar un Hash basado en el valor generado (El Sigilo de tu Coherencia)
        const combinedValue = this.currentTasks.map(t => t.valueGenerated).reduce((a, b) => a + b, 0);
        this.totalValueGeneratedHash = `WORK_HASH_${combinedValue}`; 

        this.healthStatus = task.timeSpentHours >= 2 ? 'MAX_FOCUS' : 'NORMAL'; // Si dedicas >= 2h, es foco máximo.
        
        console.log(`WorkState: Ciclo de Tarea ${task.taskId} completado. Valor generado: ${task.valueGenerated}`);
        this.notify();
    }
}