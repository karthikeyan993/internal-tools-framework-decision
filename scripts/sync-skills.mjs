import { readdir, readFile, mkdir, writeFile, lstat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const mode = process.argv.slice(2);
if (mode.length !== 1 || !['--check', '--write'].includes(mode[0])) {
  throw new Error('Usage: node scripts/sync-skills.mjs --check|--write');
}
const source = join(root, 'skills');
const target = join(root, '.github/skills');

async function filesAt(directory, prefix = '') {
  let entries;
  try {
    const stat = await lstat(directory);
    if (stat.isSymbolicLink()) throw new Error(`Symlinks are not supported: ${directory}`);
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Symlinks are not supported: ${relative}`);
    if (entry.isDirectory()) files.push(...await filesAt(join(directory, entry.name), relative));
    else if (entry.isFile()) files.push(relative);
    else throw new Error(`Unsupported file: ${relative}`);
  }
  return files;
}

const sourceFiles = await filesAt(source);
const skills = sourceFiles.filter(file => /^[^/]+\/SKILL\.md$/.test(file));
if (skills.length === 0) throw new Error('No canonical skill bundles found');
const names = new Set(skills.map(file => file.split('/')[0]));
for (const file of sourceFiles) {
  if (!names.has(file.split('/')[0])) throw new Error(`File outside a skill bundle: ${file}`);
}
for (const file of skills) {
  const content = await readFile(join(source, file), 'utf8');
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  const name = frontmatter?.match(/^name: (.+)$/m)?.[1]?.trim();
  const description = frontmatter?.match(/^description: (.+)$/m)?.[1]?.trim();
  if (!name || name !== file.split('/')[0] || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 64) {
    throw new Error(`Invalid skill name in ${file}`);
  }
  if (!description || description.length > 1024) throw new Error(`Invalid description in ${file}`);
}

const settings = JSON.parse(await readFile(join(root, '.pi/settings.json'), 'utf8'));
if (!settings.skills?.some(path => resolve(root, '.pi', path) === resolve(source))) {
  throw new Error('Pi settings must resolve to the canonical skills directory');
}

const targetFiles = await filesAt(target);
const expected = new Set(sourceFiles);
const extra = targetFiles.filter(file => !expected.has(file));
if (extra.length) throw new Error(`Unexpected generated files; review/remove explicitly: ${extra.join(', ')}`);
const mismatches = [];
for (const file of sourceFiles) {
  const content = await readFile(join(source, file));
  let current;
  try { current = await readFile(join(target, file)); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (current?.equals(content)) continue;
  mismatches.push(file);
  if (mode[0] === '--write') {
    await mkdir(dirname(join(target, file)), { recursive: true });
    await writeFile(join(target, file), content);
  }
}
if (mode[0] === '--check' && mismatches.length) {
  throw new Error(`Copilot skill copies differ: ${mismatches.join(', ')}. Run npm run skills:sync.`);
}
console.log(`${skills.length} skills validated; ${mode[0] === '--write' ? `${mismatches.length} files synchronized` : 'Copilot copies and Pi path verified'}.`);
