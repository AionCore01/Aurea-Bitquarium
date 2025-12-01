// src/Service/MetricsCalculator.ts (CON PORCENTAJE DE UTILIDAD)

import { EventLogger } from '../Events/EventLogger';

export interface ICycleMetrics {
    totalValueGenerated: number;
    totalHoursSpent: number;
    averageRegistrationLatencyMs: number;
    performanceUsdPerHour: number;
    
    // 💥 NUEVAS MÉTRICAS FINANCIERAS
    totalOpexCost: number;       // Costo Operacional Total
    totalNetProfit: number;      // Utilidad Neta (Ganancia)
    profitMarginPercentage: number; // Porcentaje de Utilidad (Margen)
}

/**
 * Servicio encargado de procesar el Ledger y calcular métricas complejas.
 */
export class MetricsCalculator {
    private logger = EventLogger.getInstance(); 
    
    // 💥 Definición del Costo Operacional por Hora (OPEX/hr)
    private readonly OPEX_PER_HOUR = 10; // $10 USD/hora, incluyendo energía, software, desgaste, etc.

    /**
     * Calcula las métricas acumuladas de todos los ciclos de trabajo AUDITADOS.
     */
    public calculateMetrics(): ICycleMetrics {
        const auditEvents = this.logger.getAllEvents().filter(event => event.type === 'audit'); // Use 'audit' string directly here or import EventType

        let totalValue = 0;
        let totalHours = 0;
        let totalLatencyMs = 0;
        let count = 0;

        for (const event of auditEvents) {
            const payload = event.payload;
            totalValue += payload.valueGenerated || 0;
            totalHours += payload.timeSpentHours || 0;
            const latencyMs = payload.registrationLatencyMs || 0;
            totalLatencyMs += latencyMs;
            count++;
        }
        
        // --- 1. Cálculos Base ---
        const performanceUsdPerHour = totalHours > 0 ? totalValue / totalHours : 0;
        const averageRegistrationLatencyMs = count > 0 ? totalLatencyMs / count : 0;

        // --- 2. Cálculos Financieros ---
        const totalOpexCost = totalHours * this.OPEX_PER_HOUR; // OPEX Total = Horas * Costo/hr
        const totalNetProfit = totalValue - totalOpexCost;
        
        // Margen = (Utilidad Neta / Valor Generado) * 100
        const profitMarginPercentage = totalValue > 0 
            ? (totalNetProfit / totalValue) * 100 
            : 0;

        return {
            totalValueGenerated: totalValue,
            totalHoursSpent: totalHours,
            averageRegistrationLatencyMs: averageRegistrationLatencyMs,
            performanceUsdPerHour: performanceUsdPerHour,
            
            // 💥 Retorno de Nuevas Métricas
            totalOpexCost: totalOpexCost,
            totalNetProfit: totalNetProfit,
            profitMarginPercentage: profitMarginPercentage
        };
    }
}