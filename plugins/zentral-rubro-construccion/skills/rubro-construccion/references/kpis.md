# KPIs: construcción e ingeniería

Úsalos en `briefing-gerencial` (sección Proyectos y Rentabilidad) o cuando el usuario pregunte por una obra.

| KPI | Pregunta | Cómo se obtiene | Frecuencia |
| --- | --- | --- | --- |
| Margen por obra | ¿La obra gana plata? | `zentral_finance_metric` `project_margin` con `projectId` | Semanal |
| Valorizaciones atrasadas | ¿Qué avance no se está cobrando por falta de aprobación? | `zentral_milestones_list`: hitos de valorización vencidos sin aprobar | Semanal |
| Valorizado sin facturar | ¿Cuánto trabajo aprobado falta facturar? | `zentral_finance_metric` `unbilled` | Semanal |
| Facturado sin cobrar por obra | ¿Qué cliente o entidad está atrasado? | `zentral_receivables_status` por cliente, separando el fondo de garantía | Semanal |
| Días en cobrar (DSO) | ¿Cuánto tarda en pagar el cliente? | `zentral_finance_metric` `dso` | Mensual |
| Deuda con subcontratistas | ¿Cuánto debemos y qué está vencido? | `zentral_treasury_payables_aging` y `zentral_treasury_supplier_statement` | Semanal |
| Anticipos por amortizar | ¿Cuánto adelantamos a subcontratistas sin documentar? | `zentral_treasury_supplier_advances` | Mensual |
| Detracciones pendientes | ¿Qué depósitos de detracción faltan registrar o sustentar? | `zentral_treasury_detractions` | Mensual |
| Caja vs. compromisos de obra | ¿La caja cubre los pagos de las obras? | `zentral_finance_metric` `cash_projection` frente a `payable` | Semanal |

Alertas propias del rubro:
- Valorización con más de 15 días de atraso en la aprobación: el financiamiento de la obra lo pone la constructora.
- Obra con margen menor que el del contrato o negativo.
- Subcontratista con anticipo sin amortizar y nueva factura por pagar.
