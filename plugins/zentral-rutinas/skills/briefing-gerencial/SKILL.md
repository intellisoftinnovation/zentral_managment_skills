---
name: briefing-gerencial
description: Prepara el briefing de gerencia de una empresa en Zentral, en versión semanal o diaria. Cubre caja disponible y prevista, cobranzas vencidas, pagos por vencer, resultado del mes, trabajo por facturar, proyectos en riesgo, pipeline comercial, temas de personal y avance de OKRs, con alertas y acciones sugeridas. Es de solo lectura. Úsala cuando el usuario pida «cómo va la empresa», «resumen de la semana», «briefing», «qué tengo que mirar hoy», «estado general» o un reporte para gerencia.
license: MIT
metadata:
  version: "0.1.0"
  estado: estable
  capa: rutina
---

# Briefing gerencial

Aplica primero `zentral-fundamentos`. Lee el «Perfil IA»: puede indicar en qué enfocarse, qué moneda usar o qué KPIs del rubro priorizar. Si hay una skill `rubro-*` activa, agrega sus KPIs a la sección correspondiente.

**Esta rutina no escribe nada.** Si detecta algo que hacer, lo sugiere al final y espera a que el usuario lo pida.

## Alcance

- **Semanal** (por defecto): todas las secciones, comparando con la semana o el mes anterior cuando la métrica lo permita.
- **Diario** («qué miro hoy»): solo alertas. Caja, vencidos de hoy y de esta semana, hitos que vencen y aprobaciones pendientes.
- Si el usuario tiene varias empresas, pregunta cuál o haz un briefing por empresa, nunca uno mezclado.

Omite en silencio las secciones cuyo módulo no esté disponible (`zentral_capabilities`) y menciónalas en una línea al final («Sin acceso a: RRHH»).

## Secciones y fuentes

| Sección | Fuente | Qué mirar |
| --- | --- | --- |
| **Caja** | `zentral_finance_metric` `cash_balance` y `cash_projection` (30 y 90 días) | ¿Alcanza la caja prevista para cubrir lo que se debe pagar? |
| **Cobranzas** | `zentral_finance_metric` `receivable` y `dso`; `zentral_receivables_status` con `overdue: true` | Top 5 vencidos por monto y antigüedad |
| **Pagos** | `zentral_finance_metric` `payable`; `zentral_treasury_payables_aging` | Vencidos y lo que vence en 7 días |
| **Resultado del mes** | `zentral_finance_metric` `revenue`, `expenses` y `result` | Variación frente al mes anterior (consulta ambos períodos) |
| **Por facturar** | `zentral_finance_metric` `unbilled` | Trabajo aprobado sin facturar: dinero dormido |
| **Proyectos** | `zentral_projects_list`; `zentral_projects_overview` de los activos; `zentral_milestones_list` | Hitos vencidos o que vencen en 7 días, proyectos sin avance |
| **Rentabilidad** | `zentral_finance_metric` `project_margin` (por proyecto) | Proyectos con margen negativo o en caída |
| **Comercial** | `zentral_crm_pipeline`; `zentral_crm_opportunities` | Valor por etapa y oportunidades sin actividad reciente |
| **Personas** | `zentral_hr_vacation_requests`; `zentral_hr_attendance_missing`; `zentral_hr_pending_payslip_signatures` | Pendientes que bloquean a alguien |
| **OKR** | `zentral_okr_cycles`; `zentral_okr_objectives` del ciclo activo | Objetivos en riesgo o sin check-in reciente |
| **Aprobaciones** | `zentral_treasury_requests`; `zentral_treasury_payment_proposals`; `zentral_expenses_list` | Lo que espera la firma de gerencia |

Reglas:
- Cita cada cifra con período, moneda e IGV (NET o GROSS) como indica `zentral-fundamentos`. No mezcles cifras con y sin IGV en una misma comparación.
- Recorre todas las páginas antes de dar totales o «top 5».
- No calcules métricas que `zentral_finance_metric` ya entrega. Si haces una cuenta propia (p. ej. caja prevista menos pagos), muestra la fórmula.

## Alertas

Marca como alerta (🔴) y llévalo arriba del briefing:
- Caja prevista a 30 días menor que lo que se debe pagar en ese plazo.
- Un cliente con más del 20 % de la cartera vencida, o vencidos de más de 60 días.
- Proyecto con margen negativo u hito vencido sin replanificar.
- Resultado del mes negativo, o gastos que crecen más rápido que los ingresos.
- Si el Perfil IA define otros umbrales, usa esos.

## Formato

```
# Briefing <semanal|diario> · <empresa> · <fecha>

## 🔴 Atención
- <alerta en una línea, con cifra y fuente>

## Números clave
| Indicador | Valor | Vs. anterior |
| Caja hoy | … | … |
| Caja prevista 30 d | … | |
| Te deben (vencido) | … (…) | |
| Debes (vence en 7 d) | … | |
| Resultado del mes (sin IGV) | … | … |
| Por facturar (sin IGV) | … | |

## Proyectos · Comercial · Personas · OKR
<2 a 4 viñetas por sección, solo lo que requiere decisión>

## Acciones sugeridas
1. <acción concreta> → puedo ayudarte con <skill o flujo>
```

Máximo una pantalla en el semanal y diez líneas en el diario. El usuario puede pedir el detalle de cualquier sección.

## Fuera de alcance

- Registrar, aprobar o modificar cualquier cosa.
- Datos salariales individuales.
- Proyecciones o escenarios que no salgan de las métricas de Zentral (si el usuario los pide, márcalos como estimación propia).
