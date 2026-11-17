---
name: conciliacion-bancaria
description: Concilia un estado de cuenta bancario en Zentral de principio a fin. Valida e importa el extracto, asocia cada movimiento a facturas, comprobantes de proveedor o gastos (o lo clasifica), lo publica y cierra el período de conciliación. Úsala cuando el usuario comparta un extracto (PDF, CSV, XLSX o captura) o pida «concilia el banco», «sube el estado de cuenta», «cuadra la cuenta de octubre», «qué movimientos faltan publicar» o «cierra la conciliación».
metadata:
  version: "0.1.0"
  estado: estable
  capa: flujo
---

# Conciliación bancaria

Aplica primero `zentral-fundamentos`. Busca en Espacios el proceso de la empresa (`"conciliación"`) y respeta sus reglas, por ejemplo quién clasifica o qué categorías usar.

## Resultado esperado

Los movimientos del extracto están en Zentral, cada uno asociado o clasificado y publicado, y el período de la cuenta queda cerrado con el saldo del banco. Cada escritura es una propuesta que el usuario aprueba por separado. **Nada se publica automáticamente.**

## Paso 1. Identificar empresa y cuenta

1. Extrae del documento: banco, moneda, últimos 4 dígitos, RUC del titular, período, saldo inicial y final.
2. Cruza con `zentral_list_companies` y `zentral_list_bank_accounts` (filtra con `buscar` por banco).
3. Si dos cuentas comparten banco y moneda y el extracto no permite distinguirlas, **pregunta**. Usa el `chartId` de la cuenta como `accountId`.

## Paso 2. Convertir y validar el extracto

1. Convierte cada fila a `{date: YYYY-MM-DD, description, reference?, incomeAmount, expenseAmount}`. Los importes van con 2 decimales como máximo y el lado que no aplica va en `0`. No inventes filas ni corrijas montos.
2. Divide en lotes de 100 filas como máximo.
3. Llama a `zentral_treasury_preview_statement` por lote. Muestra al usuario errores y posibles duplicados **antes** de importar.
4. Verifica que la suma de ingresos menos egresos coincida con la diferencia entre saldo final e inicial del extracto. Si no cuadra, falta o sobra una fila: revísalo con el usuario.

## Paso 3. Importar (propuesta)

- `zentral_treasury_import_statement` por lote, con una `idempotency_key` por lote (p. ej. `import-<banco>-<moneda>-<aaaa-mm>-lote<n>`).
- Los movimientos quedan `UNPUBLISHED`. Los posibles duplicados se crean igual, marcados `needsReview`.
- Entrega los enlaces de aprobación y espera. Tras la aprobación, confirma con `zentral_get_operation`.

## Paso 4. Resolver cada movimiento pendiente

Lista los pendientes con `zentral_treasury_bank_movements` (`feedTab: "pendiente"`, `accountId`) y recorre todas las páginas. Empieza por los que tienen `needsReview`.

| Situación | Acción |
| --- | --- |
| Posible duplicado confirmado | Propón `zentral_treasury_exclude_movement` |
| Cobro de cliente o pago a proveedor | `zentral_treasury_association_candidates` (todas las páginas, `side` correcto) → revisa el documento (`zentral_invoice_detail`, `zentral_treasury_supplier_expense_detail`) → propón `zentral_treasury_set_associations` |
| Pago parcial o varias facturas en un abono | Una asociación por documento, con `amountApplied` de cada una. La suma debe igualar el movimiento o la diferencia va en `adjustment` |
| Comisión o ITF del banco dentro de un pago | `adjustment` con `differenceKind: "BANK_FEE"` |
| Gasto sin documento (comisión suelta, impuesto, servicio) | `zentral_treasury_classify_movement` con categoría y, si aplica, proveedor y proyecto |
| Anticipo a proveedor | Asociación `SUPPLIER_ADVANCE` (`ANTICIPO` o `POR_DOCUMENTAR`) |
| Cambio de moneda entre cuentas propias | No lo asocies a documentos. Usa el flujo de `zentral_treasury_create_currency_exchange` y confírmalo con el usuario |
| No sabes qué es | **Pregunta.** No clasifiques por intuición |

Reglas de asociación:
- Las sugerencias de `association_candidates` explican coincidencias de importe y referencia, pero **siempre** requieren tu revisión y la del usuario. No asocies solo porque el importe coincide si cliente o proveedor no concuerdan.
- `set_associations` **reemplaza** todas las asociaciones del movimiento. Lee antes `zentral_treasury_movement_detail` y conserva las que deban quedar.
- Si asignas un proyecto al clasificar, la rentabilidad del proyecto lo refleja: usa el proyecto correcto o ninguno.

Presenta las propuestas agrupadas en una tabla (fecha, descripción, importe, acción propuesta, documento o categoría) con sus enlaces de aprobación.

## Paso 5. Publicar (propuesta)

Cuando las asociaciones y clasificaciones estén aprobadas, propón `zentral_treasury_publish_movement` por cada movimiento listo. Publicar **contabiliza** asientos y aplicaciones. Si hace falta corregir algo ya publicado, revísalo con `zentral_treasury_last_action` y `zentral_treasury_revert_action` y confírmalo con el usuario antes de proponer la reversión.

## Paso 6. Cerrar el período

1. `zentral_treasury_reconciliation_summary` con `periodStart`, `periodEnd` y **siempre** `statementClosingBalance` del extracto. Si la respuesta dice `statementBalanceSource: ASSUMED`, eso no acredita la conciliación.
2. Revisa las partidas pendientes y la diferencia con el usuario.
3. Busca un período existente con `zentral_treasury_reconciliation_periods`. Si no hay, propón `zentral_treasury_reconciliation_create` con saldos inicial y final del extracto.
4. Propón `zentral_treasury_reconciliation_close`. Si queda diferencia, exige que el usuario dé la justificación y envía `acceptDifference: true` con `notes`. **Nunca** aceptes una diferencia por tu cuenta.

El cierre es un control contable. **No** es requisito para pagar ni bloquea pagos.

## Cómo reportar

```
Empresa: <nombre> · Cuenta: <banco> <moneda> ****<últimos 4> · Período: <desde>–<hasta>
Extracto: <n> movimientos · Ingresos <x> · Egresos <y> · Saldo final banco <z>
Propuestas pendientes de aprobación:
  - Importación lote 1 (<n> filas): <approval_url>
  - Asociaciones (<n>): <approval_url>…
Sin resolver (necesitan tu respuesta): <lista con fecha, descripción e importe>
Diferencia de conciliación: <monto> (<explicación>)
```

## Fuera de alcance

- Enviar transferencias al banco: Zentral registra pagos ya realizados, no los ejecuta.
- Exportaciones, configuración contable y configuración de reglas de conciliación (siguen en la interfaz de Zentral).
- Asociaciones con planilla o sueldos: no se operan por MCP.
