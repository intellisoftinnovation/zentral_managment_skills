# Mantenimiento

## Mantener sincronizado el catálogo de tools

`scripts/zentral-tools.txt` lista las herramientas que publica el MCP de Zentral. `scripts/validate.mjs` falla si una skill cita una tool que no está en la lista, para que un cambio de nombre en el MCP no deje skills apuntando a herramientas inexistentes.

Cuando el MCP agregue, renombre o retire herramientas:

1. Obtén la lista actual con un cliente MCP conectado (petición `tools/list` a `https://mcp.zentral.so/mcp`), o desde el catálogo explícito del servidor.
2. Reemplaza los nombres en `scripts/zentral-tools.txt`, una por línea y en orden alfabético.
3. Ejecuta `node scripts/validate.mjs` y corrige las skills que citen tools retiradas.
4. Si una tool cambió de comportamiento (p. ej. pasó de «EJECUTA» a «PROPONE»), revisa las skills que la usan, aunque el validador pase.

## Versionado

- Cada plugin tiene su `version` en `.claude-plugin/plugin.json` y en `.claude-plugin/marketplace.json`. Mantén ambas iguales.
- Patch: redacción o correcciones menores. Minor: cambia lo que hace el agente. Major: cambia de qué depende la skill (otra skill o módulo del MCP).
