---
name: nombre-del-flujo
description: Qué hace este flujo en Zentral y cuándo usarlo. Incluye frases que el usuario diría (p. ej. «paga a los proveedores de esta semana», «arma la propuesta de pagos»). Máximo 1024 caracteres.
metadata:
  version: "0.1.0"
  estado: borrador
  capa: flujo
---

# Nombre del flujo

Aplica primero `zentral-fundamentos` (empresa, Perfil IA, capacidades, aprobaciones).

## Resultado esperado

Una frase: qué queda hecho cuando el flujo termina (p. ej. «propuesta de pago enviada a revisión»).

## Antes de empezar

- Datos que hay que tener o pedir al usuario.
- Proceso de la empresa a buscar en Espacios (término de búsqueda sugerido).

## Pasos

1. **Consulta** … (`zentral_…`). Qué mirar en la respuesta.
2. **Punto de control**: qué confirmar con el usuario antes de escribir.
3. **Propuesta** … (`zentral_…`). Qué pasa después de aprobar.
4. **Verificación**: qué consultar para comprobar el resultado.

## Casos que no cuadran

- Situación → qué hacer (preguntar, detenerse, alternativa).

## Cómo reportar

Formato del resumen final para el usuario.

## Fuera de alcance

Lo que este flujo no hace.
