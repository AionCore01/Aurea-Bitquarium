// src/Service/RiskOfficer.ts

import { EntropicInputs } from '../Observer/VisionObserver'; // Importar la interfaz

export interface IRiskMetrics {
    riskFactorIntegral: number;
    volatilityIndex: number;
    entropyPressureIndex: number;
}

export class RiskOfficer {
    constructor() {
        // Constructor for RiskOfficer
    }

    // Actualizar la firma de la función para recibir los inputs de Entropía
    public compileRiskMetrics(coFactor: number, entropicInputs: EntropicInputs): IRiskMetrics {
    
        // ... (Tu lógica existente para RFI y Volatilidad) ...
        // Usaremos valores fijos de Volatilidad para enfocarnos en EPI por ahora
        const volatilityIndex = 0.3; 
        
        // -----------------------------------------------------------------
        // 2. CÁLCULO DEL POLÍMETRO DE ENTROPÍA (EPI)
        // -----------------------------------------------------------------
        
        // a) Desviación del Plan (Plan Deviation)
        const deviationFromPlan = entropicInputs.plannedTasks > 0
            ? (entropicInputs.plannedTasks - entropicInputs.completedTasks) / entropicInputs.plannedTasks
            : 0;
        
        // b) FÓRMULA EPI: 50% Desviación + 50% Carga Residual
        const entropyPressureIndex = (
            0.5 * deviationFromPlan + 
            0.5 * entropicInputs.procrastinationLoad
        );
    
        // -----------------------------------------------------------------
    
        // 3. RFI (Riesgo Biomotor) - Lógica de base
        // ... (lógica RFI, usando el valor anterior 0.42 como base para el primer reporte)
        const riskFactorIntegral = parseFloat((0.85 * volatilityIndex * coFactor + 0.5 * entropyPressureIndex).toFixed(2));
        // NOTA: Esta es una fórmula hipotética. Puedes ajustarla.
        
        return {
            riskFactorIntegral: riskFactorIntegral,
            volatilityIndex: parseFloat(volatilityIndex.toFixed(2)),
            entropyPressureIndex: parseFloat(entropyPressureIndex.toFixed(2)),
        };
    }
}
