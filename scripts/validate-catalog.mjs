// Validate the actual offline content and asset graph before publishing.
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const web=path.join(root,'web');
const context=vm.createContext({window:{}});
for(const file of ['catalog-photos.js','catalog-data.js'])vm.runInContext(await readFile(path.join(web,file),'utf8'),context,{filename:file});
const {brands,products,familyNames}=context.window.TERERECO_CATALOG;
const ids=new Set(),brandIds=new Set(brands.map(b=>b.id));
for(const p of products){
 if(ids.has(p.id))throw Error('Duplicate item: '+p.id);ids.add(p.id);
 if(!brandIds.has(p.brandId)&&p.brandId!=='dubaum')throw Error('Unknown brand: '+p.id);
 for(const field of ['name','description','source','credit','material','detail','care','why'])if(!p[field])throw Error('Missing '+field+': '+p.id);
 if(p.type==='erva'&&(!familyNames[p.family]||!p.composition||!p.base))throw Error('Incomplete herb: '+p.id);
 if(new URL(p.source).protocol!=='https:')throw Error('Invalid source: '+p.id);
 const image=path.resolve(web,'assets',p.image);
 if(!image.startsWith(path.join(web,'assets')+path.sep))throw Error('Unsafe image path');
 if((await stat(image)).size<1000)throw Error('Invalid image: '+p.id);
}
const html=await readFile(path.join(web,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="(\/(?:assets\/|vendor\/)[^"?]+)"/g))await stat(path.join(web,match[1]));
for(const b of brands){if(!b.story||!b.difference||!b.sourceLabel||!b.flavors)throw Error('Incomplete dossier: '+b.id);new URL(b.url);new URL(b.catalog);}
console.log(JSON.stringify({brands:brands.length,items:products.length,herbs:products.filter(p=>p.type==='erva').length,cups:products.filter(p=>p.type==='copo').length,pumps:products.filter(p=>p.type==='bomba').length,localAssets:'valid',sources:'present'}));
