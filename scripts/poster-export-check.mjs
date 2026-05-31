import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const source = readFileSync(join(root, 'src/utils/poster.ts'), 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(source.includes('onclone'), 'generatePoster must sanitize the cloned DOM before html2canvas renders it');
assert(source.includes('poster-exporting'), 'generatePoster must mark the cloned poster with the poster-exporting class');

console.log('Poster export check passed');
