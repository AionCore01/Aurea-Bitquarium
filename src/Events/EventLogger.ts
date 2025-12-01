// src/Events/EventLogger.ts

import { IEvent, EventType } from './IEvent';
import { AionEventEmitter } from './AionEventEmitter';
import * as crypto from 'crypto';

// Define el tipo de función que el Ledger espera para sus callbacks
type AuditListener = (event: any) => void;

/**
 * EventLogger: Actúa como el receptor final y auditor de la Capa V/Ledger.
 * Escucha los eventos emitidos por el AionEventEmitter.
 */
export class EventLogger {
    private static instance: EventLogger;
    private events: IEvent[] = []; // Renamed from auditLog, using IEvent type
    private auditListeners: AuditListener[] = []; // NEW: Array to store audit observers

    // Constructor privado para el patrón Singleton
    private constructor() {
        // Subscribe to AionEventEmitter to receive all events and log them
        AionEventEmitter.getInstance().subscribe(this.logEvent.bind(this)); // Changed to logEvent
        console.log("Logger: Suscrito al AionEventEmitter. Listo para auditar.");
    }

    public static getInstance(): EventLogger {
        if (!EventLogger.instance) {
            EventLogger.instance = new EventLogger();
        }
        return EventLogger.instance;
    }

    /**
     * Permite a otros componentes (como BitquariumObserver) suscribirse a eventos AUDIT.
     */
    public subscribeToAudits(listener: AuditListener): void {
        this.auditListeners.push(listener);
        console.log('Logger: Nuevo componente suscrito a eventos de Auditoría.');
    }

    /**
     * Agrega un evento al Ledger, realiza console logging, y notifica a los suscriptores si es un evento AUDIT.
     */
    public logEvent(event: IEvent): void { // Now public and handles all logging
        this.events.push(event); // Push to 'events' array
        
        // Formato para mostrar la coherencia en la consola
        console.log(`
[AUDIT LOG - ${event.type.toUpperCase()}]`);
        console.log(`ID: ${event.id}`);
        console.log(`Origen: ${event.source} | Tiempo: ${event.timestamp}`);
        console.log(`Carga Útil: ${JSON.stringify(event.payload, null, 2)}`);

        // Notificación de suscriptores (only for 'AUDIT' type events)
        if (event.type === EventType.Audit) { // Use EventType enum for robustness
            for (const listener of this.auditListeners) {
                listener(event);
            }
        }
    }

    /**
     * Maneja un error, lo registra como un evento de auditoría y lo guarda en el log.
     * @param eventName El nombre o código del evento de error.
     * @param error El objeto de error.
     */
    public handleError(eventName: string, error: any): void {
        const errorEvent: IEvent = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            type: EventType.Audit, // Errors are audit events
            source: 'EventLogger', // EventLogger is the one handling and logging the error
            payload: {
                eventName: eventName,
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                details: error, // Saves the full error object for inspection
            },
        };
        this.logEvent(errorEvent); // Use the new logEvent
    }

    /**
     * Muestra todos los eventos registrados.
     */
    public getAllEvents(): IEvent[] {
        return this.events; // Returns from the new 'events' array
    }
}
