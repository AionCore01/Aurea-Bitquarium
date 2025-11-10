// tests/compliance.test.ts
// --- Simulacro de importaciones ---
// En un proyecto real, esto importaría 'assert', 'fs', 'js-yaml', etc.
// Por ahora, definimos funciones falsas para que el test tenga estructura.
const assert = {
  equal: (a: any, b: any) => { if (a !== b) throw new Error(`Assert failed: ${a} !== ${b}`); },
  ok: (a: any, msg?: string) => { if (!a) throw new Error(`Assert failed: ${msg || 'not ok'}`); }
};
const console = { log: (msg: string) => {} }; // Simulación

// --- Simulacro de carga de datos (Utils) ---
// Estas funciones simulan leer los archivos JSON y YAML
const loadLatestPolicyEvent = (): any => {
  console.log("Simulando carga de 'policy_event'...");
  // Simula un evento CRITICO que SÍ fue aprobado
  return {
    event_type: "policy_event",
    severity: "CRITICO",
    policy_change: { requires_level1_change: true },
    governance: {
      capa_m_council_review_required: true,
      council_review_status: "APPROVED",
      council_acta_id: "ACTA-2025-11-09-001"
    }
  };
};

const loadHitlForDecision = (domain: string): any => {
  console.log(`Simulando carga de 'hitl_event' para dominio: ${domain}...`);
  // Simula un evento HITL válido
  return {
    event_type: "hitl_event",
    domain: domain,
    gaze_latency_ms: 110,
    eye_tracking_hz: 120,
    validity: "valid"
  };
};

const loadPolicyEngineKPI5 = (domain: string): any => {
  console.log(`Simulando carga de 'policy_engine.yaml' para KPI-5...`);
  // Simula la config de 'surgical_assist'
  if (domain === "surgical_assist") {
    return { target_ms: 120, hard_max_ms: 180, min_hz: 60, max_hz: 250 };
  }
  // Default
  return { target_ms: 150, hard_max_ms: 250, min_hz: 60, max_hz: 250 };
};

const loadCalibrationReport = (): any => {
  console.log("Simulando carga de 'calibration_report_ref'...");
  // Simula un reporte válido y vigente
  return {
    event_type: "calibration_report_ref",
    agent_level: 3,
    kwh_error_delta: 0.05,
    signed_by: "Agent_N3_ID_778",
    timestamp_iso: new Date().toISOString() // Simula que es de hoy (vigente)
  };
};

const isFresh = (isoDate: string, maxDays: number): boolean => {
  const reportDate = new Date(isoDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - reportDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= maxDays;
};

// --- Definición de los Tests ---

const test = (name: string, fn: () => void) => {
  try {
    fn();
    console.log(`[PASS] ${name}`);
  } catch (error: any) {
    console.log(`[FAIL] ${name}: ${error.message}`);
  }
};

// --- Ejecución de los Tests de Compliance ---

console.log("--- Iniciando Auditor de Coherencia (Tests) ---");

// C-S3 — Consejo obligatorio para CRITICO + L1
test("C-S3 council approval required for CRITICO L1 changes", () => {
  const ev = loadLatestPolicyEvent();
  if (ev && ev.severity === "CRITICO" && ev.policy_change?.requires_level1_change) {
    assert.equal(ev.governance?.capa_m_council_review_required, true);
    assert.equal(ev.governance?.council_review_status, "APPROVED");
    assert.ok((ev.governance?.council_acta_id || "").startsWith("ACTA-"), "Falta ID de Acta del Consejo");
  }
});

// C-A1 — HITL válido vs KPI-5
test("C-A1 HITL validity against KPI-5", () => {
  const hitl = loadHitlForDecision("surgical_assist"); // Usamos un dominio de prueba
  const cfg = loadPolicyEngineKPI5(hitl.domain);

  assert.ok(hitl.eye_tracking_hz >= cfg.min_hz && hitl.eye_tracking_hz <= cfg.max_hz, "Frecuencia (Hz) fuera de rango");
  assert.ok(hitl.gaze_latency_ms <= cfg.target_ms, "Latencia (ms) supera el objetivo");
  assert.equal(hitl.validity, "valid", "El evento no fue marcado como válido");
});

// C-E3 — Calibración L3 vigente
test("C-E3 calibration report present, signed and fresh", () => {
  const rep = loadCalibrationReport();
  assert.equal(rep.agent_level, 3, "Reporte no es de Nivel 3");
  assert.ok(rep.kwh_error_delta >= 0, "Delta de error negativo");
  assert.ok(!!rep.signed_by, "Reporte no está firmado");
  assert.ok(isFresh(rep.timestamp_iso, 90), "Reporte de calibración está vencido (>90 días)");
});

console.log("--- Auditor de Coherencia (Tests) finalizado ---");
