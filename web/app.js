const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const {products,brands,familyNames,checked}=window.TERERECO_CATALOG;
const arrow='<svg aria-hidden="true"><use href="#arrow"/></svg>';
const heart='<svg aria-hidden="true"><use href="#heart"/></svg>';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’‘']/g,'').toLowerCase();
const photo=p=>'/assets/'+p.image;
let favorites=new Set();
try{const saved=JSON.parse(localStorage.getItem('terereco.favorites')||'[]');if(Array.isArray(saved))favorites=new Set(saved.filter(id=>products.some(p=>p.id===id)));}catch{}
let filter='all',brandFilter='all',profileFilter='all',query='',visible=12,comparison=[];
let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
const reduced=paused;
document.documentElement.classList.toggle('paused',paused);
document.documentElement.classList.add('js-reveal');
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.04});
function observeReveals(){$$('.reveal:not(.in-view)').forEach(el=>observer.observe(el));}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),3000);}
function compareButton(p){return '<button class="compare-pick" data-compare="'+p.id+'" aria-pressed="'+comparison.includes(p.id)+'">'+(comparison.includes(p.id)?'Na comparação':'Comparar')+'<span class="sr-only"> '+esc(p.brand+' '+p.name)+'</span></button>';}
function filteredProducts(){
 const words=normalize(query).split(/\s+/).filter(Boolean);
 return products.filter(p=>(filter==='all'||p.type===filter)&&(brandFilter==='all'||p.brandId===brandFilter)&&(profileFilter==='all'||p.family===profileFilter)&&words.every(word=>normalize([p.brand,p.name,p.profile,p.description,p.material,p.detail,p.composition||''].join(' ')).includes(word)));
}
function renderProducts(){
 const items=filteredProducts(),page=items.slice(0,visible);
 $('#resultsCount').textContent=items.length+' '+(items.length===1?'descoberta':'descobertas');
 $('#productGrid').innerHTML=page.map((p,i)=>'<article class="product-card reveal" style="transition-delay:'+(i%3*40)+'ms"><div class="product-picture" style="background:'+p.tone+'"><span class="product-category">'+esc(p.tag)+'</span><button class="favorite '+(favorites.has(p.id)?'saved':'')+'" data-favorite="'+p.id+'" aria-label="'+(favorites.has(p.id)?'Remover ':'Salvar ')+esc(p.brand+' '+p.name)+' nos favoritos" aria-pressed="'+favorites.has(p.id)+'">'+heart+'</button><button class="product-open" data-product="'+p.id+'" aria-label="Conhecer '+esc(p.brand+' '+p.name)+'"><img src="'+photo(p)+'" alt="'+esc(p.brand+' '+p.name)+', fotografia real" width="800" height="800" loading="lazy"></button></div><div class="product-info"><div><small>'+esc(p.brand)+'</small><h3>'+esc(p.name)+'</h3><p>'+esc(p.profile)+'</p></div><button data-product="'+p.id+'" aria-label="Ler ficha de '+esc(p.name)+'">'+arrow+'</button></div>'+compareButton(p)+'</article>').join('')||'<div class="empty-catalog"><h3>Uma nova combinação?</h3><p>Nenhuma ficha com esses filtros. Explore as histórias das marcas ou limpe a busca para descobrir outros perfis.</p><button class="button outline" data-reset-filters>Limpar filtros</button></div>';
 $('#loadMore').hidden=visible>=items.length;$('#pageStatus').textContent=page.length+' de '+items.length+' fichas';
 $$('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
 $('#catalogProfile').disabled=filter==='copo'||filter==='bomba';observeReveals();
}
function resetFilters(){filter=brandFilter=profileFilter='all';query='';visible=12;$('#catalogSearch').value='';$('#catalogBrand').value='all';$('#catalogProfile').value='all';renderProducts();}
function updateFavorites(){
 $('#favoriteCount').textContent=favorites.size;
 $$('[data-favorite]').forEach(b=>{const saved=favorites.has(b.dataset.favorite),p=products.find(x=>x.id===b.dataset.favorite);b.classList.toggle('saved',saved);b.setAttribute('aria-pressed',saved);b.setAttribute('aria-label',(saved?'Remover ':'Salvar ')+(p?.name||'item')+' nos favoritos');if(b.classList.contains('save-detail'))b.textContent=saved?'Salvo na sua roda ♥':'Salvar na minha roda ♡';});
 try{localStorage.setItem('terereco.favorites',JSON.stringify([...favorites]));}catch{}
}
function toggleFavorite(id){if(!products.some(p=>p.id===id))return;favorites.has(id)?favorites.delete(id):favorites.add(id);updateFavorites();renderFavorites();toast(favorites.has(id)?'Salvo na sua roda.':'Removido da sua roda.');}
function showDialog(id){closeDialogs();$('#'+id).showModal();document.body.classList.add('modal-open');}
function closeDialogs(){$$('dialog[open]').forEach(d=>d.close());document.body.classList.remove('modal-open');}
$$('dialog').forEach(d=>{d.addEventListener('close',()=>{if(!$('dialog[open]'))document.body.classList.remove('modal-open');});d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
function openProduct(id){
 const p=products.find(p=>p.id===id);if(!p)return;const b=brands.find(b=>b.id===p.brandId),isHerb=p.type==='erva';
 const block=(title,body)=>'<div class="detail-block"><h3>'+title+'</h3><p>'+esc(body)+'</p></div>';
 $('#detailContent').innerHTML='<div class="detail-layout"><div class="detail-image" style="background:'+p.tone+'"><img src="'+photo(p)+'" alt="'+esc(p.brand+' '+p.name)+'"><p class="photo-caption">FOTOGRAFIA DO ITEM REAL<br>'+esc(p.credit)+'</p></div><div class="detail-copy"><p class="eyebrow dark">'+esc(p.brand)+' / '+(isHerb?'ERVA':p.type.toUpperCase())+'</p><h2 id="detailTitle">'+esc(p.name)+'</h2><p>'+esc(p.description)+'</p><div class="detail-specs"><span>'+(isHerb?'PERFIL':'MATERIAL')+'<b>'+esc(isHerb?familyNames[p.family]:p.material)+'</b></span><span>'+(isHerb?'APRESENTAÇÃO':'MODELO')+'<b>'+esc(p.detail)+'</b></span></div>'+block(isHerb?'O QUE OBSERVAR NA COMPOSIÇÃO':'POR QUE CONHECER ESTE MODELO',isHerb?p.composition:p.why)+block(isHerb?'PARA QUEM TEM CURIOSIDADE':'CUIDADOS E LIMITES',isHerb?p.why:p.care)+(isHerb?block('ANTES DE ESCOLHER',p.care):'')+(p.packaging?block('EMBALAGEM E CONSERVAÇÃO',p.packaging):'')+'<div class="detail-actions"><a class="button lime" href="'+esc(p.source)+'" target="_blank" rel="noopener noreferrer">Consultar a fonte '+arrow+'</a>'+compareButton(p)+'</div><button class="save-detail" data-favorite="'+p.id+'" aria-pressed="'+favorites.has(id)+'">'+(favorites.has(id)?'Salvo na sua roda ♥':'Salvar na minha roda ♡')+'</button>'+(b&&p.brand!=='TERERÉDUBAUM'?'<button class="underlink brand-detail-link" data-brand="'+b.id+'">História e outras linhas de '+esc(b.name)+' ↗</button>':'')+'<p class="detail-source">Referência: '+esc(p.credit)+'. Consulta: '+checked+'. As embalagens e as composições podem mudar; confira a versão atual na fonte. Conteúdo editorial, sem venda.</p></div></div>';
 showDialog('detailDialog');
}
function renderFavorites(){const items=products.filter(p=>favorites.has(p.id));$('#favoritesList').innerHTML=items.length?items.map(p=>'<div class="favorite-row"><img src="'+photo(p)+'" alt="'+esc(p.name)+'"><button data-product="'+p.id+'"><h3>'+esc(p.name)+'</h3><small>'+esc(p.brand)+' · LER FICHA ↗</small></button><button class="favorite-remove" data-favorite="'+p.id+'" aria-label="Remover '+esc(p.name)+' dos favoritos">×</button></div>').join(''):'<p class="empty-favorites">Sua roda começa com uma descoberta.<br>Toque no coração de um item para guardá-lo aqui.</p>';}
function renderBrands(){
 const q=normalize($('#brandSearch').value),country=$('#brandCountry').value,items=brands.filter(b=>(country==='all'||b.country===country)&&normalize([b.name,b.country,b.era,...b.flavors].join(' ')).includes(q));
 $('#brandCount').textContent=items.length+' marcas';$('#brandGrid').innerHTML=items.map(b=>'<button class="brand-card reveal" data-brand="'+b.id+'" aria-label="Conhecer '+esc(b.name)+'"><span class="brand-country">'+esc(b.country.toUpperCase())+' <span>↗</span></span><span class="brand-name '+(b.serif?'serif':'')+'">'+esc(b.name)+'</span><span class="brand-tag">'+esc(b.tag)+'</span></button>').join('')||'<p class="empty-catalog">Nenhuma marca com essa busca. Experimente outro nome ou país.</p>';observeReveals();
}
function openBrand(id){
 const b=brands.find(b=>b.id===id);if(!b)return;const items=products.filter(p=>p.brandId===id&&p.brand!=='TERERÉDUBAUM');
 $('#detailContent').innerHTML='<article class="brand-dossier"><header class="brand-dossier-head"><div><p class="eyebrow dark">'+esc(b.country.toUpperCase())+' · DOSSIÊ DA MARCA</p><h2 id="detailTitle">'+esc(b.name)+'</h2></div><span>'+esc(b.era)+'</span></header><div class="dossier-columns"><div><h3>HISTÓRIA & CONTEXTO</h3><p>'+esc(b.story)+'</p><h3>O QUE DIFERENCIA</h3><p>'+esc(b.difference)+'</p></div><div><h3>'+(b.flavors.length?'LINHAS & SABORES DOCUMENTADOS':'O UNIVERSO DA MARCA')+'</h3>'+(b.flavors.length?'<div class="flavor-list">'+b.flavors.map(f=>'<span>'+esc(f)+'</span>').join('')+'</div><p>Um recorte do catálogo consultado. Disponibilidade, embalagem e indicação de preparo variam por versão e país.</p>':'<p>Copos, guampas, bombas e acessórios com materiais e construções diferentes.</p>')+(b.note?'<aside class="dossier-note">'+esc(b.note)+'</aside>':'')+'</div></div>'+(items.length?'<div class="mini-products">'+items.slice(0,3).map(p=>'<button data-product="'+p.id+'"><img src="'+photo(p)+'" alt="'+esc(p.name)+'" loading="lazy"><span>'+esc(p.name)+' ↗</span></button>').join('')+'</div>':'')+'<div class="brand-dossier-actions">'+(items.length?'<button class="button lime" data-brand-catalog="'+id+'">Explorar '+items.length+' fichas '+arrow+'</button>':'')+'<a class="button outline" href="'+esc(b.catalog)+'" target="_blank" rel="noopener noreferrer">Consultar catálogo original '+arrow+'</a></div><p class="detail-source"><a href="'+esc(b.url)+'" target="_blank" rel="noopener noreferrer">'+esc(b.sourceLabel)+' ↗</a><br>Consulta: '+checked+'. Informações atribuídas às fontes. Este guia não representa as marcas citadas.</p></article>';
 showDialog('detailDialog');
}
function toggleComparison(id){
 const p=products.find(p=>p.id===id);if(!p)return;
 if(comparison.includes(id))comparison=comparison.filter(x=>x!==id);
 else{if(comparison.length===3){toast('Sua comparação já tem 3 itens. Remova um para trocar.');return;}if(comparison.length&&products.find(x=>x.id===comparison[0]).type!==p.type){toast('Compare itens da mesma categoria. Limpe a seleção para mudar.');return;}comparison.push(id);}
 updateComparison();if($('#compareDialog').open){if(comparison.length>=2)renderComparison();else closeDialogs();}
}
function updateComparison(){
 const items=comparison.map(id=>products.find(p=>p.id===id));$('#compareBar').hidden=!items.length;document.body.classList.toggle('has-comparison',!!items.length);
 $('#compareCount').textContent=items.length+' / 3';$('#compareSummary').textContent=items.length===1?'Escolha mais um item da mesma categoria':items.map(p=>p.name).join(' · ');$('#openCompare').disabled=items.length<2;
 $$('.compare-pick[data-compare]').forEach(b=>{const active=comparison.includes(b.dataset.compare);b.setAttribute('aria-pressed',active);b.innerHTML=(active?'Na comparação':'Comparar')+'<span class="sr-only"> '+esc(products.find(p=>p.id===b.dataset.compare)?.name||'')+'</span>';});
}
function renderComparison(){
 const items=comparison.map(id=>products.find(p=>p.id===id)),isHerb=items[0]?.type==='erva';if(items.length<2)return;
 const row=(label,fn)=>'<tr><th scope="row">'+label+'</th>'+items.map(p=>'<td>'+esc(fn(p))+'</td>').join('')+'</tr>';
 $('#compareContent').innerHTML='<div class="compare-scroll" tabindex="0" role="region" aria-label="Tabela de comparação; role horizontalmente para ver todos os itens"><table class="compare-table"><caption class="sr-only">Comparação de '+items.length+' '+(isHerb?'ervas':'equipamentos')+'</caption><thead><tr><th scope="col">SUA SELEÇÃO</th>'+items.map(p=>'<th scope="col"><img src="'+photo(p)+'" alt="'+esc(p.name)+'"><small>'+esc(p.brand)+'</small><h3>'+esc(p.name)+'</h3><button data-compare="'+p.id+'">Remover da comparação</button></th>').join('')+'</tr></thead><tbody>'+row(isHerb?'PERFIL':'MATERIAL',p=>isHerb?familyNames[p.family]:p.material)+row('APRESENTAÇÃO',p=>p.detail)+(isHerb?row('BASE DECLARADA',p=>p.base):'')+row('DIFERENÇA',p=>p.description)+row(isHerb?'COMPOSIÇÃO':'POR QUE CONHECER',p=>isHerb?p.composition:p.why)+row('OBSERVE TAMBÉM',p=>p.care)+'<tr><th scope="row">REFERÊNCIA</th>'+items.map(p=>'<td><a href="'+esc(p.source)+'" target="_blank" rel="noopener noreferrer">'+esc(p.credit)+' ↗</a></td>').join('')+'</tr></tbody></table></div><p class="compare-disclaimer">Sem classificação de melhor ou pior. Perfis seguem as descrições consultadas, não testes sensoriais ou medições. Referências consultadas em '+checked+'.</p>';
}
function startQuiz(){
 setMenu(false);$('#quizContent').innerHTML='<p class="eyebrow dark">SIGA A SUA CURIOSIDADE / 01</p><h2 id="quizTitle">Qual perfil<br><em>pede passagem?</em></h2><p class="quiz-intro">Escolha uma direção de sabor. Você vai encontrar três pontos de partida, sem ranking.</p><div class="quiz-options">'+Object.entries(familyNames).map(([id,name])=>'<button class="quiz-option" data-taste="'+id+'"><div><span>'+esc(name)+'</span><small>Descobrir referências desse perfil.</small></div><i>↗</i></button>').join('')+'</div>';showDialog('quizDialog');
}
function quizResult(taste){
 const pool=products.filter(p=>p.type==='erva'&&p.family===taste),seen=new Set(),items=pool.filter(p=>{if(seen.has(p.brandId))return false;seen.add(p.brandId);return true;}).slice(0,3);
 $('#quizContent').innerHTML='<p class="eyebrow dark">SEU PONTO DE PARTIDA / 02</p><h2 id="quizTitle">Explore o<br><em>'+esc(familyNames[taste]?.toLowerCase())+'.</em></h2><p class="quiz-intro">Uma seleção para conhecer o perfil por diferentes marcas. As descrições vêm das referências, sem degustação comparativa.</p><div class="quiz-results">'+items.map(p=>'<button class="quiz-result" data-product="'+p.id+'"><img src="'+photo(p)+'" alt="'+esc(p.name)+'"><span><small>'+esc(p.brand)+'</small><b>'+esc(p.name)+'</b><i>Ler ficha ↗</i></span></button>').join('')+'</div><button class="button lime" data-profile="'+taste+'">Ver todas desse perfil '+arrow+'</button><button class="quiz-back" data-open-quiz>← Explorar outro perfil</button>';
}
function setMenu(open){$('#mobileMenu').hidden=!open;$('#menuButton').setAttribute('aria-expanded',open);$('#menuButton').setAttribute('aria-label',open?'Fechar menu':'Abrir menu');document.body.classList.toggle('menu-open',open);document.body.classList.toggle('modal-open',open||!!$('dialog[open]'));}
document.addEventListener('click',e=>{
 const element=attr=>e.target.closest('[data-'+attr+']');
 if(element('favorite')){toggleFavorite(element('favorite').dataset.favorite);return;}
 if(element('compare')){toggleComparison(element('compare').dataset.compare);return;}
 if(element('product')){openProduct(element('product').dataset.product);return;}
 if(element('brand')){openBrand(element('brand').dataset.brand);return;}
 if(element('brand-catalog')){const id=element('brand-catalog').dataset.brandCatalog;resetFilters();brandFilter=id;$('#catalogBrand').value=id;renderProducts();closeDialogs();$('#explorar').scrollIntoView({behavior:reduced?'instant':'smooth'});return;}
 if(element('close-dialog')){closeDialogs();return;}
 if(element('open-quiz')){startQuiz();return;}
 if(element('taste')){quizResult(element('taste').dataset.taste);return;}
 if(element('filter')){filter=element('filter').dataset.filter;visible=12;if(filter==='bomba'||filter==='copo'){profileFilter='all';$('#catalogProfile').value='all';}renderProducts();return;}
 if(element('profile')){resetFilters();filter='erva';profileFilter=element('profile').dataset.profile;$('#catalogProfile').value=profileFilter;renderProducts();closeDialogs();$('#explorar').scrollIntoView({behavior:reduced?'instant':'smooth'});return;}
 if(element('reset-filters')){resetFilters();return;}
 if(e.target.closest('.favorites-open')){renderFavorites();showDialog('favoritesDialog');}
});
$('#catalogSearch').addEventListener('input',e=>{query=e.target.value;visible=12;renderProducts();});
$('#catalogBrand').addEventListener('change',e=>{brandFilter=e.target.value;visible=12;renderProducts();});
$('#catalogProfile').addEventListener('change',e=>{profileFilter=e.target.value;visible=12;renderProducts();});
$('#resetFilters').addEventListener('click',resetFilters);
$('#loadMore').addEventListener('click',()=>{const previous=visible;visible+=12;renderProducts();$$('.product-card .product-open')[previous]?.focus({preventScroll:true});});
$('#brandSearch').addEventListener('input',renderBrands);$('#brandCountry').addEventListener('change',renderBrands);
$('#openCompare').addEventListener('click',()=>{renderComparison();showDialog('compareDialog');});
$('#clearCompare').addEventListener('click',()=>{comparison=[];updateComparison();});
$('#menuButton').addEventListener('click',()=>setMenu($('#mobileMenu').hidden));
$$('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false);});
$('#creditsButton').addEventListener('click',()=>showDialog('creditsDialog'));
function applyMotion(){document.documentElement.classList.toggle("paused",paused);$("#motionToggle").setAttribute("aria-pressed",paused);$("#motionToggle").innerHTML=(paused?"▷":"Ⅱ")+' <span>'+(paused?"Ativar movimento":"Pausar movimento")+'</span>';window.dispatchEvent(new CustomEvent("terereco-motion",{detail:{paused}}));}
$("#motionToggle").addEventListener("click",()=>{paused=!paused;applyMotion();});
applyMotion();
let scrollBusy=false;
window.addEventListener("scroll",()=>{if(!scrollBusy){scrollBusy=true;requestAnimationFrame(()=>{const range=document.documentElement.scrollHeight-innerHeight;$(".reading-progress i").style.width=(range>0?scrollY/range*100:0)+"%";scrollBusy=false;});}},{passive:true});
let loaded=false,loaderRAF;
const loader=$("#loader"),percent=$("#loadPercent"),bar=$("#loadBar");
let progress=0,assetCount=0;
const essential=["/assets/folhas.jpg","/assets/arvore.jpg","/assets/trots-burrito.jpg","/assets/chacal-limao.png"];
const preload=Promise.allSettled(essential.map(src=>new Promise(resolve=>{const image=new Image();image.onload=image.onerror=()=>{assetCount++;resolve();};image.src=src;})));
const sceneReady=new Promise(resolve=>{if(window.tererecoSceneReady)resolve();else window.addEventListener("terereco-scene-ready",resolve,{once:true});setTimeout(resolve,6500);});
function endLoader(){if(loaded)return;loaded=true;cancelAnimationFrame(loaderRAF);percent.textContent="100";bar.style.width="100%";$("#loadLabel").textContent="A SUA RODA ESTÁ PRONTA";setTimeout(()=>{loader.classList.add("finished");window.dispatchEvent(new Event("terereco-enter"));},reduced?0:300);}
function runLoader(replay=false){
 loaded=false;progress=0;loader.classList.remove("finished");const start=performance.now();
 function tick(now){const elapsed=now-start;const target=replay?Math.min(99,elapsed/14):Math.min(95,assetCount/essential.length*57+Math.min(38,elapsed/70));progress+=Math.max(.05,(target-progress)*.065);percent.textContent=String(Math.min(99,Math.floor(progress))).padStart(2,"0");bar.style.width=progress+"%";$("#loadLabel").textContent=progress<40?"DESPERTANDO A NATUREZA":progress<75?"PREPARANDO O PRIMEIRO GOLE":"ENCONTRANDO A SUA RODA";if(replay&&elapsed>1500){endLoader();return;}if(!loaded)loaderRAF=requestAnimationFrame(tick);}
 loaderRAF=requestAnimationFrame(tick);
 if(!replay)Promise.all([preload,sceneReady,new Promise(r=>setTimeout(r,reduced?0:1600))]).then(endLoader);
 setTimeout(endLoader,replay?2000:7500);
}
$("#skipLoader").addEventListener("click",endLoader);
$("#replayLoader").addEventListener("click",()=>{scrollTo({top:0,behavior:"instant"});runLoader(true);});

$('#catalogBrand').innerHTML+=brands.filter(b=>products.some(p=>p.brandId===b.id)).sort((a,b)=>a.name.localeCompare(b.name,'pt-BR')).map(b=>'<option value="'+b.id+'">'+esc(b.name)+'</option>').join('')+'<option value="dubaum">Tererédubaum · revenda</option>';
$('#catalogProfile').innerHTML+=Object.entries(familyNames).map(([id,name])=>'<option value="'+id+'">'+esc(name)+'</option>').join('');
$('#catalogStats').innerHTML=[[brands.length,'marcas no guia'],[products.filter(p=>p.type==='erva').length,'ervas em detalhe'],[products.filter(p=>p.type==='copo').length,'copos & guampas'],[products.filter(p=>p.type==='bomba').length,'bombas para conhecer']].map(([count,label])=>'<div><b>'+String(count).padStart(2,'0')+'</b><span>'+label+'</span></div>').join('');
$('.credits-copy').insertAdjacentHTML('beforeend','<h3>Atlas de marcas, sabores e equipamentos</h3><p>Pesquisa editorial consultada em '+checked+'. '+brands.map(b=>'<a href="'+esc(b.url)+'" target="_blank" rel="noopener">'+esc(b.name)+'</a>').join(' · ')+'. As referências de revenda estão identificadas nos dossiês. Cada ficha tem seu próprio link de origem. Fotografias adicionais: Barão (loja oficial), Indega (catálogo oficial), Tereré Club (catálogo próprio) e Tererédubaum (revenda). Os arquivos estão hospedados localmente; direitos de imagens e marcas pertencem aos respectivos titulares.</p><h3>Critério editorial</h3><p>Perfis organizam nomes e descrições de catálogo, sem degustação, pontuação, patrocínio ou recomendação clínica. O guia compara características documentadas, sem classificar marcas como melhores ou piores. Confira ingredientes e instruções na embalagem atual.</p><p><a href="https://medlineplus.gov/caffeine.html" target="_blank" rel="noopener">MedlinePlus / NIH · cafeína e seus efeitos</a>. Composição, processamento e perfil sensorial não demonstram benefícios de tratamento.</p>');
renderProducts();renderBrands();updateFavorites();observeReveals();runLoader();

