// src/Events/AionEventEmitter.ts

import { IEvent, EventType } from './IEvent';
// Importamos una librería para IDs únicos (simulación de UUID)
// En producción, usarías 'uuid', aquí lo simulamos.
import { v4 as uuidv4 } from 'uuid'; 

/**
 * Emisor de Eventos Singleton: Asegura que solo hay un canal de salida
 * para la Capa V/Ledger, garantizando la coherencia.
 */
export class AionEventEmitter {
    private static instance: AionEventEmitter;
    private listeners: ((event: IEvent) => void)[] = [];

    // Constructor privado para forzar el patrón Singleton
    private constructor() {
        // Inicialización silenciosa
    }

    public static getInstance(): AionEventEmitter {
        if (!AionEventEmitter.instance) {
            AionEventEmitter.instance = new AionEventEmitter();
        }
        return AionEventEmitter.instance;
    }

    /**
     * Suscribir un Logger o Handler al canal.
     */
    public subscribe(listener: (event: IEvent) => void): void {
        this.listeners.push(listener);
    }

    /**
     * Emite un evento, validando los campos obligatorios antes de enviarlo.
     */
    public emit(source: string, type: EventType, payload: object): void {
        if (!source || !type || !payload) {
            console.error("EVENT_EMITTER_FAIL: Faltan campos obligatorios para emitir.");
            return;
        }

        const event: IEvent = {
            id: uuidv4(), // ID único y determinista
            timestamp: new Date().toISOString(), // Timestamp en ISO-8601
            type: type,
            source: source,
            payload: payload
        };

        // Notificar a todos los listeners (Paso 3)
        for (const listener of this.listeners) {
            listener(event);
        }
    }
}