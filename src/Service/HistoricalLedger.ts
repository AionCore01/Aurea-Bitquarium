// src/Service/HistoricalLedger.ts

export interface HistoricalRecord {
    timestamp: string;
    totalCapital: number;
    riskFactorIntegral: number;
    entropicPressureIndex: number;
}

/**
 * Servicio de Persistencia Conceptual para trazar la tendencia histórica
 * del Capital (Sol) y el Riesgo (Saturno).
 */
export class HistoricalLedger {
    private records: HistoricalRecord[] = [];

    /**
     * Guarda el estado final de los MPCs (Capital, RFI, EPI) al final de un ciclo.
     */
    public registerRecord(record: HistoricalRecord): void {
        this.records.push(record);
        // Log que confirma la persistencia de los datos
        console.log(`HistoricalLedger: Registro histórico guardado. Capital: $${record.totalCapital.toFixed(2)}, RFI: ${record.riskFactorIntegral.toFixed(2)}.`);
    }

    /**
     * Recupera todos los registros históricos.
     */
    public getRecords(): HistoricalRecord[] {
        return this.records;
    }

    /**
     * Recupera el historial completo de records para análisis.
     */
    public getAllRecords(): HistoricalRecord[] {
        // Asumiendo que guardas la data en un array llamado 'records'
        // Si tu variable se llama diferente, ajústala aquí.
        // Si no tienes una variable 'records', debes crearla: private records: HistoricalRecord[] = [];
        return this.records;
    }

}
