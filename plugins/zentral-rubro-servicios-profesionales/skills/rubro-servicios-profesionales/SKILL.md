---
name: rubro-servicios-profesionales
description: Contexto del rubro servicios profesionales (estudios contables, estudios legales, consultoras) para operar Zentral. Úsala cuando la empresa conectada preste servicios por iguala, por encargo o por horas, o cuando el usuario hable de cartera de clientes, igualas mensuales, honorarios, encargos, expedientes o casos. Traduce esos conceptos a clientes, proyectos, cobros recurrentes y tareas de Zentral.
license: MIT
metadata:
  version: "0.1.0"
  estado: borrador
  capa: rubro
---

# Rubro: servicios profesionales

> **Borrador.** Falta validar el mapeo con empresas reales y escribir `references/`.

Aplica primero `zentral-fundamentos`.

## Cómo se ve este negocio en Zentral (propuesta)

| Concepto | En Zentral | Notas por validar |
| --- | --- | --- |
| Cliente de cartera | Cliente | |
| Iguala mensual | Cobro recurrente esperado del cliente | ¿Proyecto continuo por cliente o un proyecto por año? |
| Encargo o caso puntual | Proyecto | Hitos = entregables o etapas procesales |
| Vencimientos del cliente (declaraciones, plazos legales) | Tareas con fecha | Un calendario mensual por cliente |
| Horas del equipo | Horas por proyecto | `zentral_time_my_project_hours` solo da las propias; la vista del equipo va por `zentral_capacity_utilization` |
| Socio responsable | Responsable del proyecto | |
| Recibos por honorarios de colaboradores | Honorarios | `zentral_payroll_honorarios` (solo lectura) |

## KPIs candidatos

- Cobranza de igualas: vencidos por cliente (`zentral_receivables_status`).
- Rentabilidad por cliente o encargo (`zentral_finance_metric` `project_margin`).
- Ocupación del equipo (`zentral_capacity_utilization`).
- Vencimientos de clientes de la semana sin tarea cerrada (`zentral_tasks_list`).

## Pendiente

- Decidir el modelo de iguala (proyecto continuo vs. proyecto anual).
- Escribir `references/glosario.md`, `references/mapeo-zentral.md` y `references/kpis.md`.
- Particularidades: retenciones de 4.ª categoría y suspensión de retenciones de colaboradores.
