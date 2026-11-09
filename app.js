const $=s=>document.querySelector(s),app=$("#app");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const LS={g:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const SS={g:k=>{try{return sessionStorage.getItem(k)}catch{return window["_"+k]}},s:(k,v)=>{try{sessionStorage.setItem(k,v)}catch{window["_"+k]=v}},d:k=>{try{sessionStorage.removeItem(k)}catch{delete window["_"+k]}}};
let user=SS.g("u"),D=LS.g("c2_datos",{}),A=LS.g("c2_resp",{}),last=null;
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,"0")).join("");
const hoy=()=>new Date().toLocaleDateString("es-MX");
const nombreArch=d=>"CMASR2_"+d.nombre.normalize("NFD").replace(/[^\w]+/g,"_")+"_"+new Date().toISOString().slice(0,10)+".pdf";
function bajar(bytes,name,type="application/pdf"){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([bytes],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
function go(v,x){window.scrollTo(0,0);({login,home,datos,test,result,hist})[v](x)}
function hdr(t,back){return `<header class="top"><b>CMASR-2</b><span>${t}</span>${user?`<button class="ghost" id="out">Salir</button>`:""}</header>`}
function bindOut(){const o=$("#out");if(o)o.onclick=()=>{SS.d("u");user=null;go("login")}}
function login(){app.innerHTML=`<main class="login"><h1>CMASR-2</h1><p class="sub">Escala de Ansiedad Manifiesta en Niños-Revisada 2</p>
<form id="f"><label>Usuario<input id="u" autocomplete="username" autocapitalize="none" required></label><label>Contraseña<input id="p" type="password" autocomplete="current-password" required></label><p class="err" id="e" role="alert"></p><button class="pri">Entrar</button></form></main>`;
 $("#f").onsubmit=async e=>{e.preventDefault();const u=$("#u").value.trim().toLowerCase();if(DATA.H[u]&&DATA.H[u]===await sha($("#p").value)){user=u;SS.s("u",u);go("home")}else $("#e").textContent="Usuario o contraseña incorrectos."}}
function home(){const n=Object.keys(A).length;app.innerHTML=hdr("Inicio")+`<main><h2>Hola, ${esc(user[0].toUpperCase()+user.slice(1))}</h2>
${n||D.nombre?`<section class="box"><p>Tienes una evaluación sin terminar${D.nombre?" de <b>"+esc(D.nombre)+"</b>":""} (${n}/49 respuestas).</p><button class="pri" id="cont">Continuar</button> <button class="ghost" id="desc">Descartar</button></section>`:""}
<button class="pri big" id="nuevo">Nueva evaluación</button><button class="sec big" id="h">Evaluaciones guardadas (${LS.g("c2_hist",[]).length})</button></main>`;bindOut();
 $("#nuevo").onclick=()=>{if(n&&!confirm("Se descartará la evaluación sin terminar. ¿Continuar?"))return;D={};A={};LS.s("c2_datos",D);LS.s("c2_resp",A);go("datos")};
 $("#h").onclick=()=>go("hist");
 if($("#cont"))$("#cont").onclick=()=>go(D.nombre&&D.edad&&D.sexo?"test":"datos");
 if($("#desc"))$("#desc").onclick=()=>{D={};A={};LS.s("c2_datos",D);LS.s("c2_resp",A);home()}}
function datos(){const ed=[...Array(14)].map((_,i)=>i+6);
 app.innerHTML=hdr("Datos generales")+`<main><h2>Datos generales</h2><p class="sub">Se integran al informe en PDF. La edad y el sexo determinan el baremo.</p>
<form id="f"><label>Nombre y apellido<input id="n" value="${esc(D.nombre)}" required></label>
<label>Edad<select id="e" required><option value="">Selecciona…</option>${ed.map(x=>`<option value="${x}" ${D.edad==x?"selected":""}>${x} años</option>`).join("")}</select></label>
<label>Sexo<select id="s" required><option value="">Selecciona…</option>${["Femenino","Masculino"].map(x=>`<option ${D.sexo==x?"selected":""}>${x}</option>`).join("")}</select></label>
<label>Grado escolar<input id="g" list="gl" value="${esc(D.grado)}" placeholder="Ej. Secundaria 2.º"><datalist id="gl"><option>Primaria</option><option>Secundaria</option><option>Bachillerato</option></datalist></label>
<label>Fecha de aplicación<input id="d" value="${esc(D.fecha||hoy())}" required></label><p class="hint" id="b"></p>
<button class="pri">Continuar a las preguntas</button> <button type="button" class="ghost" id="x">Cancelar</button></form></main>`;bindOut();
 const bar=()=>{const e=+$("#e").value,s=$("#s").value;$("#b").textContent=e&&s?"Baremo: "+s+" "+CORE.bareKey(s,e).slice(2).replace("-"," a ")+" años":""};$("#e").onchange=$("#s").onchange=bar;bar();
 $("#x").onclick=()=>go("home");
 $("#f").onsubmit=e=>{e.preventDefault();D={nombre:$("#n").value.trim(),edad:+$("#e").value,sexo:$("#s").value,grado:$("#g").value.trim(),fecha:$("#d").value.trim()};LS.s("c2_datos",D);go("test")}}
function test(){
 app.innerHTML=hdr(esc(D.nombre))+`<div class="prog"><div id="bar"></div><span id="cnt"></span></div><main class="q"><p class="sub">Marca la respuesta de cada reactivo (Sí / No), como en la hoja de respuestas.</p>
${DATA.Q.map((q,i)=>`<div class="row" id="r${i+1}"><span class="no">${i+1}</span><span class="tx">${esc(q.trim())}</span><span class="bt"><button data-n="${i+1}" data-v="S" aria-label="Sí, pregunta ${i+1}">Sí</button><button data-n="${i+1}" data-v="N" aria-label="No, pregunta ${i+1}">No</button></span></div>`).join("")}
<div class="foot"><p id="msg" class="hint"></p><button class="pri big" id="fin">Finalizar y descargar PDF</button><button class="ghost" id="datosb">Editar datos generales</button></div></main>`;bindOut();
 const pint=()=>{let c=0;for(let n=1;n<=49;n++){if(A[n])c++;document.querySelectorAll(`#r${n} button`).forEach(b=>b.setAttribute("aria-pressed",b.dataset.v==A[n]))}$("#cnt").textContent=c+" / 49";$("#bar").style.width=c/49*100+"%";$("#msg").textContent=c<49?"Faltan "+(49-c)+" respuestas. Revisar respuestas.":"Todas las respuestas contestadas.";return c};
 app.onclick=e=>{const b=e.target.closest("button[data-n]");if(!b)return;A[b.dataset.n]=b.dataset.v;LS.s("c2_resp",A);document.querySelectorAll(".miss").forEach(x=>x.classList.remove("miss"));pint()};
 $("#datosb").onclick=()=>go("datos");pint();
 $("#fin").onclick=()=>{if(pint()<49){const m=[...Array(49)].map((_,i)=>i+1).filter(n=>!A[n]);m.forEach(n=>$("#r"+n).classList.add("miss"));$("#r"+m[0]).scrollIntoView({block:"center"});return}
  const r=CORE.score(A,D.sexo,D.edad);r.ans=[...Array(49)].map((_,i)=>A[i+1]);
  const h=LS.g("c2_hist",[]);h.unshift({id:Date.now(),user,datos:D,ans:r.ans,guardado:new Date().toISOString()});LS.s("c2_hist",h);
  D0=D;A0=A;D={};A={};LS.s("c2_datos",D);LS.s("c2_resp",A);
  go("result",{r,d:D0,pdf:true})}}
let D0,A0;
function result({r,d,pdf}){const N=CORE.NOM;
 app.innerHTML=hdr("Resultados")+`<main><h2>${esc(d.nombre)}</h2><p class="sub">${d.edad} años · ${d.sexo} · ${esc(d.grado||"")} · ${esc(d.fecha)} · Baremo ${r.bk.slice(2).replace("-"," a ")}</p>
<table><thead><tr><th>Escala</th><th>PD</th><th>PT</th><th>PC</th><th>Categoría</th></tr></thead><tbody>${CORE.ORD.map(k=>`<tr><td>${N[k]}</td><td>${r.pd[k]}</td><td>${r.ptf[k]}</td><td>${r.pc[k]??"—"}</td><td><span class="chip c${r.cats[k]}">${r.cats[k]}</span></td></tr>`).join("")}<tr><td>Inconsistencia</td><td>${r.inc}</td><td>—</td><td>—</td><td><span class="chip ${r.valido?"cBajo":"cElevado"}">${r.valido?"Válido":"Inválido"}</span></td></tr></tbody></table>
<h3>Interpretación</h3>${CORE.ORD.map(k=>`<p><b>${N[k]}:</b> ${esc(r.tx[k])}${r.nota[k]?`<br><small class="sub">${esc(r.nota[k])}</small>`:""}</p>`).join("")}<h3>Interpretación general</h3><p>${esc(r.nar(d.nombre))}</p>
<div class="foot"><button class="pri big" id="pdf">Descargar PDF</button><button class="sec big" id="ok">Terminar</button></div></main>`;bindOut();
 const dl=()=>bajar(REPORT(r,d,user[0].toUpperCase()+user.slice(1)),nombreArch(d));$("#pdf").onclick=dl;$("#ok").onclick=()=>go("home");if(pdf)setTimeout(dl,300)}
function hist(){const h=LS.g("c2_hist",[]);
 app.innerHTML=hdr("Guardadas")+`<main><h2>Evaluaciones guardadas</h2><p class="sub">Se guardan solo en este dispositivo.</p>${h.length?h.map((e,i)=>`<div class="row h"><span class="tx"><b>${esc(e.datos.nombre)}</b><br><small>${esc(e.datos.fecha)} · ${e.datos.edad} años · ${e.datos.sexo} · aplicó ${esc(e.user)}</small></span><span class="bt"><button data-o="${i}">PDF</button><button data-x="${i}">Borrar</button></span></div>`).join(""):"<p>Aún no hay evaluaciones.</p>"}
<div class="foot">${h.length?`<button class="sec" id="csv">Exportar a CSV (Excel)</button>`:""}<button class="ghost" id="b">Volver</button></div></main>`;bindOut();$("#b").onclick=()=>go("home");
 app.onclick=e=>{const o=e.target.dataset.o,x=e.target.dataset.x;if(o!=null){const t=h[o],r=CORE.score(Object.fromEntries(t.ans.map((a,i)=>[i+1,a])),t.datos.sexo,t.datos.edad);r.ans=t.ans;bajar(REPORT(r,t.datos,t.user[0].toUpperCase()+t.user.slice(1)),nombreArch(t.datos))}
  if(x!=null&&confirm("¿Borrar esta evaluación?")){h.splice(x,1);LS.s("c2_hist",h);hist()}};
 if($("#csv"))$("#csv").onclick=()=>{const K=CORE.ORD,hd=["Nombre","Edad","Sexo","Grado","Fecha","Aplicó",...K.flatMap(k=>[k+" PD",k+" PT",k+" PC",k+" Cat"]),"INC","Válido"];
  const rows=h.map(t=>{const r=CORE.score(Object.fromEntries(t.ans.map((a,i)=>[i+1,a])),t.datos.sexo,t.datos.edad);return[t.datos.nombre,t.datos.edad,t.datos.sexo,t.datos.grado,t.datos.fecha,t.user,...K.flatMap(k=>[r.pd[k],r.pt[k],r.pc[k],r.cats[k]]),r.inc,r.valido?"Sí":"No"]});
  bajar("\ufeff"+[hd,...rows].map(r=>r.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(",")).join("\r\n"),"CMASR2_evaluaciones.csv","text/csv;charset=utf-8")}}
go(user?"home":"login");
/*SW*/if("serviceWorker"in navigator&&location.protocol.startsWith("http")){const had=!!navigator.serviceWorker.controller;let rl=false;navigator.serviceWorker.addEventListener("controllerchange",()=>{if(had&&!rl){rl=true;location.reload()}});
addEventListener("load",()=>navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).then(r=>{r.update();document.addEventListener("visibilitychange",()=>{if(!document.hidden)r.update()})}))}/*ENDSW*/
