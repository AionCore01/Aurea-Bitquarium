---
title: "ISO_alignment.md"
description: "Alineación AIÓN-Orden ↔ Normas ISO. Matriz de cumplimiento, controles, evidencias y trazabilidad."
version: "0.1.1"
status: "draft"
owner: "Aurea-Bitquarium :: AIÓN-Orden"
maintainers:
 - name: "Romina Pacheco"
   email: "pachecormagali@gmail.com"
compliance:
 - ISO 9001:2015
 - ISO 9004
 - ISO 50001:2018
 - ISO/IEC 42001:2024
 - ISO 14001:2015
 - ISO/IEC 27001:2022
 - ISO/IEC 25010
ci:
 doc_lint: "markdownlint + vale"
 schema_checks: "events_schema.json validation + inputsHash determinism"
 security_checks: "secret scan + SBOM"
 evidence_pipeline: "artifacts/*.md + logs/*.parquet + merkle/*.json"
 release_tags: ["compliance", "security", "energy", "ethics"]
audit:
 trace: "ISO-AION/{run_id}/{timestamp_iso}/"
 merkle_root: "<set-by-pipeline>"
 inputs_hash: "<set-by-runtime>"
---

# ISO Alignment — AIÓN-Orden

AIÓN-Orden se define como “norma viva”: un sistema operativo-ético capaz de auditar su propio comportamiento bajo cinco pilares ISO transversales: calidad, seguridad, energía, medio ambiente y ética.

## 1. Resumen ejecutivo

  - Objetivo: correspondencia clara entre capas AIÓN y normas ISO, con controles verificables y evidencias reproducibles.
  - Principios: determinismo auditable, human-in-the-loop, gobernanza modular, eficiencia energética, eco-score por decisión, seguridad por diseño.
  - Telemetría canónica: events_schema.json, inputsHash, Merkle root, logs Parquet/CSV, políticas tipadas.

## 2. Matriz de correspondencia AIÓN ↔ ISO

| Capa / Módulo AIÓN | Función principal | Norma ISO | Correspondencia técnico-filosófica |
|---|---|---|---|
| I — Determinismo Auditado | Registro verificable, inputsHash, trazabilidad | ISO 9001:2015 | PDCA con pruebas de reproducibilidad por lote |
| G — Guardián J | Autocorrección, feedback, homeostasis | ISO 9004 | Mejora continua institucionalizada con umbrales y acciones correctivas |
| S — Supervisor de Coherencia (kits soberanos) | Gestión energética distribuida | ISO 50001:2018 | Cada kit como “unidad certificable”; medición, análisis, optimización |
| H — Nodo Humano / Ética Operativa | Control humano y transparencia | ISO/IEC 42001:2024 | HITL trazable y autogobernanza auditada |
| E — Entorno Ecológico Integrado | Sustentabilidad y circularidad | ISO 14001:2015 | Eco-score por decisión con metas y revisiones |
| D — Datos y Seguridad | Confidencialidad, integridad, disponibilidad | ISO/IEC 27001:2022 | Cifrado, Merkle trees y firmas; control de accesos |
| M — Gobernanza Modular | Responsabilidades y estructura federada | ISO 38500 | Consejo técnico-ético, rendición de cuentas y segregación de funciones |
| X — Interoperabilidad | Enlace IA-humanos-sistemas | ISO/IEC 25010 | Calidad y compatibilidad: funcionalidad, fiabilidad, mantenibilidad, portabilidad |

## 3. Controles clave por norma

### 3.1 ISO 9001:2015 — Calidad

  - C-Q1: PDCA versionado por flujo. Evidencia: artifacts/run_report.md.
  - C-Q2: Trazabilidad determinista. Evidencia: inputsHash + outputsHash + Merkle proof por lote.
  - C-Q3: No conformidades. Evidencia: policy_event con root cause y acción correctiva.

### 3.2 ISO 9004 — Éxito sostenido

  - C-S1: Guardián J con umbrales dinámicos y políticas de ajuste.
  - C-S2: Métricas de desempeño y revisión trimestral.
  - C-S3: Reporte escalado de anomalías. Si la autocorrección exige cambio de política de Nivel 1, el Guardián J emite un policy_event de severidad CRÍTICO y activa revisión y ratificación del Consejo AIÓN (Capa M) antes de desplegar cambios mayores. Evidencia: policy_event + acta del Consejo.

### 3.3 ISO 50001:2018 — Energía

  - C-E1: Medición de consumo/producción por kit soberano.
  - C-E2: Plan de mejora energética con objetivos e hitos.
  - C-E3: Auditoría de calibración de sensores y estimación de incertidumbre. Evidencia: Reporte de Calibración firmado por agente de Nivel 3; métrica de incertidumbre kWh_error ±δ como input del riesgo operativo y del Guardián J.

### 3.4 ISO/IEC 42001:2024 — IA responsable

  - C-A1: HITL por decisión crítica. La intervención es válida solo si incluye timestamp y evidencia de foco de atención del Nodo Humano usando KPI-5 (latencia ocular-objetivo ≤ X ms definido por dominio). Evidencia: event HITL con gaze_focus y latencia medida.
  - C-A2: Registro de explicabilidad por caso de uso.
  - C-A3: Evaluación de riesgo socio-técnico y mitigaciones.

### 3.5 ISO 14001:2015 — Ambiente

  - C-M1: Eco-score por decisión con factores de huella.
  - C-M2: Objetivos y programas ambientales con seguimiento.

### 3.6 ISO/IEC 27001:2022 — Seguridad

  - C-Sg1: Accesos por rol y segregación Publisher/Treasurer/Pauser.
  - C-Sg2: Integridad por Merkle y firmas; verificación continua.
  - C-Sg3: Gestión de incidentes y plan de respuesta.

### 3.7 ISO/IEC 25010 — Calidad de producto

  - C-Qp1: Confiabilidad y mantenibilidad (tasa de fallas, MTTR).
  - C-Qp2: Portabilidad e interoperabilidad con pruebas por release.

## 4. Evidencia y trazabilidad

  - Artifacts: artifacts/run_report.md, logs/telemetry.parquet, merkle/proof_{run_id}.json, compliance/checklist_{release}.md
  - Campos mínimos por evento: event_id, timestamp_iso, actor, inputs_hash, policy_id, outcome, eco_score, energy_kwh, guard_j_action
  - Reglas: mismo input → mismo output; cada release adjunta Merkle root al tag.

## 5. Métricas operativas

  - Latencia e2e ≤ 120 ms; WER táctil y FAR; KPI-5: 60-250 Hz
  - Energía: kWh por unidad funcional
  - Eco-score: 0-1 con umbral mínimo por dominio

## 6. Gobernanza y responsabilidades

  - Consejo AIÓN: aprueba cambios de Nivel 1 y políticas marco.
  - Roles on-chain: Publisher, Treasurer, Pauser.
  - RACI por control: ver apéndice D (RACI on-chain).

## 7. Gestión de riesgos

  - Técnicos: latencias, deriva, integridad.
  - Éticos: sesgo, opacidad, sobre-estimulación.
  - Matriz P×I + triggers del Guardián J.

## 8. Gestión de cambios

  - ADR en /adr/
  - Validación de esquema y pruebas deterministas en CI
  - Firma de release y publicación de Merkle root

## 9. Interoperabilidad (ISO/IEC 25010)

  - Contratos de integración, versiones y pruebas de regresión
  - Políticas de backward/forward compatibility

## 10. Glosario mínimo

  - inputsHash, Merkle root/proof, events_schema.json, kits soberanos, Guardián J, eco-score

## 11. Apéndices

  - A: Plantilla run_report.md
  - B: Formato proof JSON
  - C: Checklist por norma
  - D: RACI on-chain (Publisher, Treasurer, Pauser)

<!-- end list -->
