---
name: rubro-agencia-marketing
description: Contexto del rubro agencia de marketing, publicidad o comunicación para operar Zentral. Úsala cuando la empresa conectada sea una agencia, o cuando el usuario hable de fee mensual, retainer, campañas, piezas, pauta, brief, cuentas o ejecutivos de cuenta. Traduce esos conceptos a clientes, proyectos, hitos, tareas y gastos de Zentral.
license: MIT
metadata:
  version: "0.1.0"
  estado: borrador
  capa: rubro
---

# Rubro: agencia de marketing

> **Borrador.** Falta validar el mapeo con empresas reales y escribir `references/`.

Aplica primero `zentral-fundamentos`.

## Cómo se ve este negocio en Zentral (propuesta)

| Concepto | En Zentral | Notas por validar |
| --- | --- | --- |
| Cuenta (cliente) | Cliente | |
| Fee mensual / retainer | Proyecto continuo por cliente con cobro recurrente | ¿Un proyecto por cliente o por año? |
| Campaña | Proyecto, o hito dentro del proyecto del cliente | Depende de si se factura aparte |
| Pieza o entregable | Tarea o subtarea | Estados: brief → producción → revisión cliente → aprobada |
| Brief | Documento del proyecto (Drive) o página de Espacios | |
| Pauta (inversión en medios del cliente) | Comprobante de proveedor con proyecto | Separar pauta de fee al medir margen |
| Ejecutivo de cuenta | Responsable del proyecto | |
| Freelancers | Proveedores o honorarios | |
| Nueva cuenta en negociación | Oportunidad CRM | |

## KPIs candidatos

- Margen por cuenta **sin pauta** (`zentral_finance_metric` `project_margin`; requiere separar la pauta).
- Ocupación del equipo creativo (`zentral_capacity_utilization`).
- Piezas atrasadas por cliente (`zentral_tasks_list`).
- Pipeline de nuevas cuentas (`zentral_crm_pipeline`).
- Cobranza de fees (`zentral_receivables_status`).

## Pendiente

- Definir cómo se separa la pauta del fee en Zentral (categoría, proyecto aparte o tipo de gasto).
- Escribir `references/glosario.md`, `references/mapeo-zentral.md` y `references/kpis.md`.
