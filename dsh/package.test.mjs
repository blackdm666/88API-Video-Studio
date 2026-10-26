// Checks that every client manifest ships the one shared skill folder and shows
// the same title, description, icon and version. The DSH entry itself needs DSH's
// built-in packages, so it is tested inside DSH.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const json = (path) => JSON.parse(read(path))
const pkg = json('package.json')
const codex = json('plugins/seedance-studio/.codex-plugin/plugin.json')
const claude = json('plugins/seedance-studio/.claude-plugin/plugin.json')
const entry = json('.claude-plugin/marketplace.json').plugins[0]

test('every manifest carries the same version', () => {
  assert.equal(codex.version, pkg.version)
  assert.equal(claude.version, pkg.version)
  assert.match(read('plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs'), new RegExp(`PLUGIN_VERSION = "${pkg.version.replace(/\./g, '\\.')}"`))
  assert.match(read('CHANGELOG.md'), new RegExp(`^## ${pkg.version.replace(/\./g, '\\.')} `, 'm'))
})

test('every client shows the same title, description and icon', () => {
  const locale = json('locale/en.json').meta
  const descriptions = [pkg.description, locale.description, claude.description, entry.description, codex.description, codex.interface.shortDescription]
  assert.deepEqual(new Set(descriptions), new Set([pkg.description]))
  const titles = [locale.title, claude.displayName, entry.displayName, codex.interface.displayName, json('.agents/plugins/marketplace.json').interface.displayName]
  assert.deepEqual(new Set(titles), new Set(['88API-Video-Studio']))
  const icon = readFileSync(`${root}/${pkg.icon}`)
  assert.ok(icon.length <= 256 * 1024, 'DSH rejects icons over 256 KiB')
  assert.ok(icon.equals(readFileSync(`${root}/plugins/seedance-studio/${codex.interface.logo}`)))
  assert.ok(icon.equals(readFileSync(`${root}/plugins/seedance-studio/${claude.icon}`)))
  // ZCode only shows an https icon from the marketplace entry.
  assert.equal(entry.icon, `https://raw.githubusercontent.com/blackdm666/88API-Video-Studio/main/${pkg.icon}`)
})

test('the plugin id and marketplace name stay the same for existing installs', () => {
  for (const id of [pkg.name, codex.name, claude.name, entry.name]) assert.equal(id, 'seedance-studio')
  assert.equal(json('.claude-plugin/marketplace.json').name, 'seedance-studio-plugins')
  assert.equal(json('.agents/plugins/marketplace.json').name, 'seedance-studio-plugins')
})

test('the DSH bundle points at the entry and the shared skill', () => {
  assert.equal(pkg.main, './dsh/index.js')
  assert.ok(existsSync(`${root}/${pkg.dsh.bundle.patch}`))
  assert.match(read('dsh/cordis.patch.yml'), new RegExp(`name: ${pkg.name}\\b`))
  assert.match(read('dsh/index.js'), /\.\.\/plugins\/seedance-studio\/skills/)
  assert.ok(pkg.exports['./locale/*'])
  for (const path of ['dsh/', 'locale/', 'plugins/seedance-studio/skills/', pkg.icon]) assert.ok(pkg.files.includes(path), path)
  assert.match(read('plugins/seedance-studio/skills/seedance-studio/SKILL.md'), /^---\r?\nname: seedance-studio\r?\n/)
  assert.ok(existsSync(`${root}/plugins/seedance-studio/skills/seedance-studio/scripts/studio.mjs`), 'the skill folder must be self-contained')
})
