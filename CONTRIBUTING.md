# Contribuir

## Antes de escribir una skill

1. Decide la capa (ver [docs/arquitectura.md](docs/arquitectura.md)). Si dudas entre «flujo» y «rubro», pregúntate si el procedimiento cambia según el negocio. Si no cambia, es un flujo.
2. Revisa que no exista ya en otra capa. Una skill de rubro nunca reescribe un flujo; lo referencia.
3. Copia la plantilla de `templates/` correspondiente.

## Qué debe tener una buena skill

- **Descripción que dispare bien**: verbos y frases que el usuario realmente diría («concilia el extracto de BCP de octubre»), no solo el nombre técnico.
- **Puntos de control explícitos** antes de cada escritura: qué confirmar con el usuario y qué verificar con una consulta.
- **Criterio, no esquemas**: el MCP ya documenta parámetros. La skill explica cuándo usar cada tool, en qué orden y qué hacer si algo no cuadra.
- **Formato de reporte**: cómo presentar el resultado al usuario (qué se leyó, qué se propuso, qué quedó pendiente).
- **Fuera de alcance**: lo que la skill no hace, para que el agente no improvise.

## Probar

1. `node scripts/validate.mjs` (frontmatter, nombres, tools citadas, marketplace).
2. Prueba manual con un cliente conectado al MCP en una empresa de pruebas. Anota en el PR los prompts usados y qué hizo el agente.
3. Comprueba que la skill se activa con 2 o 3 frases naturales y que **no** se activa con pedidos de otro tema.

## Publicar

- Cambia `metadata.estado` a `estable` y agrega el plugin a `.claude-plugin/marketplace.json`.
- Sube `version` en el `plugin.json` del plugin (semver: un cambio de comportamiento sube el minor).

## Privacidad

Repositorio público. Nada de datos de clientes, RUC reales, montos reales, nombres de personas, URLs internas ni detalles de seguridad de la plataforma. Los ejemplos usan datos ficticios.
