// src/Events/EventLogger.ts

import { IEvent, EventType } from './IEvent';
import { AionEventEmitter } from './AionEventEmitter';
import * as crypto from 'crypto';

/**
 * EventLogger: Actúa como el receptor final y auditor de la Capa V/Ledger.
 * Escucha los eventos emitidos por el AionEventEmitter.
 */
export class EventLogger {
    private static instance: EventLogger;
    private readonly auditLog: IEvent[] = []; // El log se guarda en memoria

    // Constructor privado para el patrón Singleton
    private constructor() {
        // Suscribe inmediatamente al EventEmitter para empezar a escuchar
        AionEventEmitter.getInstance().subscribe(this.handleEvent.bind(this));
        console.log("Logger: Suscrito al AionEventEmitter. Listo para auditar.");
    }

    public static getInstance(): EventLogger {
        if (!EventLogger.instance) {
            EventLogger.instance = new EventLogger();
        }
        return EventLogger.instance;
    }

    /**
     * Maneja el evento y lo guarda en el log.
     * @param event El evento IEvent recibido del emisor.
     */
    private handleEvent(event: IEvent): void {
        this.auditLog.push(event);
        
        // Formato para mostrar la coherencia en la consola
        console.log(`\n[AUDIT LOG - ${event.type.toUpperCase()}]`);
        console.log(`ID: ${event.id}`);
        console.log(`Origen: ${event.source} | Tiempo: ${event.timestamp}`);
        console.log(`Carga Útil: ${JSON.stringify(event.payload, null, 2)}`);
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
            type: 'audit', // Los errores son eventos de auditoría
            source: 'EventLogger', // El EventLogger es quien maneja y registra el error
            payload: {
                eventName: eventName,
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                details: error, // Guarda el objeto de error completo para inspección
            },
        };
        this.handleEvent(errorEvent); // Utiliza el manejador de eventos existente para registrar
    }

    /**
     * Muestra todos los eventos registrados.
     */
    public getAllEvents(): IEvent[] {
        return this.auditLog;
    }
}