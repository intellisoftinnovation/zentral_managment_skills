# Zentral Management Skills

Skills para que un asistente de IA (Claude, u otro agente compatible con [Agent Skills](https://agentskills.io)) use correctamente el **MCP de Zentral** y gestione una empresa según su tipo de negocio.

El MCP entrega las herramientas. Estas skills enseñan **cómo y cuándo usarlas**: el orden correcto, qué verificar antes de escribir, cómo reportar y qué significa cada cosa en el rubro de la empresa.

## Cómo está organizado

Las skills se agrupan en **capas** que se combinan. Cada empresa instala el núcleo, los módulos que usa y su rubro.

| Capa | Plugin | Para qué |
| --- | --- | --- |
| Núcleo (obligatoria) | `zentral-core` | Reglas para operar el MCP con seguridad: empresa correcta, aprobaciones, idempotencia, datos no confiables, contexto de la empresa |
| Flujos por módulo | `zentral-finanzas`, … | Procedimientos de varios pasos con criterio de negocio (conciliar un extracto, pagar proveedores, cobrar…) |
| Rutinas por rol | `zentral-rutinas` | El trabajo recurrente de una persona: briefing gerencial, cierre de mes, revisión semanal de proyectos |
| Rubros | `zentral-rubro-*` | Vocabulario, KPIs y traducción del negocio a entidades de Zentral. No repite la mecánica de las otras capas |

La razón de esta división y las reglas para cada capa están en [docs/arquitectura.md](docs/arquitectura.md).

## Skills disponibles

| Plugin | Skill | Estado |
| --- | --- | --- |
| `zentral-core` | `zentral-fundamentos` | Disponible |
| `zentral-finanzas` | `conciliacion-bancaria` | Disponible |
| `zentral-rutinas` | `briefing-gerencial` | Disponible |
| `zentral-rubro-construccion` | `rubro-construccion` | Disponible |
| `zentral-rubro-servicios-profesionales` | `rubro-servicios-profesionales` | Borrador |
| `zentral-rubro-agencia-marketing` | `rubro-agencia-marketing` | Borrador |

Lo planificado está en [ROADMAP.md](ROADMAP.md).

## Instalación

### Claude Code

```bash
/plugin marketplace add intellisoftinnovation/zentral_managment_skills
/plugin install zentral-core@zentral-skills
/plugin install zentral-finanzas@zentral-skills
/plugin install zentral-rubro-construccion@zentral-skills
```

### Claude.ai / Claude Desktop

Comprime la carpeta de cada skill (la que contiene `SKILL.md`) y súbela en **Configuración → Capacidades → Skills**. Sube siempre `zentral-fundamentos` junto con las demás.

### Otros agentes

Cada carpeta `plugins/*/skills/<skill>/` sigue el formato abierto de Agent Skills (`SKILL.md` con frontmatter `name` y `description`) y se puede copiar al directorio de skills del agente.

En todos los casos el asistente necesita además la conexión al MCP de Zentral: `https://mcp.zentral.so/mcp`.

## Personalizar por empresa: la página «Perfil IA»

Las skills no adivinan el rubro ni las políticas de una empresa. Cada empresa puede crear en **Espacios** una página titulada `Perfil IA` con su rubro, glosario y reglas internas. `zentral-fundamentos` la busca y la lee antes de trabajar. Plantilla: [plugins/zentral-core/skills/zentral-fundamentos/references/perfil-ia-plantilla.md](plugins/zentral-core/skills/zentral-fundamentos/references/perfil-ia-plantilla.md).

## Contribuir

Lee [CONTRIBUTING.md](CONTRIBUTING.md). Antes de abrir un PR:

```bash
node scripts/validate.mjs
```

Este repositorio es público: no incluyas datos de clientes, montos reales, nombres de personas ni detalles internos de la plataforma.

## Licencia

[MIT](LICENSE)
