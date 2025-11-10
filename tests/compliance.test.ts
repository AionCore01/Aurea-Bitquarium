// tests/compliance.test.ts
import { describe, it, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import * as yaml from 'js-yaml';

// --- 1. Cargar Configuraciones y Esquemas ---

// Cargamos el Esquema de Evidencia (para AJV)
const schemaPath = path.resolve(__dirname, '../schemas/events_schema.json');
const schemaFile = fs.readFileSync(schemaPath, 'utf8');
const eventsSchema = JSON.parse(schemaFile);

// Cargamos las Políticas de Umbrales (KPI-5)
const policyPath = path.resolve(__dirname, '../config/policy_engine.yaml');
const policyFile = fs.readFileSync(policyPath, 'utf8');
const policyEngine = yaml.load(policyFile) as any; // Convertimos YAML a objeto

// Configuramos el Validador AJV
const ajv = new Ajv();
addFormats(ajv); // Añadir formatos como 'date-time' y 'uuid'
const validatePolicyEvent = ajv.compile(eventsSchema.$defs.policy_event);
const validateHitlEvent = ajv.compile(eventsSchema.$defs.hitl_event);
const validateCalibrationReport = ajv.compile(eventsSchema.$defs.calibration_report_ref);

// --- 2. Simulación de "Artefactos de Evidencia" ---
// En un pipeline real, leeríamos estos archivos generados por el 'run'.
// Por ahora, creamos objetos de prueba que *deberían* pasar la validación.

const mockPolicyEvent_CRITICO_Aprobado = {
 event_type: "policy_event",
 event_id: "a1b2c3d4-e5f6-7890-a1b2-c3d4e5f67890",
 timestamp_iso: new Date().toISOString(),
 severity: "CRITICO",
 detected_by: "guardian_j",
 policy_change: {
   requires_level1_change: true,
   policy_id_before: "POL-001@v1",
   policy_id_after: "POL-001@v2",
   diff_hash: "abc...",
   root_cause_id: "RC-123"
 },
 governance: {
   capa_m_council_review_required: true,
   council_review_status: "APPROVED",
   council_acta_id: "ACTA-2025-11-10-001"
 },
 links: {
   inputs_hash: "def...",
   outputs_hash: "ghi...",
   merkle_proof_url: "merkle/proof.json"
 }
};

const mockHitlEvent_Valido = {
 event_type: "hitl_event",
 event_id: "b2c3d4e5-f6a7-8901-b2c3-d4e5f6a78901",
 timestamp_iso: new Date().toISOString(),
 human_id: "HumanNode_01",
 decision_id: "DEC-456",
 domain: "surgical_assist", // Usamos el dominio estricto
 gaze_latency_ms: 115, // Pasa (target 120ms)
 eye_tracking_hz: 100, // Pasa (rango 60-250Hz)
 validity: "valid"
};

const mockCalibrationReport_Vigente = {
 event_type: "calibration_report_ref",
 report_id: "CAL-789",
 timestamp_iso: new Date().toISOString(), // Vigente (hoy)
 agent_level: 3,
 kwh_error_delta: 0.05,
 signed_by: "Agent_N3_ID_778",
 artifact_url: "artifacts/cal-789.pdf"
};

// --- 3. Ejecución de los Tests de Compliance (El Auditor) ---

describe('Auditor de Coherencia AIÓN-Orden (ISO)', () => {

 describe('C-S3: Gobernanza (ISO 9004 / 38500)', () => {
   it('debe validar el esquema de policy_event', () => {
     const valid = validatePolicyEvent(mockPolicyEvent_CRITICO_Aprobado);
     if (!valid) console.error(validatePolicyEvent.errors);
     expect(valid).toBe(true);
   });

   it('debe requerir aprobación del Consejo (acta) si es CRITICO y Nivel 1', () => {
     const ev = mockPolicyEvent_CRITICO_Aprobado;
     if (ev.severity === "CRITICO" && ev.policy_change.requires_level1_change) {
       expect(ev.governance.capa_m_council_review_required).toBe(true);
       expect(ev.governance.council_review_status).toBe("APPROVED");
       expect(ev.governance.council_acta_id).toContain("ACTA-");
     }
   });
 });

 describe('C-A1: HITL Válido (ISO 42001)', () => {
   it('debe validar el esquema de hitl_event', () => {
     const valid = validateHitlEvent(mockHitlEvent_Valido);
     if (!valid) console.error(validateHitlEvent.errors);
     expect(valid).toBe(true);
   });

   it('debe cumplir con los umbrales KPI-5 del policy_engine.yaml', () => {
     const ev = mockHitlEvent_Valido;
     const cfg = policyEngine.kpi5.domains[ev.domain] || policyEngine.kpi5.default;

     expect(ev.gaze_latency_ms).toBeLessThanOrEqual(cfg.target_ms);
     expect(ev.eye_tracking_hz).toBeGreaterThanOrEqual(cfg.min_hz);
     expect(ev.eye_tracking_hz).toBeLessThanOrEqual(cfg.max_hz);
     expect(ev.validity).toBe("valid");
   });
 });

 describe('C-E3: Calibración Sensores (ISO 50001)', () => {
   const isFresh = (isoDate: string, maxDays: number): boolean => {
     const reportDate = new Date(isoDate);
     const today = new Date();
     const diffTime = Math.abs(today.getTime() - reportDate.getTime());
     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
     return diffDays <= maxDays;
   };

   it('debe validar el esquema de calibration_report_ref', () => {
     const valid = validateCalibrationReport(mockCalibrationReport_Vigente);
     if (!valid) console.error(validateCalibrationReport.errors);
     expect(valid).toBe(true);
   });

   it('debe ser de Nivel 3, estar firmado y estar vigente (<= 90 días)', () => {
     const rep = mockCalibrationReport_Vigente;
     expect(rep.agent_level).toBe(3);
     expect(rep.signed_by).toBeTruthy(); // Verifica que no esté vacío o nulo
     expect(isFresh(rep.timestamp_iso, 90)).toBe(true);
   });
 });

});