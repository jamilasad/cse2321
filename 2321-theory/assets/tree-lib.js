/* ==========================================================================
   CSE-2321 · the forest pages (Segment 7, trees)
   --------------------------------------------------------------------------
   The tree engine: parse "A(B(D,E(F,-)),C)", lay it out by inorder or by
   array position, draw it once as SVG, then change only class names.
   Linked after sim.css/sim.js by every page in 08-trees-and-heaps/. Bump the
   ?v= on every tree page when this file changes, as for the shell.
   ========================================================================== */
window.TreeLib=(function(){
"use strict";
/* =================== THE TREE ENGINE ===================
   A tree is written as nested text, "A(B(D,E(F,-)),C)": a node, then its left
   and right subtrees in brackets, "-" for an empty one. The drawing is built
   once per tree; a step only changes class names, so nothing is rebuilt and
   nothing jumps. Two layouts: by inorder (any tree; no two nodes can collide)
   and by array position (2K, 2K + 1), which shows the gaps.            */
var NS='http://www.w3.org/2000/svg';
function sv(tag,at,par){ var e=document.createElementNS(NS,tag); for(var k in at) e.setAttribute(k,at[k]); if(par) par.appendChild(e); return e; }
function parseT(s){
  s=s.replace(/\s+/g,''); var i=0, id=0;
  function node(){
    /* "-" is an empty subtree only where a subtree ends; "-#5" is a minus sign */
    if(s.charAt(i)==='-' && (i+1>=s.length || s.charAt(i+1)===',' || s.charAt(i+1)===')')){ i++; return null; }
    var m=/^[^(),]+/.exec(s.slice(i)), n={k:m[0],l:null,r:null,id:'n'+(id++)};
    i+=m[0].length;
    if(s.charAt(i)==='('){ i++; n.l=node(); i++; n.r=node(); i++; }
    return n;
  }
  return node();
}
function index(t){
  var all=[], ino=[];
  (function w(n,lv,par,pos){ if(!n) return; n.lv=lv; n.par=par; n.pos=pos; all.push(n);
    w(n.l,lv+1,n,pos*2); w(n.r,lv+1,n,pos*2+1); })(t,0,null,1);
  (function w(n){ if(!n) return; w(n.l); ino.push(n); w(n.r); })(t);
  ino.forEach(function(n,k){ n.ix=k; });
  return all;
}
function depthOf(t){ return t?1+Math.max(depthOf(t.l),depthOf(t.r)):0; }
function under(n){ var a=[]; (function w(x){ if(!x) return; a.push(x); w(x.l); w(x.r); })(n); return a; }

function drawTree(host,spec,opt){
  opt=opt||{};
  var t=parseT(spec), all=index(t), d=depthOf(t);
  var R=opt.r||19, YG=opt.yg||60, MX=opt.mx||(opt.levels?80:(opt.stumps?72:26)), MY=R+12, W, x, y;
  if(opt.layout==='pos'){
    var slots=Math.pow(2,(opt.ghost||d)-1);
    W=opt.w||Math.max(2*MX+slots*(opt.slot||2*R+10), 240);
    x=function(p){ var L=Math.floor(Math.log(p)/Math.LN2), k=Math.pow(2,L); return MX+(p-k+.5)*((W-2*MX)/k); };
    y=function(p){ return MY+Math.floor(Math.log(p)/Math.LN2)*YG; };
  } else {
    var XG=opt.xg||44;
    W=2*MX+(all.length-1)*XG;
    x=function(n){ return MX+n.ix*XG; };
    y=function(n){ return MY+n.lv*YG; };
  }
  var depthDrawn=opt.layout==='pos' ? (opt.ghost||d) : d;
  var H=MY+(depthDrawn-1)*YG+R+(opt.posLabels?30:14)+(opt.stumps?26:0)+(opt.padB||0);
  var svg=sv('svg',{viewBox:'0 0 '+W+' '+H,width:W,height:H,role:'img','aria-label':opt.label||'A binary tree'});
  svg.style.setProperty('--fw',Math.round(W*1.7)+'px');
  svg.style.minWidth=Math.round(W*0.62)+'px';
  var gB=sv('g',{},svg), gG=sv('g',{},svg), gE=sv('g',{},svg), gN=sv('g',{},svg);   /* outline under the real edges */
  var V={svg:svg,t:t,all:all,depth:d,node:{},edge:{},lvl:[],band:[],ghost:{},plab:{},byKey:{},W:W,H:H,R:R,YG:YG,xy:{}};
  function px(n){ return opt.layout==='pos'?x(n.pos):x(n); }
  function py(n){ return opt.layout==='pos'?y(n.pos):y(n); }
  if(opt.levels){
    for(var L=0;L<d;L++){
      V.band.push(sv('rect',{'class':'tv-band',x:4,y:MY+L*YG-R-4,width:W-8,height:2*R+8,rx:10},gB));
      var lt=sv('text',{'class':'tv-lvl',x:MX-R-8,y:MY+L*YG},gB); lt.textContent='level '+L; V.lvl.push(lt);
    }
  }
  if(opt.layout==='pos' && opt.ghost){
    var top=Math.pow(2,opt.ghost)-1;
    for(var p=1;p<=top;p++){
      var gx=x(p), gy=y(p);
      if(p>1) sv('line',{'class':'tv-edx',x1:x(Math.floor(p/2)),y1:y(Math.floor(p/2)),x2:gx,y2:gy},gG);
      V.ghost[p]=sv('circle',{'class':'tv-ghost',cx:gx,cy:gy,r:R},gG);
      if(opt.posLabels){ var tl=sv('text',{'class':'tv-pos',x:gx,y:gy+R+11},gG); tl.textContent=p; V.plab[p]=tl; }
    }
  }
  all.forEach(function(n){
    if(n.par) V.edge[n.id]=sv('line',{'class':'tv-ed',x1:px(n.par),y1:py(n.par),x2:px(n),y2:py(n)},gE);
    var g=sv('g',{'class':'tv-nd'},gN);
    sv('circle',{'class':'o',cx:px(n),cy:py(n),r:R},g);
    sv('circle',{'class':'i',cx:px(n),cy:py(n),r:R-5},g);
    /* a key may carry "#n" to stay unique (an expression repeats its operators); only the label shows */
    var lab=n.k.replace(/#.*$/,''); if(lab==='-') lab='\u2212';
    var tx=sv('text',{x:px(n),y:py(n)},g); tx.textContent=lab;
    V.node[n.id]=g; V.byKey[n.k]=n; V.xy[n.k]=[px(n),py(n)];
  });
  (opt.stumps||[]).forEach(function(s){
    var n=V.byKey[s.of], sx=px(n)+(s.side==='l'?-1:1)*Math.min(46,YG*.8), sy=py(n)+YG;
    sv('line',{'class':'tv-edx',x1:px(n),y1:py(n)+R,x2:sx,y2:sy-12},gE);
    var g=sv('g',{'class':'tv-stump'},gN);
    sv('path',{'class':'st1',d:'M'+(sx-12)+' '+(sy-6)+'v12c0 4 24 4 24 0v-12z'},g);
    sv('ellipse',{'class':'st2',cx:sx,cy:sy-6,rx:12,ry:4},g);
    sv('ellipse',{'class':'st3',cx:sx,cy:sy-6,rx:6,ry:2},g);
    var tt=sv('text',{x:sx,y:sy+20},g); tt.textContent=s.text||'empty';
  });
  /* V.stump(key, 'l'|'r', label): a hidden cut stump under one side of a node, shown by a step */
  V.stump=function(k,side,text){
    var n=V.byKey[k], sx=px(n)+(side==='l'?-1:1)*Math.min(30,YG*.55), sy=py(n)+YG*.78;
    var g=sv('g',{'class':'tv-stump tv-stx'},gN);
    sv('line',{'class':'tv-edx',x1:px(n),y1:py(n)+R,x2:sx,y2:sy-9},g);
    sv('path',{'class':'st1',d:'M'+(sx-9)+' '+(sy-5)+'v9c0 3 18 3 18 0v-9z'},g);
    sv('ellipse',{'class':'st2',cx:sx,cy:sy-5,rx:9,ry:3},g);
    sv('ellipse',{'class':'st3',cx:sx,cy:sy-5,rx:4.5,ry:1.5},g);
    if(text){ var tt=sv('text',{x:sx,y:sy+15},g); tt.textContent=text; }
    g.style.visibility='hidden'; g.xy=[sx,sy]; return g;
  };
  if(opt.click){
    all.forEach(function(n){
      var g=V.node[n.id]; g.style.cursor='pointer'; g.setAttribute('tabindex','0'); g.setAttribute('role','button');
      g.setAttribute('aria-label','Node '+n.k);
      g.addEventListener('click',function(){ opt.click(n); });
      g.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); opt.click(n); } });
    });
  }
  /* one call paints a whole state; anything not named goes back to plain */
  V.set=function(st){
    st=st||{};
    function has(a,v){ return a && a.indexOf(v)>=0; }
    all.forEach(function(n){
      var g=V.node[n.id], cls='tv-nd';
      if(has(st.on,n.k)) cls+=' on';
      if(has(st.mk,n.k)) cls+=' mk';
      if(st.sel===n.k) cls+=' sel';
      if(st.dim && !has(st.on,n.k) && !has(st.mk,n.k) && st.sel!==n.k) cls+=' dim';
      if(st.hide && has(st.hide,n.k)) g.style.visibility='hidden'; else g.style.visibility='';
      g.setAttribute('class',cls);
      var e=V.edge[n.id]; if(!e) return;
      var ec='tv-ed';
      if(has(st.eon,n.k)) ec+=' on'; else if(has(st.emk,n.k)) ec+=' mk'; else if(st.dim) ec+=' dim';
      e.setAttribute('class',ec);
      e.style.visibility=(st.hide && has(st.hide,n.k))?'hidden':'';
    });
    V.lvl.forEach(function(l,k){ l.setAttribute('class','tv-lvl'+(has(st.lvl,k)?' on':'')+(st.lvlHide?' hid':'')); });
    V.band.forEach(function(b,k){ b.setAttribute('class','tv-band'+(has(st.band,k)?' on':'')); });
    for(var p in V.ghost){
      V.ghost[p].setAttribute('class','tv-ghost'+(st.gap===+p?' gap':''));
      if(V.plab[p]) V.plab[p].setAttribute('class','tv-pos'+(has(st.pos,+p)?' on':''));
    }
  };
  host.innerHTML=''; host.appendChild(svg);
  V.set({});
  return V;
}
function list(a){ if(a.length<2) return a.join(''); return a.slice(0,-1).join(', ')+' and '+a[a.length-1]; }
function keys(a){ return a.map(function(n){ return n.k; }); }

/* §74: a drawing too wide for its column shrinks to a floor, then scrolls */
function fitBox(box,nat){
  if(!box) return;
  var cw=box.parentNode.clientWidth||nat, z=Math.max(.62,Math.min(1,cw/nat));
  if(box.closest && box.closest('.fsbody')) z=Math.max(.62,Math.min(1.6,cw/nat));
  box.style.zoom=z;
}

return {sv:sv, parseT:parseT, index:index, depthOf:depthOf, under:under, drawTree:drawTree,
        list:list, keys:keys, fitBox:fitBox};
})();
