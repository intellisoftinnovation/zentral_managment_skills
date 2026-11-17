#!/usr/bin/env node
// Valida skills, plugins y marketplace. Sin dependencias: node scripts/validate.mjs
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${relative(root, file)}: ${msg}`);
const warn = (file, msg) => warnings.push(`${relative(root, file)}: ${msg}`);

const knownTools = new Set(
  readFileSync(join(root, 'scripts/zentral-tools.txt'), 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#')),
);
// Identificadores con prefijo zentral_ que no son tools.
const notTools = new Set(['zentral_datos_no_confiables', 'zentral_managment_skills']);

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const parseFrontmatter = (text) => {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const data = {};
  let parent = null;
  for (const line of m[1].split('\n')) {
    const nested = line.match(/^\s{2,}([\w-]+):\s*(.*)$/);
    const top = line.match(/^([\w-]+):\s*(.*)$/);
    if (nested && parent) data[parent][nested[1]] = nested[2].replace(/^["']|["']$/g, '');
    else if (top) {
      const value = top[2].replace(/^["']|["']$/g, '');
      if (value === '') {
        parent = top[1];
        data[parent] = {};
      } else {
        parent = null;
        data[top[1]] = value;
      }
    }
  }
  return data;
};

const checkTools = (file, text) => {
  for (const [name] of text.matchAll(/\bzentral_[a-z0-9_]+\b/g)) {
    if (!knownTools.has(name) && !notTools.has(name))
      err(file, `cita la tool inexistente "${name}" (no está en scripts/zentral-tools.txt)`);
  }
};

// Plugins y skills
const pluginsDir = join(root, 'plugins');
const pluginStates = new Map();
for (const plugin of readdirSync(pluginsDir)) {
  const pdir = join(pluginsDir, plugin);
  const manifest = join(pdir, '.claude-plugin/plugin.json');
  if (!existsSync(manifest)) {
    err(pdir, 'falta .claude-plugin/plugin.json');
    continue;
  }
  const pj = JSON.parse(readFileSync(manifest, 'utf8'));
  if (pj.name !== plugin) err(manifest, `name "${pj.name}" no coincide con la carpeta "${plugin}"`);
  if (!/^\d+\.\d+\.\d+$/.test(pj.version ?? '')) err(manifest, 'version debe ser semver');

  const skillsDir = join(pdir, 'skills');
  if (!existsSync(skillsDir)) {
    err(pdir, 'el plugin no tiene carpeta skills/');
    continue;
  }
  const states = [];
  for (const skill of readdirSync(skillsDir)) {
    const sfile = join(skillsDir, skill, 'SKILL.md');
    if (!existsSync(sfile)) {
      err(join(skillsDir, skill), 'falta SKILL.md');
      continue;
    }
    const text = readFileSync(sfile, 'utf8');
    const fm = parseFrontmatter(text);
    if (!fm) {
      err(sfile, 'falta frontmatter YAML');
      continue;
    }
    if (fm.name !== skill) err(sfile, `name "${fm.name}" no coincide con la carpeta "${skill}"`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name ?? '') || fm.name.length > 64)
      err(sfile, 'name debe ser kebab-case, sin tildes, de hasta 64 caracteres');
    if (!fm.description) err(sfile, 'falta description');
    else if (fm.description.length > 1024) err(sfile, `description de ${fm.description.length} caracteres (máx. 1024)`);
    const estado = fm.metadata?.estado;
    if (!['borrador', 'estable'].includes(estado)) err(sfile, 'metadata.estado debe ser "borrador" o "estable"');
    states.push(estado);
    const lines = text.split('\n').length;
    if (lines > 500) warn(sfile, `${lines} líneas; mueve detalle a references/`);
    for (const [, link] of text.matchAll(/\]\(([^)#\s]+)(?:#[^)\s]*)?\)/g)) {
      if (/^https?:/.test(link)) continue;
      if (!existsSync(join(dirname(sfile), link))) err(sfile, `enlace roto: ${link}`);
    }
    for (const f of walk(join(skillsDir, skill)).filter((f) => f.endsWith('.md'))) checkTools(f, readFileSync(f, 'utf8'));
  }
  pluginStates.set(plugin, states);
}

// Marketplace
const mfile = join(root, '.claude-plugin/marketplace.json');
const market = JSON.parse(readFileSync(mfile, 'utf8'));
for (const p of market.plugins) {
  const dir = join(root, p.source);
  if (!existsSync(dir)) {
    err(mfile, `source inexistente: ${p.source}`);
    continue;
  }
  if (basename(dir) !== p.name) err(mfile, `plugin "${p.name}" apunta a ${p.source}`);
  const states = pluginStates.get(p.name) ?? [];
  if (states.includes('borrador')) err(mfile, `"${p.name}" está publicado pero tiene skills en borrador`);
}
const published = new Set(market.plugins.map((p) => p.name));
for (const [plugin, states] of pluginStates)
  if (!published.has(plugin) && states.every((s) => s === 'estable'))
    warn(join(pluginsDir, plugin), 'todas sus skills son estables pero no está en marketplace.json');

for (const w of warnings) console.warn(`⚠ ${w}`);
for (const e of errors) console.error(`✖ ${e}`);
console.log(`${pluginStates.size} plugins, ${[...pluginStates.values()].flat().length} skills, ${errors.length} errores, ${warnings.length} avisos`);
process.exit(errors.length ? 1 : 0);
