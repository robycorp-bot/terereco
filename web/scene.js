import * as THREE from "./vendor/three.module.js";
const canvas=document.querySelector("#terereCanvas");
const stage=document.querySelector("#stage");
let renderer;
try{
 renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"high-performance"});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
 renderer.setClearColor(0x000000,0);
 renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.25;
 const scene=new THREE.Scene();
 const camera=new THREE.PerspectiveCamera(34,1,.1,100);
 const mobile=()=>stage.clientWidth<700;
 camera.position.set(5.3,3.6,7.5);camera.lookAt(0,.7,0);
 scene.add(new THREE.HemisphereLight(0xedf6d8,0x173323,2.8));
 function areaLight(color,power,x,y,z){const l=new THREE.DirectionalLight(color,power);l.position.set(x,y,z);scene.add(l);}
 areaLight(0xf4ffdd,4,3,6,5);areaLight(0xeaffb5,2.5,-4,3,-3);areaLight(0xd9f6ff,2,4,2,-2);
 const room=new THREE.Scene();room.background=new THREE.Color(0x68776c);
 for(const [x,y,z,w,h,color] of [[0,5,0,9,5,0xffffff],[-5,1,0,5,7,0xe4f0d7],[5,2,1,4,6,0xffffff],[0,2,-5,6,6,0x869a68],[0,1,5,2,6,0xffffff]]){
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));
  panel.position.set(x,y,z);panel.lookAt(0,0,0);room.add(panel);
 }
 const pmrem=new THREE.PMREMGenerator(renderer);const env=pmrem.fromScene(room,.04);scene.environment=env.texture;pmrem.dispose();
 function proceduralTexture(type){
  const c=document.createElement("canvas");c.width=1024;c.height=1024;const ctx=c.getContext("2d");
  ctx.fillStyle=type==="body"?"#4f653d":"#777777";ctx.fillRect(0,0,1024,1024);
  const img=ctx.getImageData(0,0,1024,1024);
  for(let i=0;i<img.data.length;i+=4){const noise=(Math.random()-.5)*(type==="body"?24:90);img.data[i]+=noise;img.data[i+1]+=noise;img.data[i+2]+=noise;}
  ctx.putImageData(img,0,0);
  if(type==="body"){ctx.fillStyle="#d8e8b4";ctx.textAlign="center";ctx.font="18px Arial";ctx.fillText("DA NATUREZA PARA A RODA",512,720);ctx.font="bold 39px Arial";ctx.fillText("meu terereco.",512,675);ctx.strokeStyle="#b8cb99";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(512,570,15,26,-.5,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(500,596);ctx.lineTo(524,546);ctx.stroke();}
  const tex=new THREE.CanvasTexture(c);if(type==="body")tex.colorSpace=THREE.SRGBColorSpace;return tex;
 }
 const bump=proceduralTexture("noise"),bodyTexture=proceduralTexture("body");
 const bodyMat=new THREE.MeshPhysicalMaterial({map:bodyTexture,color:0xffffff,roughness:.49,metalness:.18,clearcoat:.35,clearcoatRoughness:.3,bumpMap:bump,bumpScale:.018});
 const metal=new THREE.MeshStandardMaterial({color:0xd8ded6,metalness:1,roughness:.2});
 const darkMetal=new THREE.MeshStandardMaterial({color:0x17261b,metalness:.8,roughness:.24});
 const main=new THREE.Group();main.rotation.set(.03,-.6,-.15);scene.add(main);
 const cup=new THREE.Group();main.add(cup);
 const profile=[new THREE.Vector2(.01,-1.3),new THREE.Vector2(.62,-1.3),new THREE.Vector2(.7,-1.25),new THREE.Vector2(.74,-1.16),new THREE.Vector2(.81,-.5),new THREE.Vector2(.93,.7),new THREE.Vector2(.98,1.05),new THREE.Vector2(.99,1.13)];
 const cupBody=new THREE.Mesh(new THREE.LatheGeometry(profile,96),bodyMat);cup.add(cupBody);
 const inner=new THREE.Mesh(new THREE.CylinderGeometry(.94,.67,2.23,96,1,true),new THREE.MeshStandardMaterial({color:0x4c5745,metalness:.7,roughness:.25,side:THREE.BackSide}));inner.position.y=-.025;cup.add(inner);
 function rim(r,t,y,mat=metal){const mesh=new THREE.Mesh(new THREE.TorusGeometry(r,t,12,96),mat);mesh.rotation.x=Math.PI/2;mesh.position.y=y;cup.add(mesh);return mesh;}
 rim(.955,.063,1.12);rim(.73,.035,-1.23,darkMetal);rim(.749,.012,-1.12,metal);
 const base=new THREE.Mesh(new THREE.CylinderGeometry(.695,.67,.08,72),darkMetal);base.position.y=-1.3;cup.add(base);
 const earth=new THREE.Mesh(new THREE.CylinderGeometry(.925,.925,.13,72),new THREE.MeshStandardMaterial({color:0x4b4b27,roughness:1}));earth.position.y=1.015;cup.add(earth);
 const water=new THREE.Mesh(new THREE.CircleGeometry(.905,96),new THREE.MeshPhysicalMaterial({color:0x7a8d54,metalness:.15,roughness:.07,transparent:true,opacity:.88,clearcoat:1,envMapIntensity:1.3}));water.rotation.x=-Math.PI/2;water.position.y=1.09;cup.add(water);
 const chipGeo=new THREE.IcosahedronGeometry(.035,0),chipMat=new THREE.MeshStandardMaterial({color:0x7a7b38,roughness:1});
 const herbs=new THREE.InstancedMesh(chipGeo,chipMat,850);const dummy=new THREE.Object3D();const col=new THREE.Color();
 for(let i=0;i<850;i++){
  const r=Math.sqrt(Math.random())*.88,a=Math.random()*Math.PI*2,x=Math.cos(a)*r,z=Math.sin(a)*r;
  const bank=(x+.9)*.12;
  dummy.position.set(x,1.08+bank+Math.random()*.055,z);dummy.rotation.set(Math.random()*2,Math.random()*6,Math.random()*2);dummy.scale.set(.35+Math.random()*1.8,.25+Math.random()*.6,Math.random()*1.5+.5);dummy.updateMatrix();herbs.setMatrixAt(i,dummy.matrix);col.setHSL(.15+Math.random()*.08,.27+Math.random()*.22,.15+Math.random()*.18);herbs.setColorAt(i,col);
 }cup.add(herbs);
 const straw=new THREE.Group();cup.add(straw);
 const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(.4,-.65,.2),new THREE.Vector3(.4,.6,.2),new THREE.Vector3(.46,1.6,.2),new THREE.Vector3(.72,2.65,.17),new THREE.Vector3(1.02,3.05,.1)]);
 const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,80,.055,14,false),metal);straw.add(tube);
 const filterMesh=new THREE.Mesh(new THREE.SphereGeometry(.16,18,12),darkMetal);filterMesh.scale.set(.7,1.7,.45);filterMesh.position.set(.4,-.65,.2);straw.add(filterMesh);
 const tip=new THREE.Mesh(new THREE.CylinderGeometry(.074,.06,.27,18),metal);tip.scale.z=.45;tip.position.set(1.02,3.04,.1);tip.rotation.z=-.58;straw.add(tip);
 const hole=new THREE.Mesh(new THREE.CircleGeometry(.054,20),new THREE.MeshBasicMaterial({color:0x1c261e}));hole.scale.set(1,.4,1);hole.position.set(1.09,3.15,.11);hole.rotation.x=-Math.PI/2;hole.rotation.y=-.58;straw.add(hole);
 for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(.059,.01,8,20),darkMetal);ring.position.set(.47+i*.015,1.66+i*.065,.2);ring.rotation.x=Math.PI/2;ring.rotation.y=-.18;straw.add(ring);}
 const dropMat=new THREE.MeshPhysicalMaterial({color:0x9bac89,transparent:true,opacity:.36,roughness:.02,metalness:.15,clearcoat:1,envMapIntensity:1.5});
 const drops=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),dropMat,130);
 for(let i=0;i<130;i++){const y=Math.random()*2.1-1.08;const a=Math.random()*Math.PI*2,r=.75+(y+1.2)*.096;dummy.position.set(Math.cos(a)*r,y,Math.sin(a)*r);const size=.007+Math.random()*.022;dummy.scale.set(size,size*(.8+Math.random()*.5),size*.6);dummy.rotation.set(0,-a,0);dummy.updateMatrix();drops.setMatrixAt(i,dummy.matrix);}cup.add(drops);
 const iceMat=new THREE.MeshPhysicalMaterial({color:0xccebd7,metalness:.1,roughness:.12,transparent:true,opacity:.37,clearcoat:1,envMapIntensity:1.7});
 const iceShape=new THREE.Shape();iceShape.moveTo(-.11,-.15);iceShape.lineTo(.11,-.15);iceShape.quadraticCurveTo(.15,-.15,.15,-.11);iceShape.lineTo(.15,.11);iceShape.quadraticCurveTo(.15,.15,.11,.15);iceShape.lineTo(-.11,.15);iceShape.quadraticCurveTo(-.15,.15,-.15,.11);iceShape.lineTo(-.15,-.11);iceShape.quadraticCurveTo(-.15,-.15,-.11,-.15);
 const iceGeometry=new THREE.ExtrudeGeometry(iceShape,{depth:.24,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.025,bevelThickness:.025});iceGeometry.center();
 const floating=[];
 for(let i=0;i<4;i++){const ice=new THREE.Mesh(iceGeometry,iceMat);ice.scale.setScalar(.85+Math.random()*.5);ice.position.set(-1.9+Math.random()*3.7,Math.random()*2.7-1.1,(Math.random()-.5)*2.8);ice.rotation.set(Math.random()*2,Math.random()*2,.4);scene.add(ice);floating.push({mesh:ice,y:ice.position.y,phase:i*1.6});}
 const leafShape=new THREE.Shape();leafShape.moveTo(0,0);leafShape.bezierCurveTo(.39,.2,.43,.78,0,1.35);leafShape.bezierCurveTo(-.43,.78,-.39,.2,0,0);
 const leafGeo=new THREE.ShapeGeometry(leafShape,14);const vertices=leafGeo.attributes.position;
 for(let i=0;i<vertices.count;i++)vertices.setZ(i,Math.sin(vertices.getY(i)*2)*.08+Math.abs(vertices.getX(i))*.2);vertices.needsUpdate=true;leafGeo.computeVertexNormals();
 const leafMat=new THREE.MeshPhysicalMaterial({color:0x477a28,roughness:.4,clearcoat:.28,side:THREE.DoubleSide});
 for(let i=0;i<5;i++){const leaf=new THREE.Group();const face=new THREE.Mesh(leafGeo,leafMat);leaf.add(face);const vein=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0,0,.005),new THREE.Vector3(0,.65,.083),new THREE.Vector3(0,1.35,.035)]),12,.006,5),new THREE.MeshStandardMaterial({color:0xa7bd69,roughness:.8}));leaf.add(vein);leaf.position.set(i%2?2.1:-2.3,(i*.93)%3.6-.9,-.5-i*.1);leaf.rotation.set(.2+i*.3,Math.sin(i)*.7,i*.9-1.2);leaf.scale.setScalar(.42+Math.random()*.3);scene.add(leaf);floating.push({mesh:leaf,y:leaf.position.y,phase:4+i});}
 const dustGeo=new THREE.BufferGeometry();const dustPos=new Float32Array(150*3);for(let i=0;i<dustPos.length;i++)dustPos[i]=(Math.random()-.5)*11;dustGeo.setAttribute("position",new THREE.BufferAttribute(dustPos,3));const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xd4eb9f,size:.017,transparent:true,opacity:.4,sizeAttenuation:true}));scene.add(dust);
 const c=document.createElement("canvas");c.width=c.height=128;const cx=c.getContext("2d"),grad=cx.createRadialGradient(64,64,1,64,64,64);grad.addColorStop(0,"rgba(0,0,0,.5)");grad.addColorStop(1,"rgba(0,0,0,0)");cx.fillStyle=grad;cx.fillRect(0,0,128,128);
 const shadow=new THREE.Mesh(new THREE.PlaneGeometry(3.5,3.5),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,opacity:.6,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.set(0,-1.6,0);scene.add(shadow);
 let targetY=-.6,targetX=.03,dragging=false,startX=0,lastX=0,scrollStart=0,auto=true;
 let paused=matchMedia("(prefers-reduced-motion: reduce)").matches,visible=true;
 canvas.addEventListener("pointerdown",e=>{dragging=true;startX=lastX=e.clientX;scrollStart=e.clientY;auto=false;canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener("pointermove",e=>{if(!dragging)return;targetY+=(e.clientX-lastX)*.012;lastX=e.clientX;targetX=THREE.MathUtils.clamp(.03+(e.clientY-scrollStart)*.002,-.25,.25);});
 function endDrag(){dragging=false;targetX=.03;}
 canvas.addEventListener("pointerup",endDrag);canvas.addEventListener("pointercancel",endDrag);
 canvas.addEventListener("keydown",e=>{if(["ArrowLeft","ArrowRight","Home"].includes(e.key)){e.preventDefault();auto=false;if(e.key==="Home")targetY=-.6;else targetY+=e.key==="ArrowRight"?.3:-.3;}});
 document.querySelector("#sceneReset").addEventListener("click",()=>{targetY=-.6;targetX=.03;auto=true;});
 document.querySelectorAll("[data-material]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-material]").forEach(x=>{x.classList.toggle("active",x===b);x.setAttribute("aria-pressed",x===b);});const m=b.dataset.material;bodyMat.map=m==="olive"?bodyTexture:null;bodyMat.color.set(m==="leather"?0x9e6840:m==="steel"?0xb8c4b9:0xffffff);bodyMat.metalness=m==="steel"?.92:m==="leather"?.03:.18;bodyMat.roughness=m==="steel"?.22:m==="leather"?.75:.49;bodyMat.bumpScale=m==="leather"?.033:.01;bodyMat.needsUpdate=true;}));
 window.addEventListener("terereco-motion",e=>paused=e.detail.paused);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:0}).observe(stage);
 const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=mobile()?37:34;const distance=mobile()?1.13:1;camera.position.set(5.3*distance,3.6*distance,7.5*distance);camera.lookAt(0,.75,0);camera.updateProjectionMatrix();};
 new ResizeObserver(resize).observe(stage);resize();
 let time=0,last=0;
 function frame(now){requestAnimationFrame(frame);if(!visible||document.hidden){last=now;return;}const dt=Math.min((now-last)/1000,.05);last=now;if(!paused)time+=dt;
  if(!paused&&auto&&!dragging)targetY=-.6+Math.sin(time*.23)*.28;
  main.rotation.y+=(targetY-main.rotation.y)*.075;main.rotation.x+=(targetX-main.rotation.x)*.075;
  main.position.y=paused?0:Math.sin(time*.8)*.085;
  if(!paused){for(const f of floating){f.mesh.position.y=f.y+Math.sin(time*.7+f.phase)*.12;f.mesh.rotation.y+=dt*.12;}dust.rotation.y=time*.014;water.material.opacity=.84+Math.sin(time*1.7)*.04;}
  renderer.render(scene,camera);
 }
 requestAnimationFrame(frame);renderer.render(scene,camera);
 document.documentElement.classList.add("scene-ready");window.tererecoSceneReady=true;window.dispatchEvent(new Event("terereco-scene-ready"));
 canvas.addEventListener("webglcontextlost",e=>{e.preventDefault();document.documentElement.classList.remove("scene-ready");document.querySelector("#sceneHint").textContent="FOTOGRAFIA DO PRODUTO REAL";});
}catch(error){
 console.warn("A visualização 3D não pôde ser iniciada:",error);
 document.querySelector("#sceneHint").textContent="FOTOGRAFIA DO PRODUTO REAL";canvas.style.display="none";window.tererecoSceneReady=true;window.dispatchEvent(new Event("terereco-scene-ready"));
}

