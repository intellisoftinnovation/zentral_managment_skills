# Mapeo a Zentral: construcción e ingeniería

| Concepto | Entidad de Zentral | Tools principales | Notas |
| --- | --- | --- | --- |
| Entidad contratante | Cliente | `zentral_clients_list`, `zentral_clients_detail` | Buscar antes de crear: evitar duplicados por razón social |
| Licitación / cotización | Oportunidad CRM | `zentral_crm_opportunities`, `zentral_crm_move_stage`, `zentral_crm_win_opportunity` | Ganar la oportunidad requiere aprobación |
| Obra | Proyecto | `zentral_projects_list`, `zentral_projects_detail`, `zentral_projects_types` | Un proyecto por contrato |
| Equipo de obra | Miembros del proyecto | `zentral_projects_members`, `zentral_projects_assignable_people` | Residente como responsable de los hitos |
| Cronograma | Hitos y calendario | `zentral_projects_schedule`, `zentral_milestones_list` | |
| Valorización | Hito | `zentral_milestones_create`, `zentral_milestones_update`, `zentral_milestones_set_state`, `zentral_milestones_workflow` | Ver sección siguiente |
| Actividades de campo | Tareas y subtareas | `zentral_tasks_create`, `zentral_subtasks_create` | Vinculadas al proyecto |
| Expediente, actas, metrados | Documentos | `zentral_projects_documents`, `zentral_projects_link_document`, `zentral_drive_upload` | |
| Subcontratista / proveedor | Proveedor | `zentral_treasury_suppliers`, `zentral_treasury_supplier_detail` | |
| Factura de subcontratista | Comprobante de proveedor | `zentral_treasury_supplier_expenses`, `zentral_treasury_create_supplier_expense` | Siempre con el proyecto de la obra |
| Anticipo a subcontratista | Anticipo de proveedor | `zentral_treasury_supplier_advances`, `zentral_treasury_apply_advance` | |
| Gastos de obra sin comprobante | Movimiento clasificado | `zentral_treasury_classify_movement` (`projectId`) | |
| Caja chica de obra | Gastos de empleados | `zentral_expenses_list`, `zentral_expenses_create` | |
| Facturación de valorización | Factura | `zentral_search_invoices`, `zentral_invoice_detail` | Emisión en la interfaz de Zentral |
| Cobro de valorización | Cobro asociado a factura | `zentral_receivables_status`, flujo `conciliacion-bancaria` | Llega neto: detracción, adelantos, garantía |
| Detracción | Detracción | `zentral_treasury_detraction_catalog`, `zentral_treasury_detraction_preview`, `zentral_treasury_detractions`, `zentral_treasury_register_detraction_constancy` | Verificar código y tasa por fecha |
| Rentabilidad por obra | Métrica de proyecto | `zentral_finance_metric` (`project_margin`), `zentral_projects_profitability` | |

## Planificar una obra

Secuencia mientras no exista el flujo `planificar-proyecto`:

1. Confirma que la obra existe (`zentral_projects_list`). Si no existe, pregunta si crearla. La creación usa `zentral_projects_create`; revisa si requiere aprobación.
2. Revisa el equipo con `zentral_projects_members` y `zentral_projects_assignable_people` y pide al usuario quién es el residente.
3. Pide el cronograma de valorizaciones: períodos, fecha de corte y monto programado de cada una.
4. Presenta la tabla de hitos propuesta y espera confirmación.
5. Crea un hito por valorización con `zentral_milestones_create`:
   - `name`: «Valorización N.º <n> – <mes aaaa>»
   - `targetDate`: fecha de corte del período
   - `acceptanceCriteria`: «Aprobada por la supervisión. Monto programado: <monto>. Amortización de adelanto: <monto o porcentaje>.»
   - `expectedDeliverables`: planilla de metrados, informe de avance, panel fotográfico
   - `responsibleUserId`: el residente
   - `idempotency_key`: `obra-<projectId>-valorizacion-<n>`
6. Reporta los hitos creados con sus fechas.
