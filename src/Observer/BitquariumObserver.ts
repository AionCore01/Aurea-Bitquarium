// src/Observer/BitquariumObserver.ts

import { IObserver } from './IObserver';
import { WorkState } from '../Model/WorkState';
import { Bitquarium } from '../Model/Bitquarium'; 
import { EventLogger } from '../Events/EventLogger'; // ¡El Ledger que emite eventos!
import { EventType } from '../Events/IEvent';

export class BitquariumObserver implements IObserver {
    private bitquarium = Bitquarium.getInstance(); // Acceso al Capital Singleton
    private logger = EventLogger.getInstance(); 

    constructor() {
        // La clave es la suscripción: El Observer de Capital escucha los logs de Auditoría.
        this.logger.subscribeToAudits(this.handleAuditEvent.bind(this));
        console.log('BitquariumObserver: Listo para escuchar eventos AUDIT del Ledger.');
    }

    // Este método es requerido por la interfaz IObserver, pero no se usa aquí.
    update(subject: WorkState): void {
        // El BitquariumObserver escucha eventos de alto nivel (Ledger), no el WorkState directamente.
    }

    /**
     * Procesa los eventos de auditoría (AUDIT LOGS) y dispara el depósito de Capital.
     */
    private handleAuditEvent(event: any): void {
        if (event.type === EventType.Audit && event.source === 'ProfessionalObserver') {
            const auditData = event.payload;
            const value = auditData.valueGenerated || 0;
            const taskId = auditData.taskId;
            const workHash = auditData.workHash;

            if (value > 0) {
                // 💥 Disparamos el depósito de valor en el Bitquarium
                this.bitquarium.processValueDeposit(value, taskId, workHash);
                
                // 💥 ¡NUEVO LOG DE CONFIRMACIÓN!
                console.log(`BitquariumObserver: **DEPÓSITO CONFIRMADO** de ${value} USD para "${taskId}".`); 
                
                // NOTA: El Bitquarium hace el console.log del depósito, evitando duplicidad.
            }
        }
    }
}