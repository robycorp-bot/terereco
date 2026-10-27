const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const arrow = '<svg aria-hidden="true"><use href="#arrow"/></svg>';
const heart = '<svg aria-hidden="true"><use href="#heart"/></svg>';
const products = [
 {id:"trots",name:"Burrito",brand:"TROT’S",type:"erva",image:"trots-burrito.jpg",profile:"Herbal · 500 g",tag:"PERFIL HERBAL",description:"Uma referência da linha de ervas para tereré da TROT’S. O Burrito é um ponto de partida para quem quer explorar um perfil herbal. Veja a composição e as instruções da embalagem na página do fabricante.",source:"https://trots.com.br/",material:"Erva para tereré",detail:"Burrito",tone:"#e5e9d7"},
 {id:"chacal",name:"Limão Rosa",brand:"CHACAL",type:"erva",image:"chacal-limao.png",profile:"Cítrico · 500 g",tag:"PERFIL CÍTRICO",description:"A linha Chacal Limão Rosa leva um perfil cítrico para a escolha da sua próxima erva. Explore o produto real e confira os ingredientes, a composição e as orientações de preparo na fonte.",source:"https://tereredubaum.com.br/?s=chacal+limao+rosa&post_type=product",material:"Erva para tereré",detail:"Limão Rosa",tone:"#e7e9d4"},
 {id:"black",name:"Cereja Ice",brand:"BLACK ERVA",type:"erva",image:"black-cereja.webp",profile:"Frutado · 500 g",tag:"PERFIL FRUTADO",description:"Uma opção da Black Erva para quem gosta de explorar sabores frutados no tereré. A embalagem real apresenta a versão Cereja Ice. Confira composição, detalhes e modo de preparo na referência.",source:"https://tereredubaum.com.br/?s=black+cereja&post_type=product",material:"Erva para tereré",detail:"Cereja Ice",tone:"#e9e3dc"},
 {id:"couro",name:"Couro Caramelo",brand:"TERERÉDUBAUM",type:"copo",image:"copo-couro.jpg",profile:"Copo com bomba · Couro",tag:"CUIDADO NOS DETALHES",description:"Copo com revestimento de couro em tom caramelo e bomba telada preta. A fotografia mostra o acabamento real. Explore os detalhes e confirme material interno, dimensões e composição do conjunto na fonte.",source:"https://tereredubaum.com.br/?s=copo+couro+caramelo&post_type=product",material:"Revestimento em couro",detail:"Caramelo",tone:"#e9e0d4"},
 {id:"marrom",name:"Couro Marrom",brand:"TERERÉDUBAUM",type:"copo",image:"copo-marrom.jpg",profile:"Copo · Couro marrom",tag:"ESSENCIAL DO RITUAL",description:"A versão marrom combina a textura do revestimento com o desenho simples de um copo para tereré. Compare a fotografia e os detalhes do modelo com o seu jeito de preparar a bebida.",source:"https://tereredubaum.com.br/?s=copo+couro+marrom&post_type=product",material:"Revestimento em couro",detail:"Marrom",tone:"#e4e4d7"},
 {id:"bomba",name:"Inox Chata Preta",brand:"TROT’S",type:"bomba",image:"bomba-trots.jpg",profile:"Bomba inox · Preta",tag:"O FLUXO DO RITUAL",description:"A Bomba Inox Chata Preta TROT’S tem corpo achatado e acabamento preto. A fotografia é da loja oficial. Explore o formato, o filtro e as orientações de cuidado diretamente no fabricante.",source:"https://trots.com.br/products/bomba-chata-preto-fosco",material:"Inox",detail:"Chata preta",tone:"#dee5d7",credit:"TROT’S · loja oficial"}
];
const brands = [
 {name:"TROT’S",country:"BRASIL",tag:"Ervas · Bombas · Acessórios",url:"https://trots.com.br/",description:"Explore a linha de ervas, bombas e acessórios na loja oficial da TROT’S.",product:"trots"},
 {name:"CHACAL",country:"BRASIL",tag:"Ervas para tereré",url:"https://tereredubaum.com.br/?s=chacal&post_type=product",description:"Conheça referências da Chacal e explore seus sabores para tereré. A marca aparece nos produtos reais como CHACAL.",product:"chacal"},
 {name:"BLACK ERVA",country:"BRASIL",tag:"Perfis e sabores",url:"https://tereredubaum.com.br/?s=black&post_type=product",description:"Descubra versões da Black Erva e compare os perfis de sabor disponíveis.",product:"black"},
 {name:"KURUPÍ",country:"PARAGUAI",tag:"Tradição paraguaia",url:"https://www.terereecia.com.br/produtos/",description:"Explore referências da Kurupí, como Menta e Boldo, e consulte as informações de cada embalagem.",serif:true},
 {name:"BARÃO",country:"BRASIL",tag:"Erva-mate de Cotegipe",url:"https://www.baraoervamate.com.br/site/",description:"Conheça a linha de tereré da Barão no catálogo oficial do fabricante.",serif:true},
 {name:"SELECTA",country:"PARAGUAI",tag:"O universo da yerba mate",url:"https://www.selecta.com.py/yerba-mate",description:"Explore a história, o cultivo e o universo da erva-mate na página oficial da Selecta."},
 {name:"PAJARITO",country:"PARAGUAI",tag:"Raízes em terra guarani",url:"https://ervamatepajarito.com.br/",description:"Conheça a Pajarito e suas referências no site brasileiro da marca.",serif:true},
 {name:"TERERÉ CLUB",country:"BRASIL",tag:"Ervas · Copos · Bombas",url:"https://www.terereclub.com/",description:"Explore ervas, copos, guampas e bombas no catálogo da Tereré Club."}
];
let favorites = new Set();
try { const saved = JSON.parse(localStorage.getItem("terereco.favorites") || "[]"); if(Array.isArray(saved)) favorites = new Set(saved.filter(id => products.some(p=>p.id===id))); } catch {}
let filter = "all", paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
const reduced = paused;
document.documentElement.classList.toggle("paused",paused);
document.documentElement.classList.add("js-reveal");
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){entry.target.classList.add("in-view");observer.unobserve(entry.target);} }),{threshold:.08});
function observeReveals(){ $$(".reveal:not(.in-view)").forEach(el=>observer.observe(el)); }
function toast(text){ const el=$("#toast");el.textContent=text;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2600); }
function renderProducts(){
 const items = products.filter(p=>filter==="all"||p.type===filter);
 $("#resultsCount").textContent = String(items.length).padStart(2,"0")+" descobertas";
 $("#productGrid").innerHTML=items.map((p,i)=>'<article class="product-card reveal" style="transition-delay:'+i%3*65+'ms"><div class="product-picture" style="background:'+p.tone+'"><span class="product-category">'+p.tag+'</span><button class="favorite '+(favorites.has(p.id)?'saved':'')+'" data-favorite="'+p.id+'" aria-label="'+(favorites.has(p.id)?'Remover':'Salvar')+' '+p.brand+' '+p.name+' nos favoritos" aria-pressed="'+favorites.has(p.id)+'">'+heart+'</button><button class="product-open" data-product="'+p.id+'" aria-label="Explorar '+p.brand+' '+p.name+'"><img src="/assets/'+p.image+'" alt="'+p.brand+' '+p.name+', fotografia do produto real" width="800" height="800" loading="lazy"></button></div><div class="product-info"><div><small>'+p.brand+'</small><h3>'+p.name+'</h3><p>'+p.profile+'</p></div><button data-product="'+p.id+'" aria-label="Ver detalhes de '+p.name+'">'+arrow+'</button></div></article>').join("");
 observeReveals();
}
function updateFavorites(){
 $("#favoriteCount").textContent=favorites.size;
 $$("[data-favorite]").forEach(b=>{const saved=favorites.has(b.dataset.favorite);b.classList.toggle("saved",saved);b.setAttribute("aria-pressed",saved);const p=products.find(x=>x.id===b.dataset.favorite);b.setAttribute("aria-label",(saved?"Remover ":"Salvar ")+(p?.name||"produto")+" nos favoritos");});
 try{localStorage.setItem("terereco.favorites",JSON.stringify([...favorites]));}catch{}
}
function toggleFavorite(id){const p=products.find(p=>p.id===id);if(!p)return;favorites.has(id)?favorites.delete(id):favorites.add(id);updateFavorites();renderFavorites();toast(favorites.has(id)?"Salvo na sua roda.":"Removido da sua roda.");}
function showDialog(id){const dialog=$("#"+id);if(!dialog.open)dialog.showModal();document.body.classList.add("modal-open");}
function closeDialogs(){ $$("dialog[open]").forEach(d=>d.close());document.body.classList.remove("modal-open");}
$$("dialog").forEach(d=>{d.addEventListener("close",()=>{if(!$("dialog[open]"))document.body.classList.remove("modal-open");});d.addEventListener("click",e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
function openProduct(id){const p=products.find(p=>p.id===id);if(!p)return;closeDialogs();$("#detailContent").innerHTML='<div class="detail-layout"><div class="detail-image" style="background:'+p.tone+'"><img src="/assets/'+p.image+'" alt="'+p.brand+' '+p.name+'"></div><div class="detail-copy"><p class="eyebrow dark">'+p.brand+' / '+p.type.toUpperCase()+'</p><h2 id="detailTitle">'+p.name+'</h2><p>'+p.description+'</p><div class="detail-specs"><span>CATEGORIA<b>'+p.material+'</b></span><span>VERSÃO<b>'+p.detail+'</b></span></div><a class="button lime" href="'+p.source+'" target="_blank" rel="noopener noreferrer">Explorar na fonte '+arrow+'</a><button class="save-detail" data-favorite="'+p.id+'" aria-pressed="'+favorites.has(id)+'">'+(favorites.has(id)?"Salvo na sua roda ♥":"Salvar na minha roda ♡")+'</button><p class="detail-source">Fotografia: '+(p.credit||"Tererédubaum")+'. Confira os detalhes na fonte do produto.</p></div></div>';showDialog("detailDialog");}
function renderFavorites(){const list=$("#favoritesList");const items=products.filter(p=>favorites.has(p.id));list.innerHTML=items.length?items.map(p=>'<div class="favorite-row"><img src="/assets/'+p.image+'" alt="'+p.name+'"><button data-product="'+p.id+'"><h3>'+p.name+'</h3><small>'+p.brand+' · EXPLORAR ↗</small></button><button class="favorite-remove" data-favorite="'+p.id+'" aria-label="Remover '+p.name+' dos favoritos">×</button></div>').join(""):'<p class="empty-favorites">Sua roda começa com uma descoberta.<br>Toque no coração de um produto para guardá-lo aqui.</p>';}
$("#brandGrid").innerHTML=brands.map((b,i)=>'<button class="brand-card reveal" data-brand="'+i+'" aria-label="Conhecer '+b.name+'"><span class="brand-country">'+b.country+' <span>↗</span></span><span class="brand-name '+(b.serif?'serif':'')+'">'+b.name+'</span><span class="brand-tag">'+b.tag+'</span></button>').join("");
function openBrand(index){const b=brands[index];if(!b)return;$("#detailContent").innerHTML='<div class="detail-copy brand-detail"><p class="eyebrow dark">'+b.country+' · NOMES DA NOSSA RODA</p><h2 id="detailTitle">'+b.name+'</h2><p>'+b.description+'</p><div class="detail-specs"><span>UNIVERSO<b>'+b.tag+'</b></span></div><a class="button lime" href="'+b.url+'" target="_blank" rel="noopener noreferrer">Conhecer a marca '+arrow+'</a>'+(b.product?'<button class="save-detail" data-product="'+b.product+'">Explorar produto na curadoria ↗</button>':'')+'</div>';showDialog("detailDialog");}
function startQuiz(){
 closeDialogs();$("#quizContent").innerHTML='<p class="eyebrow dark">ENCONTRE SEU PONTO DE PARTIDA / 01</p><h2 id="quizTitle">Qual é a sua<br><em>vibe de hoje?</em></h2><p class="quiz-intro">Siga seu paladar. Escolha o perfil que mais desperta sua curiosidade.</p><div class="quiz-options"><button class="quiz-option" data-taste="herbal"><div><span>Folha, erva, natureza.</span><small>Quero conhecer um perfil herbal.</small></div><i>↗</i></button><button class="quiz-option" data-taste="citrico"><div><span>Uma pegada cítrica.</span><small>Gosto de explorar sabores de limão.</small></div><i>↗</i></button><button class="quiz-option" data-taste="frutado"><div><span>Um gole frutado.</span><small>Minha curiosidade pede novos sabores.</small></div><i>↗</i></button></div>';showDialog("quizDialog");
}
function quizResult(taste){const map={herbal:"trots",citrico:"chacal",frutado:"black"},p=products.find(p=>p.id===map[taste]);if(!p)return;$("#quizContent").innerHTML='<p class="eyebrow dark">SEU PONTO DE PARTIDA / 02</p><h2 id="quizTitle">Seu próximo<br><em>gole começa aqui.</em></h2><p class="quiz-intro">Uma sugestão de exploração pelo perfil que você escolheu.</p><div class="quiz-product"><img src="/assets/'+p.image+'" alt="'+p.brand+' '+p.name+'"><div><p class="eyebrow dark">'+p.brand+'</p><h3>'+p.name+'</h3><p>'+p.profile+'</p></div></div><button class="button lime" data-product="'+p.id+'">Explorar essa erva '+arrow+'</button><button class="quiz-back" data-open-quiz>← Experimentar outro perfil</button>';}
function setMenu(open){$("#mobileMenu").hidden=!open;$("#menuButton").setAttribute("aria-expanded",open);$("#menuButton").setAttribute("aria-label",open?"Fechar menu":"Abrir menu");document.body.classList.toggle("menu-open",open);document.body.classList.toggle("modal-open",open);}
document.addEventListener("click",e=>{
 const favorite=e.target.closest("[data-favorite]");if(favorite){toggleFavorite(favorite.dataset.favorite);if(favorite.classList.contains("save-detail"))favorite.textContent=favorites.has(favorite.dataset.favorite)?"Salvo na sua roda ♥":"Salvar na minha roda ♡";return;}
 const product=e.target.closest("[data-product]");if(product){openProduct(product.dataset.product);return;}
 const brand=e.target.closest("[data-brand]");if(brand){openBrand(Number(brand.dataset.brand));return;}
 if(e.target.closest("[data-close-dialog]")){closeDialogs();return;}
 if(e.target.closest("[data-open-quiz]")){setMenu(false);startQuiz();return;}
 const taste=e.target.closest("[data-taste]");if(taste){quizResult(taste.dataset.taste);return;}
 const tab=e.target.closest("[data-filter]");if(tab){filter=tab.dataset.filter;$$("[data-filter]").forEach(b=>{b.classList.toggle("active",b===tab);b.setAttribute("aria-pressed",b===tab);});renderProducts();return;}
 if(e.target.closest(".favorites-open")){renderFavorites();showDialog("favoritesDialog");}
});
$("#menuButton").addEventListener("click",()=>setMenu($("#mobileMenu").hidden));
$$("#mobileMenu a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));
document.addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false);});
$("#creditsButton").addEventListener("click",()=>showDialog("creditsDialog"));
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
renderProducts();updateFavorites();observeReveals();runLoader();

