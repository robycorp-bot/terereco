// Research helper: public catalog references only; not part of the site runtime.
import { mkdir, writeFile } from 'node:fs/promises';
const pages = {
  trots: 'https://tereredubaum.com.br/categoria-produto/trots/',
  chacal: 'https://tereredubaum.com.br/categoria-produto/chacal/',
  black: 'https://tereredubaum.com.br/categoria-produto/black/',
  copos: 'https://tereredubaum.com.br/categoria-produto/copos/',
  termicos: 'https://tereredubaum.com.br/categoria-produto/copos-termicos/',
  bombas: 'https://www.terereclub.com/bombas-para-terere-chimarrao',
  guampas: 'https://www.terereclub.com/copos-guampas-terere',
  campesino: 'https://www.yerbateracampesino.com.py/nuestros-productos/',
  indega: 'https://www.indega.com.py/yerbamateindega/',
  barao: 'https://www.baraoshop.com/terere',
  yacuy: 'https://ftp.yacuy.com.br/',
  selecta: 'https://www.selecta.com.py/yerba-mate',
  cbse: 'https://tiendacbse.com.ar/yerbas/',
  colon: 'https://www.colonias.com.py/productos/'
};
const decode=s=>s.replace(/&amp;|&#038;/g,'&').replace(/&#8217;/g,'’').replace(/&quot;/g,'"');
const all={};
await Promise.all(Object.entries(pages).map(async([key,url])=>{
  try {
    const res=await fetch(url,{signal:AbortSignal.timeout(25000)});
    if(!res.ok) throw Error(res.status);
    const html=await res.text();
    const list=[];
    for(const a of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
      for(const im of a[2].matchAll(/<img\b[^>]*>/gi)) {
        const attr=n=>decode(im[0].match(new RegExp('(?:^|\\s)'+n+'=["\']([^"\']*)["\']','i'))?.[1]||'');
        let src=attr('data-src')||attr('src'),title=attr('alt')||attr('title');
        if(!src||src.startsWith('data:')||/logo|banner|icon|facebook|pagamento|bandeira|pixel|loading/i.test(src))continue;
        src=new URL(src,url).href;
        if(list.some(x=>x.img.split('?')[0]===src.split('?')[0]))continue;
        list.push({title,img:src,url:new URL(decode(a[1]),url).href});
      }
    }
    // Some institutional product catalogs do not wrap images in anchors.
    if(list.length<3)for(const im of html.matchAll(/<img\b[^>]*>/gi)){
      const src=im[0].match(/\ssrc=["']([^"']+)["']/i)?.[1];
      if(src&&!/logo|banner|icon|facebook|pagamento|bandeira|pixel|loading|data:/.test(src))list.push({title:im[0].match(/alt=["']([^"']*)["']/i)?.[1]||'',img:new URL(decode(src),url).href,url});
    }
    all[key]=list;
    console.log(key,JSON.stringify(list.map((x,i)=>({i,title:x.title,img:x.img}))).slice(0,5200));
  }catch(e){console.log(key,'ERROR',e.message)}
}));
await mkdir('work',{recursive:true});
await writeFile('work/catalog-references.json',JSON.stringify(all,null,2));
