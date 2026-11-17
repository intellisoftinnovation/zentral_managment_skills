# Roadmap

Estado: ✅ disponible · 📝 borrador · ⏳ pendiente

## Núcleo
- ✅ `zentral-fundamentos`

## Flujos por módulo

**zentral-finanzas**
- ✅ `conciliacion-bancaria`: extracto → importación → asociaciones/clasificación → publicación → cierre del período
- ⏳ `cuentas-por-pagar`: registrar y aprobar comprobantes de proveedores, programar vencimientos
- ⏳ `propuesta-de-pagos`: armar la propuesta semanal desde la antigüedad de CxP y enviarla a aprobación
- ⏳ `cobranzas`: priorizar vencidos, registrar cobros y aplicar a facturas
- ⏳ `gastos-y-presupuestos`: rendiciones de empleados, aprobación y control de presupuesto
- ⏳ `detracciones`: cálculo, constancia y seguimiento (Perú)

**zentral-comercial**
- ⏳ `pipeline-crm`: higiene del pipeline, siguiente acción por oportunidad, ganar/perder
- ⏳ `alta-de-cliente`: cliente + contactos + oportunidad sin duplicados

**zentral-proyectos**
- ⏳ `planificar-proyecto`: proyecto → hitos → tareas → asignaciones
- ⏳ `seguimiento-semanal-proyectos`: atrasos, hitos en riesgo, capacidad del equipo
- ⏳ `rentabilidad-de-proyectos`

**zentral-personas**
- ⏳ `asistencia-y-vacaciones`
- ⏳ `boletas-pendientes-de-firma`

**zentral-gestion**
- ⏳ `ciclo-okr`: definir objetivos, conectar métricas, check-ins
- ⏳ `actas-de-reunion`: reunión → acuerdos → tareas
- ⏳ `documentar-procesos`: escribir el proceso de la empresa en Espacios (incluye crear el «Perfil IA»)

## Rutinas por rol (`zentral-rutinas`)
- ✅ `briefing-gerencial`
- ⏳ `cierre-mensual-contador`
- ⏳ `revision-semanal-jefe-proyectos`
- ⏳ `agenda-comercial-diaria`

## Rubros
- ✅ `rubro-construccion`
- 📝 `rubro-servicios-profesionales` (estudios contables, legales, consultoría)
- 📝 `rubro-agencia-marketing`
- ⏳ Comercio, distribución y manufactura: esperan a que el MCP exponga compras e inventario

## Infraestructura
- ⏳ Evals de activación por skill (`evals/` con prompts que deben y no deben activarla)
- ⏳ Script para regenerar `scripts/zentral-tools.txt` desde el catálogo del MCP
- ⏳ Empaquetado automático de cada skill en `.zip` para Claude.ai en cada release
