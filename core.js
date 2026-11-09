(function(g){
const SC={DEF:{si:[14,19,24,29,33,38],no:[40,44,48]},FIS:{si:[1,5,7,8,11,13,15,16,18,25,27,28,31,34,36,39,42,43,47]},INQ:{si:[2,12,20,21,30,35,40,44,46,48]},SOC:{si:[3,4,6,9,10,17,22,23,26,32,37,41,45,49]}};
const PARES=[[2,8],[3,35],[4,10],[6,49],[7,39],[19,33],[23,37],[24,29],[38,48]];
const NOM={DEF:"Defensividad",FIS:"Ansiedad Fisiológica",INQ:"Inquietud",SOC:"Ansiedad Social",TOT:"Ansiedad Total"};
const ORD=["DEF","FIS","INQ","SOC","TOT"];
const cat=p=>p==null?"—":p<=40?"Bajo":p<=50?"Leve":p<=60?"Moderado":"Elevado";
const txt=(s,p)=>p==null?"Sin dato en el baremo.":DATA.T[s][p<=40?0:p<=50?1:p<=60?2:3];
const bareKey=(sexo,edad)=>(sexo[0]=="F"?"F_":"M_")+(edad<=8?"6-8":edad<=14?"9-14":"15-19");
function score(a,sexo,edad){ // a[1..49] = "S" | "N"
  const si=n=>a[n]=="S"?1:0,no=n=>a[n]=="N"?1:0,sum=(l,f)=>l.reduce((t,n)=>t+f(n),0);
  const items={},pd={};
  for(const k in SC){const s=SC[k];
    items[k]=[...s.si.filter(n=>si(n)).map(n=>[n,"Sí"]),...(s.no||[]).filter(n=>no(n)).map(n=>[n,"No"])].sort((x,y)=>x[0]-y[0]);
    pd[k]=items[k].length;}
  pd.TOT=pd.FIS+pd.INQ+pd.SOC;
  const pares=PARES.map(([x,y],i)=>{const t=si(x)+si(y);return{x,y,inc:i<8?t==1:t!=1,rx:a[x],ry:a[y]}});
  const inc=pares.filter(p=>p.inc).length,valido=inc<6;
  const bk=bareKey(sexo,edad),pt={},pc={},cats={},tx={};
  for(const k of ORD){const r=DATA.BAR[bk][k][pd[k]]||[null,null];pt[k]=r[0];pc[k]=r[1];cats[k]=cat(r[0]);tx[k]=txt(k,r[0]);}
  const g=k=>tx[k].replace(/^./,c=>c.toLowerCase());
  const nar=n=>`${n} manifiesta una ansiedad general PT ${pt.TOT} ${cats.TOT} que indica ${tx.TOT}, dentro las escalas se puede observar que la Defensividad PT ${pt.DEF} indica que ${g("DEF")}, en la escala de Ansiedad Fisiológica PT ${pt.FIS} indica que ${g("FIS")}, Inquietud PT ${pt.INQ} indica que ${g("INQ")}, Ansiedad Social PT ${pt.SOC} indica que ${g("SOC")} Por último, en la escala de Inconsistencia obtuvo un PD de ${inc}, por lo que el test es ${valido?"válido":"inválido"}.`;
  return{pd,pt,pc,cats,tx,items,pares,inc,valido,bk,nar};
}
g.CORE={score,NOM,ORD,SC,bareKey};
if(typeof module!="undefined")module.exports=g.CORE;
})(typeof window!="undefined"?window:globalThis);
