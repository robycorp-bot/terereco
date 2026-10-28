// Public editorial research; no content is injected into the site automatically.
import {readFile,writeFile} from 'node:fs/promises';
const refs=JSON.parse(await readFile('work/catalog-references.json','utf8'));
const result=JSON.parse(await readFile('work/product-details.json','utf8').catch(()=>'{}'));
const jobs=Object.entries({trots:[2,3,4,5,6,7,8,9,10,11,12],chacal:[1,2,3],black:[1,2,3,4,5,6,7,8,9,10,11]}).flatMap(([group,ids])=>ids.map(i=>({key:`${group}-${i}`,url:refs[group][i].url}))).filter(x=>!result[x.key]);
let next=0;
async function worker(){while(next<jobs.length){const {key,url}=jobs[next++];try{const r=await fetch(url,{signal:AbortSignal.timeout(20000)});const html=new TextDecoder(r.headers.get('content-type')?.includes('iso-8859')?'windows-1252':'utf-8').decode(await r.arrayBuffer());let chunk=html.match(/id=["']tab-description["'][^>]*>([\s\S]*?)<\/div>/i)?.[1]||html.match(/class=["']description[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1]||'';const text=chunk.replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();result[key]={url,text};console.log(key,text.slice(0,1200));}catch(e){console.log(key,e.message)}}}
await Promise.all(Array.from({length:4},worker));await writeFile('work/product-details.json',JSON.stringify(result,null,2));
