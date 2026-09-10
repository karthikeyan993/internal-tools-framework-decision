import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const ignored = new Set(['.git', 'node_modules', 'dist', 'coverage']);
async function markdownFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name) || entry.isSymbolicLink()) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path);
  }
  return files;
}
const failures = [];
const files = await markdownFiles(root);
for (const file of files) {
  const content = (await readFile(file, 'utf8')).replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
  for (const match of content.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
    const destination = match[1];
    if (/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(destination)) continue;
    const path = decodeURIComponent(destination.split('#')[0]);
    try { await stat(resolve(dirname(file), path)); }
    catch { failures.push(`${file.slice(root.length)}: missing link ${destination}`); }
  }
}
if (failures.length) throw new Error(failures.join('\n'));
console.log(`Checked local Markdown file links in ${files.length} files (remote URLs and anchors not checked).`);
