// Run after collect-reference-images.mjs. Downloads real editorial reference photos.
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
const refs=JSON.parse(await readFile('work/catalog-references.json','utf8'));
const picks={trots:[2,3,4,5,6,7,8,9,10,11,12],chacal:[1,2,3],black:[1,2,3,4,5,6,7,8,9,10,11],barao:[12,13,14,15,16,17,18,19,20,21,22],bombas:[0,1,3,5,6,8,13],guampas:[0,1,2,3,4,6,8,10,12]};
const jobs=[];
for(const [group,indices]of Object.entries(picks))for(const i of indices)jobs.push({key:`${group}-${i}`,...refs[group][i],credit:['bombas','guampas'].includes(group)?'Tereré Club · catálogo próprio':group==='barao'?'Barão · loja oficial':'Tererédubaum · catálogo de revenda'});
for(const name of ['clasica','compuesta','fresca','kuna-guapa','manzanilla-y-anis','menta-y-boldo','pantano','siempre-vive'])jobs.push({key:`indega-${name}`,img:`https://www.indega.com.py/yerbamateindega/images/${name}-caja-500g.png`,url:'https://www.indega.com.py/yerbamateindega/',credit:'Indega · catálogo oficial'});
await mkdir('web/assets/catalog',{recursive:true});
const photos={};let cursor=0,failed=0;
async function worker(){while(cursor<jobs.length){const job=jobs[cursor++];try{
  let urls=[job.img];
  if(job.img.includes('/image/cache/catalog/'))urls.unshift(job.img.replace('/image/cache/catalog/','/image/catalog/').replace(/-228x228(?=\.)/,''));
  let response;
  for(const url of urls){try{const r=await fetch(url,{signal:AbortSignal.timeout(25000)});if(r.ok&&r.headers.get('content-type')?.startsWith('image/')){response=r;break}}catch{}}
  if(!response)throw Error('image unavailable');
  const ext=new URL(job.img).pathname.match(/\.(png|webp|jpeg|jpg)$/i)?.[1]||'jpg';
  const path=`catalog/${job.key}.${ext}`;
  const bytes=new Uint8Array(await response.arrayBuffer());
  if(bytes.length<1000)throw Error('invalid image');
  await writeFile(`web/assets/${path}`,bytes);
  photos[job.key]={image:path,source:job.url,photo:response.url,credit:job.credit};
  console.log(job.key,Math.round(bytes.length/1024)+'KB');
}catch(e){failed++;console.error(job.key,e.message)}}}
await Promise.all(Array.from({length:4},worker));
await writeFile('web/catalog-photos.js','// Real photographs downloaded from the credited public catalogs.\nwindow.TERERECO_PHOTOS = '+JSON.stringify(photos,null,2)+';\n');
await writeFile('web/assets/catalog/sources.json',JSON.stringify({checked:'2026-10-28',photos},null,2));
console.log(JSON.stringify({downloaded:Object.keys(photos).length,failed}));
if(failed)process.exitCode=1;
