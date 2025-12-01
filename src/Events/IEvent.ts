// src/Events/IEvent.ts

/**
 * Define el Contrato de Coherencia para cualquier evento auditable en AION.
 * Este debe reflejar los campos obligatorios de events_schema.json.
 */
export enum EventType {
    Metric = 'metric',
    Audit = 'audit',
    State = 'state',
    Command = 'command',
}

export interface IEvent {
    // 1. Campo de Determinismo
    id: string; // ID único del evento (podría ser un hash o UUID)
    
    // 2. Campo de Tiempo (Requerido por AION ORDEN)
    timestamp: string; // En formato ISO-8601 para auditabilidad.

    // 3. Campo de Clasificación
    type: EventType; // 'metric' para MPCs, 'audit' para errores, etc.
    
    // 4. Campo de Origen
    source: string; // Nombre del Observador o Módulo que emitió (Ej: FishPopulationObserver)

    // 5. Carga de Datos (El cuerpo de la Observación)
    payload: { 
        [key: string]: any; 
    }; 
}