# Arquitectura de las skills

## Por qué capas y no solo rubros

Si cada rubro tuviera su propia skill completa, todas repetirían lo mismo: elegir la empresa, pedir aprobación, conciliar un extracto. Cuando el MCP cambie habría que corregir N copias. Por eso el conocimiento se separa según **qué tan seguido cambia** y **de quién depende**:

```
                ┌──────────────────────────────────────┐
  Rubro         │ construcción · servicios · agencia … │  qué significa el negocio
                └──────────────────┬───────────────────┘
                ┌──────────────────┴───────────────────┐
  Rutina (rol)  │ briefing · cierre de mes · semanal … │  qué hace una persona cada semana
                └──────────────────┬───────────────────┘
                ┌──────────────────┴───────────────────┐
  Flujo módulo  │ conciliación · pagos · cobranza …    │  cómo se hace bien una tarea
                └──────────────────┬───────────────────┘
                ┌──────────────────┴───────────────────┐
  Núcleo        │ zentral-fundamentos                  │  cómo se opera el MCP
                └──────────────────────────────────────┘
                              MCP de Zentral
```

Cada capa solo puede apoyarse en las de abajo. Una skill de rubro dice «la valorización se registra como hito; para cobrarla sigue `conciliacion-bancaria`», pero no vuelve a explicar cómo conciliar.

## Reglas por capa

### Núcleo (`zentral-core`)
- Una sola skill, `zentral-fundamentos`, siempre instalada.
- Contiene solo reglas válidas para cualquier empresa y cualquier módulo.
- Las demás skills empiezan con: «Aplica primero `zentral-fundamentos`».

### Flujos por módulo (`zentral-<modulo>`)
- Un flujo de varios pasos con un resultado claro (un período conciliado, una propuesta de pago enviada).
- Describe el **orden**, los **puntos de control** (qué verificar o preguntar antes de cada escritura) y **cómo reportar**.
- No copia los esquemas de las tools: el MCP ya los entrega. Cita la tool por nombre y explica el criterio.
- Un plugin por área funcional de Zentral: finanzas, comercial, proyectos, personas, gestión (OKR, reuniones, espacios).

### Rutinas por rol (`zentral-rutinas`)
- Tareas recurrentes que combinan varios módulos para una persona: gerente, contador, jefe de proyectos, comercial, RRHH.
- Por defecto son de **solo lectura**. Si proponen acciones, las listan y esperan que el usuario las pida.
- Leen el «Perfil IA» para ajustar KPIs y vocabulario al rubro.

### Rubros (`zentral-rubro-<rubro>`)
- Capa delgada: glosario, mapeo del negocio a entidades de Zentral, KPIs y particularidades (tributarias, contractuales).
- Estructura fija: `SKILL.md` breve + `references/glosario.md`, `references/mapeo-zentral.md`, `references/kpis.md`.
- Solo rubros donde Zentral ya cubre la operación. Hoy el MCP cubre bien servicios por proyecto, finanzas, CRM y RRHH. Todavía no expone compras ni inventario, así que los rubros de comercio o manufactura esperan.

## Dimensión país

Hoy todo el contenido asume **Perú** (SUNAT, IGV, detracciones), igual que Zentral. Si Zentral se expande, las particularidades tributarias se moverán a un plugin `zentral-pais-<pais>` y los rubros lo referenciarán, en vez de repetirlas.

## Personalización por empresa: «Perfil IA»

El repositorio es genérico. Lo específico de cada empresa vive en Zentral, en una página de Espacios titulada `Perfil IA`. `zentral-fundamentos` la busca al empezar. Así una empresa ajusta el comportamiento sin tocar el repositorio y sin que sus datos salgan de Zentral.

## Convenciones

- Contenido en español neutro; nombres de carpetas y skills en `kebab-case` sin tildes.
- `name` del frontmatter = nombre de la carpeta; máximo 64 caracteres.
- `description` en tercera persona, dice **qué hace y cuándo usarla** (es lo que el agente lee para decidir si la carga); máximo 1024 caracteres.
- `SKILL.md` de menos de 500 líneas; el detalle va en `references/` y se enlaza desde el cuerpo.
- `metadata.estado`: `borrador` o `estable`. Solo las estables entran en `.claude-plugin/marketplace.json`.
- Las tools se citan por su nombre corto (`zentral_list_companies`). `scripts/validate.mjs` verifica que existan en `scripts/zentral-tools.txt`.
