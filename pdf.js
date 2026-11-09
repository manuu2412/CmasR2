(function(g){
const M={8212:151,8211:150,8220:147,8221:148,8217:146,8216:145,8226:149,8230:133};
const en=c=>c<256?c:(M[c]||63);
function PDF(){
  const pages=[];let c,y;const W=DATA.W,fn={n:"Helvetica",b:"Helvetica-Bold"};
  const tw=(s,f,z)=>{let w=0;for(const h of s)w+=W[fn[f]][en(h.charCodeAt(0))-32]||500;return w*z/1000};
  const esc=s=>{let o="";for(const h of s){const k=en(h.charCodeAt(0));o+=(k==40||k==41||k==92?"\\":"")+String.fromCharCode(k)}return o};
  const col=h=>[1,3,5].map(i=>(parseInt(h.slice(i,i+2),16)/255).toFixed(3)).join(" ");
  const np=()=>{c=[];pages.push(c);y=48};
  const wrap=(s,f,z,mw)=>{const o=[];for(const p of String(s).split("\n")){let l="";for(const w of p.split(/\s+/)){const t=l?l+" "+w:w;if(tw(t,f,z)>mw&&l){o.push(l);l=w}else l=t}o.push(l)}return o};
  const P={
    np,get y(){return y},set y(v){y=v},
    need(h){if(y+h>790)np()},
    text(x,yy,s,f="n",z=10,k="#17212b"){c.push(`BT /${f=="b"?"F2":"F1"} ${z} Tf ${col(k)} rg ${x} ${(842-yy).toFixed(1)} Td (${esc(s)}) Tj ET`)},
    rect(x,yy,w,h,k){c.push(`${col(k)} rg ${x} ${(842-yy-h).toFixed(1)} ${w} ${h} re f`)},
    line(x1,y1,x2,k="#c5d0d6"){c.push(`${col(k)} RG 0.5 w ${x1} ${(842-y1).toFixed(1)} m ${x2} ${(842-y1).toFixed(1)} l S`)},
    para(s,{x=40,w=515,f="n",z=10,k="#17212b",lh=1.35,gap=4}={}){for(const l of wrap(s,f,z,w)){P.need(z*lh);y+=z*lh;P.text(x,y-z*.25,l,f,z,k)}y+=gap},
    h(s){P.need(30);y+=10;P.text(40,y+10,s,"b",12,"#00596a");y+=15;P.line(40,y,555,"#00798c");y+=6},
    row(cells,xs,{f="n",z=9.5,bg,k}={}){const ls=cells.map((t,i)=>wrap(t,f,z,xs[i+1]-xs[i]-8));const hh=Math.max(...ls.map(l=>l.length))*z*1.3+7;P.need(hh);if(bg)P.rect(40,y,515,hh,bg);ls.forEach((l,i)=>l.forEach((t,j)=>P.text(xs[i]+4,y+z+3+j*z*1.3,t,f,z,k)));y+=hh;P.line(40,y,555)},
    out(foot){
      const n=pages.length,o=[];let ob=[];const add=s=>{ob.push(s);return ob.length};
      add("<< /Type /Catalog /Pages 2 0 R >>");add("");add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
      const kids=[];
      pages.forEach((pc,i)=>{const s=pc.join("\n")+`\nBT /F1 8 Tf 0.4 0.45 0.5 rg 40 24 Td (${esc(foot+"  ·  Página "+(i+1)+" de "+n)}) Tj ET`;
        const ci=add(`<< /Length ${s.length} >>\nstream\n${s}\nendstream`);const pi=add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${ci} 0 R >>`);kids.push(pi+" 0 R")});
      ob[1]=`<< /Type /Pages /Count ${n} /Kids [${kids.join(" ")}] >>`;
      let s="%PDF-1.4\n",offs=[];ob.forEach((b,i)=>{offs.push(s.length);s+=`${i+1} 0 obj\n${b}\nendobj\n`});
      const x=s.length;s+=`xref\n0 ${ob.length+1}\n0000000000 65535 f \n`+offs.map(o=>String(o).padStart(10,"0")+" 00000 n \n").join("")+`trailer\n<< /Size ${ob.length+1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`;
      const u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i)&255;return u}
  };np();return P}
function report(r,d,user){
  const p=PDF(),N=CORE.NOM,Q=DATA.Q;
  p.rect(0,0,595,78,"#00596a");p.text(40,36,"CMASR-2 · Informe de resultados","b",20,"#ffffff");p.text(40,58,"Escala de Ansiedad Manifiesta en Niños-Revisada 2","n",10.5,"#cfe6ea");p.y=96;
  p.h("Datos generales");
  const f=[["Nombre y apellido",d.nombre],["Edad",d.edad+" años"],["Sexo",d.sexo],["Grado escolar",d.grado||"—"],["Fecha de aplicación",d.fecha],["Baremo aplicado",(d.sexo=="Femenino"?"Femenino ":"Masculino ")+r.bk.slice(2).replace("-"," a ")+" años"],["Aplicó",user]];
  for(let i=0;i<f.length;i+=2){p.need(20);const y=p.y+13;[0,1].forEach(j=>{const e=f[i+j];if(e){p.text(40+j*265,y,e[0]+":","b",9.5,"#4a5b66");p.text(40+j*265+(j?92:110),y,e[1],"n",10)}});p.y+=18}
  p.h("Resultados y calificación");
  const xs=[40,190,250,310,370,555];
  p.row(["Escala","PD","PT","PC","Categoría Dx"],xs,{f:"b",bg:"#e3eef0"});
  CORE.ORD.forEach(k=>p.row([N[k],r.pd[k],r.pt[k]??"—",r.pc[k]??"—",r.cats[k]],xs));
  p.row(["Inconsistencia",r.inc,"—","—","El test es "+(r.valido?"válido":"inválido")],xs);
  p.para("PD = puntuación directa · PT = puntuación T · PC = percentil. Categoría: Bajo (PT hasta 40), Leve (41–50), Moderado (51–60), Elevado (61 o más). El test es inválido con 6 o más pares inconsistentes.",{z:8,k:"#4a5b66",gap:2});
  p.h("Interpretación por escala");
  CORE.ORD.forEach(k=>{p.need(34);p.para(N[k]+" — PT "+(r.pt[k]??"—")+" ("+r.cats[k]+")",{f:"b",gap:0});p.para(r.tx[k].replace(/^./,c=>c.toUpperCase()),{gap:5})});
  p.h("Interpretación general");p.para(r.nar(d.nombre),{lh:1.45});
  p.h("Reactivos con indicador por escala");
  ["DEF","FIS","INQ","SOC"].forEach(k=>{p.need(28);p.para(N[k]+" ("+r.items[k].length+")",{f:"b",gap:1});if(!r.items[k].length)p.para("Ninguno.",{x:52,w:500,z:9,gap:3});r.items[k].forEach(([n,a])=>p.para(n+". "+Q[n-1].replace(/^\s+/,"")+" ("+a+")",{x:52,w:500,z:9,gap:0,lh:1.25}));p.y+=4});
  p.h("Pares reactivos de inconsistencia");
  const x2=[40,110,420,555];p.row(["Par","Respuestas","¿Inconsistente?"],x2,{f:"b",bg:"#e3eef0"});
  r.pares.forEach(q=>p.row([q.x+" y "+q.y,q.x+": "+(q.rx=="S"?"Sí":q.rx=="N"?"No":"—")+"   "+q.y+": "+(q.ry=="S"?"Sí":q.ry=="N"?"No":"—"),q.inc?"Sí":"No"],x2));
  p.h("Hoja de respuestas");
  p.para(r.ans.map((a,i)=>(i+1)+":"+(a=="S"?"Sí":"No")).join("   "),{z:9,lh:1.6});
  return p.out("Basado en el Excel automatizado del CMASR-2 (Edgar Espinoza Jiménez)")}
g.REPORT=report;if(typeof module!="undefined")module.exports=report;
})(typeof window!="undefined"?window:globalThis);
