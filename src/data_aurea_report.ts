// En src/data_aurea_report.ts

import { HistoricalLedger } from './Service/HistoricalLedger';
// Asume que necesitas importar tus otros componentes para inicializarlos,
// pero por ahora solo importaremos el Ledger para el reporte.

// Vamos a usar una función simple para el reporte
function generateDataAureaReport(historicalLedger: HistoricalLedger): void {
    const history = historicalLedger.getAllRecords();

    if (history.length === 0) {
        console.log('🚨 HISTORICAL LEDGER VACÍO. Necesitas correr la simulación (index.ts) primero.');
        return;
    }

    console.log('\n=======================================\n');
    console.log('📊 REPORTE DE TENDENCIA - DATA AUREA\n');
    console.log('=======================================\n');
    
    // Este es el análisis de tendencia pura:
    history.forEach((record, index) => {
        const capital = record.totalCapital.toFixed(2);
        const rfi = record.riskFactorIntegral.toFixed(2);
        const epi = record.entropicPressureIndex.toFixed(2);
        
        // Muestra el progreso del sistema en cada ciclo
        console.log(`
| Ciclo #${index + 1}:
| Capital Acumulado: $${capital}
| RFI (Riesgo Biomotor): ${rfi}
| EPI (Presión Entrópica): ${epi}
---------------------------------------
`);
    });

    // Un vistazo al factor de riesgo final
    const finalRecord = history[history.length - 1];
    console.log(`
RESUMEN FINAL:
* Capital al cierre: $${finalRecord.totalCapital.toFixed(2)}
* RFI Final: ${finalRecord.riskFactorIntegral.toFixed(2)}
    
    `);
}

// -----------------------------------------------------
// Aquí deberías inicializar tu Ledger y luego llamar a la función.
// Por ejemplo, si tienes tu instancia de ledger en index.ts:
//
// const ledger = new HistoricalLedger();
// generateDataAureaReport(ledger);
//
// Para fines de prueba, necesitas asegurarte de que tu archivo
// principal (index.ts) genera la data en el ledger antes de correr esto.
// -----------------------------------------------------

// Por ahora, solo déjalo así y lo llamaremos desde tu index.ts
// (o como se llame tu archivo principal) para asegurar que la data se genere.

export { generateDataAureaReport };
