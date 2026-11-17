---
name: rubro-construccion
description: Contexto del rubro construcción e ingeniería para operar Zentral en Perú. Úsala cuando la empresa conectada sea una constructora, contratista o empresa de ingeniería, o cuando el usuario hable de obras, valorizaciones, metrados, residente de obra, subcontratistas, adelantos de obra, fondo de garantía o detracciones de construcción. Traduce esos conceptos a proyectos, hitos, proveedores y tesorería de Zentral y define los KPIs por obra.
license: MIT
metadata:
  version: "0.1.0"
  estado: estable
  capa: rubro
---

# Rubro: construcción e ingeniería

Aplica primero `zentral-fundamentos`. Esta skill da el contexto del negocio. Los procedimientos los ponen los flujos (p. ej. `conciliacion-bancaria`).

## Cuándo aplica

- El «Perfil IA» indica construcción o ingeniería.
- `zentral_projects_types` tiene tipos como «Obra», o el usuario usa el vocabulario del [glosario](references/glosario.md).
- Si solo hay una señal débil, pregunta antes de tratar a la empresa como constructora.

## Cómo se ve una constructora en Zentral

- Cada **obra** es un **proyecto**. Todo lo que cuesta o cobra la obra debe llevar su `projectId`; si no, la rentabilidad por obra es incorrecta.
- Cada **valorización** (normalmente mensual) es un **hito** del proyecto. Su fecha objetivo es el cierre del período, sus entregables son la planilla de metrados, el informe y el sustento, y su criterio de aceptación es «aprobada por la supervisión o el cliente».
- Los **subcontratistas** y **proveedores de materiales** son **proveedores** de tesorería. Sus facturas son comprobantes de proveedor y sus adelantos son anticipos que se amortizan.
- La **entidad contratante** es un **cliente**. Una **licitación o cotización en curso** es una **oportunidad** del CRM.

Tabla completa: [references/mapeo-zentral.md](references/mapeo-zentral.md).

## Particularidades del rubro

1. **Detracciones.** Los contratos de construcción suelen estar sujetos al SPOT. El código y el porcentaje típicos son el 030 y el 4 %, pero **verifica siempre** con `zentral_treasury_detraction_catalog` y `zentral_treasury_detraction_preview` para la fecha de la operación. No los des por sentados. En la conciliación, el depósito del cliente en la cuenta de detracciones del Banco de la Nación es parte del cobro de la factura: no lo trates como un ingreso aparte.
2. **El cobro de una valorización llega neto.** Del monto facturado se descuentan detracción, amortización de adelantos y retención del fondo de garantía. Al asociar el cobro a la factura, explica al usuario cada diferencia. No la absorbas como ajuste genérico sin justificación.
3. **Adelantos del cliente** (directo y de materiales). Se amortizan en cada valorización. Por MCP no hay una herramienta específica para modelarlos. Registra lo que el proceso de la empresa indique y deja constancia en el hito de cada valorización.
4. **Fondo de garantía.** El cliente retiene un porcentaje que se devuelve al final de la obra. Es un monto por cobrar a largo plazo: menciónalo aparte en cobranzas y no lo cuentes como vencido.
5. **Anticipos a subcontratistas.** Revisa `zentral_treasury_supplier_advances` antes de registrar o pagar una factura de subcontratista: puede haber un anticipo por aplicar (`zentral_treasury_apply_advance`).
6. **Obras en otra moneda.** Contratos en USD con costos en PEN: presenta el margen en una sola moneda pedida con `zentral_finance_metric` y no conviertas por tu cuenta.

## Qué flujo usar

| El usuario pide… | Usa |
| --- | --- |
| «Concilia el banco», incluidos depósitos de detracción | `conciliacion-bancaria` con las reglas 1 y 2 de arriba |
| «Cómo van las obras», «briefing» | `briefing-gerencial`, agregando los KPIs de obra de [references/kpis.md](references/kpis.md) |
| «Arma el cronograma de valorizaciones de la obra X» | Secuencia de planificación en [references/mapeo-zentral.md](references/mapeo-zentral.md#planificar-una-obra) |
| «Cuánto gana la obra X» | `zentral_finance_metric` `project_margin` con `projectId` y `zentral_projects_profitability` |
| «Qué le debemos al subcontratista Y» | `zentral_treasury_supplier_statement` y `zentral_treasury_supplier_advances` |

## Fuera de alcance por MCP

- **Emitir facturas** de valorización: se hace en la interfaz de Zentral.
- **Metrados, presupuesto de obra por partidas y APU**: Zentral no los modela. El usuario los adjunta como documentos del proyecto.
- **Planilla de construcción civil**: la nómina es de solo lectura por MCP.
- **Almacén de obra e inventario de materiales**: no disponible por MCP todavía.

Cuando el usuario pida algo de esta lista, dilo y sugiere el camino en la interfaz de Zentral. No lo simules con otras entidades.
