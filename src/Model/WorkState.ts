// src/Model/WorkState.ts

import { ISubject } from '../Observer/ISubject';
import { IObserver } from '../Observer/IObserver';
import * as crypto from 'crypto';

// 1. DEFINICIÓN DEL CONTRATO DE TAREA (Voluntad Registrada)
export interface ITaskCompletion {
    taskId: string;               // Identidad
    timeSpentHours: number;       // MPC 2 (Esfuerzo)
    valueGenerated: number;       // Token de Valor
    registrationLatencyMs: number;// MPC 2 (Factor Humano)
}

export class WorkState implements ISubject {
    public currentTasks: ITaskCompletion[] = [];
    public lastUpdateTimestamp: number = Date.now();
    public healthStatus: 'MAX_FOCUS' | 'NORMAL' | 'DEGRADED' = 'MAX_FOCUS';
    
    // El Sigilo Digital (Hash)
    public totalValueGeneratedHash: string = "initial_work_hash";
    
    private observers: IObserver[] = [];

    // --- IMPLEMENTACIÓN DE ISUBJECT ---
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

    notify(): void {
        for (const observer of this.observers) {
            observer.update(this); 
        }
    }

    /**
     * Procesa un ciclo de trabajo, calcula métricas y genera el Sigilo.
     */
    public completeTaskCycle(task: ITaskCompletion): void {
        this.currentTasks.push(task);
        this.lastUpdateTimestamp = Date.now();
        
        // 2. CREACIÓN DEL SIGILO (HASH ROBUSTO MPC 3)
        // El input incluye: ID, Tiempo, Valor y LATENCIA.
        // Si la latencia es alta, el hash cambia, reflejando la "fricción" en la firma criptográfica.
        const inputSigil = `${task.taskId}|${task.timeSpentHours.toFixed(2)}|${task.valueGenerated}|${task.registrationLatencyMs}`;
        
        // Generamos el SHA-256
        const hash = crypto.createHash('sha256').update(inputSigil).digest('hex');
        
        this.totalValueGeneratedHash = `WORK_HASH_${hash}`; 

        // Lógica de Disponibilidad (MPC 1)
        this.healthStatus = task.timeSpentHours >= 2 ? 'MAX_FOCUS' : 'NORMAL';
        
        console.log(`WorkState: Ciclo ${task.taskId} procesado.`);
        console.log(`   > Latencia: ${(task.registrationLatencyMs / 1000 / 60).toFixed(1)} min`);
        console.log(`   > Sigilo: ${this.totalValueGeneratedHash.substring(0, 15)}...`);
        
        this.notify();
    }
}