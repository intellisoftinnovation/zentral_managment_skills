---
name: rubro-nombre
description: Contexto del rubro <rubro> para operar Zentral. Úsala cuando la empresa conectada sea <descripción del rubro> o el usuario use términos como <término 1>, <término 2>. Traduce el vocabulario del negocio a entidades de Zentral y define sus KPIs.
metadata:
  version: "0.1.0"
  estado: borrador
  capa: rubro
---

# Rubro: <nombre>

Aplica primero `zentral-fundamentos`. Esta skill no reemplaza a los flujos: les da el contexto del negocio.

## Cuándo aplica

Señales de que la empresa es de este rubro (Perfil IA, tipos de proyecto, vocabulario del usuario). Si no hay señales claras, pregunta antes de asumir el rubro.

## Cómo se ve este negocio en Zentral

Resumen de 5 a 10 líneas. Tabla completa en [references/mapeo-zentral.md](references/mapeo-zentral.md).

## Particularidades

Reglas del rubro que cambian cómo se aplica un flujo (tributarias, contractuales, operativas).

## Qué flujos usar

| El usuario pide… | Usa |
| --- | --- |
| … | `skill-de-flujo` |

## KPIs

Ver [references/kpis.md](references/kpis.md). Glosario en [references/glosario.md](references/glosario.md).

## Fuera de alcance

Lo que el rubro necesita y Zentral aún no cubre por MCP. Dilo al usuario en vez de improvisar.
