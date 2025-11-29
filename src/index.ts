// src/index.ts (VERSIÓN CON NOTION CONNECTOR ACTIVO)

import * as dotenv from 'dotenv'; // IMPORTANTE: Carga el .env
dotenv.config();

import { WorkState } from './Model/WorkState';
import { ProfessionalObserver } from './Observer/ProfessionalObserver';
import { EventLogger } from './Events/EventLogger';
import { NotionConnector } from './Adapters/NotionConnector'; // <-- ¡El nuevo Adaptador!

const logger = EventLogger.getInstance(); 

async function startAionAudit() {
    console.log('=== INICIO AUDITORÍA AION/LUNA (Conectando a Notion) ===\n');

    // 1. Instanciar Sujeto y Observer
    const workState = new WorkState();
    const professionalObserver = new ProfessionalObserver();

    // 2. Conexión/Suscripción del Observer al Sujeto
    workState.attach(professionalObserver);

    // 3. Crear el Conector y Auditar la base de datos real
    const notionConnector = new NotionConnector(workState);
    
    console.log('NotionConnector: Consultado la base de datos profesional...');
    const completedCycles = await notionConnector.auditAndNotify();

    // --- RESULTADOS ---
    console.log('\n--- SIMULACIÓN PROFESIONAL FINALIZADA ---');
    console.log(`Ciclos de Trabajo Auditados por Notion: ${completedCycles}`);
    console.log(`Total de Eventos Auditados en Ledger: ${logger.getAllEvents().length}`);
}

startAionAudit();