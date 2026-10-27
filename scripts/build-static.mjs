import {cp,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'dist-local');
await mkdir(output,{recursive:true});
await cp(path.join(root,'web'),output,{recursive:true});
console.log('Site estático preparado em '+output);
