// src/index.ts (VERSIÓN FINAL CON BITQUARIUM ACTIVO)

import * as dotenv from 'dotenv'; 
dotenv.config();

import { WorkState } from './Model/WorkState';
import { ProfessionalObserver } from './Observer/ProfessionalObserver';
import { BitquariumObserver } from './Observer/BitquariumObserver'; // 💥 1. Importar el Observer de Capital
import { Bitquarium } from './Model/Bitquarium'; // 💥 Importar Bitquarium
import { VisionObserver, EntropicInputs } from './Observer/VisionObserver'; // 💥 Importar VisionObserver
import { RiskOfficer } from './Service/RiskOfficer'; // Added import
import { HistoricalLedger } from './Service/HistoricalLedger'; // 💥 NUEVA IMPORTACIÓN
import { EventLogger } from './Events/EventLogger';
import { NotionConnector } from './Adapters/NotionConnector';

const logger = EventLogger.getInstance(); 

async function startAionAudit() {
    console.log('=== INICIO AUDITORÍA AION/LUNA (Conectando a Notion) ===\n');

    // 1. Instanciar Sujeto y Observers Clave
    const workState = new WorkState();
    const professionalObserver = new ProfessionalObserver();
    
    // Acceder al Singleton del Capital
    const bitquarium = Bitquarium.getInstance(); 

    // Observers ya creados
    const riskOfficer = new RiskOfficer();
    // 💥 Instanciar el Ledger Histórico antes del Observer
    const historicalLedger = new HistoricalLedger(); 
    
    const visionObserver = new VisionObserver(bitquarium, riskOfficer, 0.5, historicalLedger); // Pasar el Ledger
    const bitquariumObserver = new BitquariumObserver(); 
    
    // 1. ⚙️ ENTROPÍA INICIAL (Pre-Audit): El sistema está desordenado
    const initialEntropicInputs: EntropicInputs = {
        plannedTasks: 4,
        completedTasks: 1, // Desviación del Plan alta: (4-1)/4 = 0.75
        procrastinationLoad: 0.8, // Carga residual alta
    };
    visionObserver.setEntropicInputs(initialEntropicInputs);

    // 2. Conexión/Suscripción del Observer al Sujeto (WorkState)
    workState.attach(professionalObserver);

    // 3. Crear el Conector y Auditar la base de datos real
    const notionConnector = new NotionConnector(workState);
    
    console.log('NotionConnector: Consultado la base de datos profesional...');
    const completedCycles = await notionConnector.auditAndNotify();

    // --- CICLO COMPLETO AION/AUREA: RE-INVERSIÓN Y RIESGO ---

    // 2. ⚙️ ENTROPÍA POST-INVERSIÓN: La inversión forzó el orden y redujo la carga
    // Simulamos que la inversión ayudó a ordenar la carga residual (de 0.8 a 0.2)
    // El avance en la tarea grande aún no se refleja en planned/completed tasks de este ciclo.
    const postInvestmentEntropicInputs: EntropicInputs = {
        plannedTasks: 4,
        completedTasks: 1, 
        procrastinationLoad: 0.2, // Reducción drástica por "orden fisiológico"
    };
    // Establecemos los nuevos inputs antes del SEGUNDO reporte
    visionObserver.setEntropicInputs(postInvestmentEntropicInputs);

    // 💥 AUREA DECISIÓN: Reinvertir $100 USD
    const amountToReinvest = 100;
    bitquarium.processExpense(amountToReinvest, "CAPEX Biológico: Activación de Inversión Fisiológica (Recuperación de Hierro)");

    // Nota: processExpense ya notificó al VisionObserver, generando el SEGUNDO REPORTE.
    
    // ----------------------------------------------------------------------
    // 📈 REPORTE FINAL DE TENDENCIAS AION (Ledger Histórico)
    // ----------------------------------------------------------------------
    console.log('\n--- REPORTE FINAL DE TENDENCIAS AION (Ledger Histórico) ---');
    console.log(`Eventos registrados: ${historicalLedger.getRecords().length} ciclos auditados.`);
    
    // Imprimir cada registro para ver la tendencia
    historicalLedger.getRecords().forEach((record, index) => {
        console.log(`[Ciclo ${index + 1}] Capital: $${record.totalCapital.toFixed(2)} | RFI: ${record.riskFactorIntegral.toFixed(2)} | EPI: ${record.entropicPressureIndex.toFixed(2)}`);
    });

    // --- SIMULACIÓN PROFESIONAL FINALIZADA ---
    console.log('\n--- SIMULACIÓN PROFESIONAL FINALIZADA ---');
    console.log(`Ciclos de Trabajo Auditados por Notion: ${completedCycles}`);
    console.log(`Total de Eventos Auditados en Ledger: ${logger.getAllEvents().length}`);
}

startAionAudit();