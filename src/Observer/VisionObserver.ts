// src/Observer/VisionObserver.ts

import { IObserver } from './IObserver';
import { ISubject } from './ISubject';
import { Bitquarium } from '../Model/Bitquarium';
import { MetricsCalculator } from '../Service/MetricsCalculator';
import { RiskOfficer, IRiskMetrics } from '../Service/RiskOfficer';
import { HistoricalLedger, HistoricalRecord } from '../Service/HistoricalLedger'; // 💥 NUEVA IMPORTACIÓN

// Nueva Interfaz para el Cálculo de Entropía
export interface EntropicInputs {
    plannedTasks: number;
    completedTasks: number;
    procrastinationLoad: number; // Carga de tareas pendientes (0.0 a 1.0)
}

export class VisionObserver implements IObserver {
    private metricsCalculator = new MetricsCalculator();
    private riskOfficer: RiskOfficer;
    private currentCOFactor: number;
    private historicalLedger: HistoricalLedger; // 💥 NUEVA PROPIEDAD
    
    // Propiedad privada para almacenar los datos de Entropía
    private entropicInputs: EntropicInputs = { plannedTasks: 0, completedTasks: 0, procrastinationLoad: 0 };

    /**
     * Setter para inyectar los datos de rendimiento/planificación antes de cada reporte.
     */
    public setEntropicInputs(inputs: EntropicInputs): void {
        this.entropicInputs = inputs;
    }

    constructor(
        subject: Bitquarium, 
        riskOfficer: RiskOfficer, 
        initialCOFactor: number,
        historicalLedger: HistoricalLedger // 💥 NUEVO PARÁMETRO
    ) {
        this.riskOfficer = riskOfficer;
        this.currentCOFactor = initialCOFactor;
        this.historicalLedger = historicalLedger; // 💥 ASIGNACIÓN
        // 1. Suscribirse al Bitquarium para monitorear cambios de Capital.
        subject.attach(this);
        console.log('VisionObserver: Suscrito al Bitquarium para monitoreo de Capital.');
    }

    /**
     * Reacciona a las notificaciones del Bitquarium.
     */
    update(subject: ISubject): void {
        if (subject instanceof Bitquarium) {
            // 💥 LÓGICA DE IMPACTO DE LA RE-INVERSIÓN 💥
            
            // Si el Capital ha bajado (indicando una inversión/gasto),
            // simulamos una mejora en el factor de riesgo para el siguiente reporte.
            if (this.currentCOFactor > 0.1 && subject.totalCapitalValue < 750) { // 750 es el capital original
                 // Reducimos el CO Factor para demostrar que la inversión mitigó el riesgo
                this.currentCOFactor = 0.2; // Bajamos el factor de 0.5 a 0.2 para el SEGUNDO reporte.
                console.log('VisionObserver: La inversión ha mitigado el Costo de Oportunidad (CO Factor -> 0.2).');
            }

            this.reportVisionStatus(subject);
        }
    }

    /**
     * Genera un reporte detallado del estado del capital (MPCs de Visión).
     */
    private reportVisionStatus(bitquarium: Bitquarium): void {
        const metrics = this.metricsCalculator.calculateMetrics();
        const riskMetrics = this.riskOfficer.compileRiskMetrics(this.currentCOFactor, this.entropicInputs);

        console.log(`\n======================================================`);
        console.log(`👁️ REPORTE DE VISIÓN - ESTADO DEL CAPITAL AION (Factor Sol)`);
        console.log(`======================================================`);
        
        // MPC de Visión 1: Capital Acumulado
        console.log(`| CAPITAL ACUMULADO (Population): $${bitquarium.totalCapitalValue.toFixed(2)}`);
        
        // ------------------------------------------------------------
        // 💥 NUEVA SECCIÓN FINANCIERA
        console.log(`| `);
        console.log(`| 💰 UTILIDAD Y EFICIENCIA FINANCIERA`);
        console.log(`| Costo Operacional (OPEX): $${metrics.totalOpexCost.toFixed(2)}`);
        console.log(`| Utilidad Neta: $${metrics.totalNetProfit.toFixed(2)}`);
        console.log(`| Margen de Utilidad (Profit Margin): ${metrics.profitMarginPercentage.toFixed(2)}%`);
        console.log(`| `);
        // ------------------------------------------------------------
        
        // ------------------------------------------------------------
        // 💥 REPORTE DE SATURNO (RIESGO Y ESTABILIDAD)
        console.log(`| `);
        console.log(`| 🪐 REPORTE DE RIESGO Y ESTABILIDAD (Factor Saturno)`);
        console.log(`| Costo de Oportunidad (CO Factor): ${this.currentCOFactor.toFixed(2)}`);
        console.log(`| `);
        console.log(`| RFI (Riesgo Biomotor): ${riskMetrics.riskFactorIntegral.toFixed(2)}`);
        console.log(`| Volatilidad Conductual: ${riskMetrics.volatilityIndex.toFixed(2)}`);
        console.log(`| Presión de Entropía (EPI): ${riskMetrics.entropyPressureIndex.toFixed(2)}`);
        console.log(`|`);
        console.log(`| **CONCLUSIÓN EMPRESARIAL:** El RFI está ajustado por el CO Factor.`);
        console.log(`| Su voluntad mantiene la creatividad a pesar de la presión externa.`);
        // ------------------------------------------------------------
        
        console.log(`| 📊 METRICAS DE RENDIMIENTO DE CICLO`);
        console.log(`| Rendimiento ($/h): $${metrics.performanceUsdPerHour.toFixed(2)}`);
        
        // MPC de Visión 2: Determinismo (Hash de la Última Transacción)
        console.log(`| SIGILO DE CAPITAL (Inputs Hash): ${bitquarium.inputsHash.substring(0, 30)}...`);
        
        // MPC de Visión 3: Disponibilidad del Sistema
        console.log(`| SALUD DEL SISTEMA (Health Status): ${bitquarium.healthStatus}`);
        
        // Información de Tiempo
        const lastUpdate = new Date(bitquarium.lastUpdateTimestamp).toISOString();
        console.log(`| ÚLTIMA ACTUALIZACIÓN: ${lastUpdate}`);
        console.log(`======================================================\n`);
        
        // ==========================================
        // 💥 REGISTRO DE PERSISTENCIA (AÑADIR ESTO AL FINAL DEL REPORTE)
        // ==========================================
        const newRecord: HistoricalRecord = {
            timestamp: new Date().toISOString(),
            totalCapital: bitquarium.totalCapitalValue,
            riskFactorIntegral: riskMetrics.riskFactorIntegral,
            entropicPressureIndex: riskMetrics.entropyPressureIndex,
        };
        this.historicalLedger.registerRecord(newRecord);
    }
}