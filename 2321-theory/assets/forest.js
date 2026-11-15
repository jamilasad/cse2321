/* ==========================================================================
   CSE-2321 · the forest pages (Segment 7, trees)
   --------------------------------------------------------------------------
   The time-of-day menu (the one theme control on these pages), the easter
   eggs, and the living things. Runs after the page's own furniture.
   Linked after sim.css/sim.js by every page in 08-trees-and-heaps/. Bump the
   ?v= on every tree page when this file changes, as for the shell.
   ========================================================================== */
(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s);};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
var RM=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var FZ={sky:[]};   /* what the living things share: the margin trees, the floor, the hero sky's hooks */
var LEAFSVG='<svg viewBox="0 0 16 12"><path d="M1 11C2 4 8 1 15 1c-1 6-5 10-14 10z" fill="#6f9a48"/><path d="M2 10L12 3" stroke="#3f5f28" stroke-width=".8"/></svg>';

/* ---------- TIME OF DAY: the one theme control (the forest pages) ----------
   Replaces the "Dark code" toggle, so there is still a single switch for
   everything. Morning is the default: a projector cannot draw black. Night
   darkens the page and the code together; Auto follows the clock but is never
   chosen for you. The choice also writes dsa-code-theme, so the code panels on
   the rest of the site agree with it.                                      */
(function(){
  var KEY='cse2321-forest-time', CODE='dsa-code-theme', root=document.documentElement;
  var OPTS=[['auto','◷','Auto','follows the clock'],['morning','☀︎','Morning','light'],
            ['afternoon','⛅︎','Afternoon','warm'],['evening','◒','Evening','sepia'],
            ['night','☾','Night','dark, for reading at home']];
  function get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function put(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  var pref=get(KEY) || (get(CODE)==='dark' ? 'night' : 'morning');
  function clock(){ var h=new Date().getHours(); return h>=5&&h<12?'morning':h<16?'afternoon':h<19?'evening':'night'; }
  function eff(p){ return p==='auto' ? clock() : p; }
  var host=document.querySelector('.tabs'); if(!host) return;
  var wrap=document.createElement('div'); wrap.className='ftwrap';
  var btn=document.createElement('button'); btn.type='button'; btn.className='ftbtn';
  btn.setAttribute('aria-haspopup','menu'); btn.setAttribute('aria-expanded','false');
  var menu=document.createElement('div'); menu.className='ftmenu'; menu.setAttribute('role','menu'); menu.hidden=true;
  OPTS.forEach(function(o){
    var b=document.createElement('button'); b.type='button'; b.className='ftopt';
    b.setAttribute('role','menuitemradio'); b.setAttribute('data-t',o[0]);
    b.innerHTML='<span class="ic" aria-hidden="true">'+o[1]+'</span><span><b>'+o[2]+'</b><small>'+o[3]+'</small></span>';
    b.addEventListener('click',function(){ pref=o[0]; put(KEY,pref); apply(); close(); btn.focus(); });
    menu.appendChild(b);
  });
  function apply(){
    var t=eff(pref);
    root.setAttribute('data-ft',t);
    document.body.classList.toggle('codelight', t!=='night');
    put(CODE, t==='night' ? 'dark' : 'light');
    var o=OPTS.filter(function(x){ return x[0]===pref; })[0]||OPTS[1];
    btn.innerHTML='<span aria-hidden="true">'+o[1]+'</span>'+o[2]+'<span class="chev" aria-hidden="true">▾</span>';
    btn.setAttribute('aria-label','Theme: '+o[2]+(pref==='auto'?' ('+t+')':''));
    Array.prototype.forEach.call(menu.children,function(c){
      var on=c.getAttribute('data-t')===pref;
      c.classList.toggle('on',on); c.setAttribute('aria-checked',on?'true':'false');
    });
  }
  /* the tab strip scrolls sideways on a phone, so it clips anything that hangs
     out of it: the menu is placed against the viewport instead, under its button */
  function place(){
    var r=btn.getBoundingClientRect();
    menu.style.top=Math.round(r.bottom+8)+'px';
    menu.style.right=Math.max(8,Math.round(window.innerWidth-r.right))+'px';
  }
  function open(){ place(); menu.hidden=false; btn.setAttribute('aria-expanded','true'); }
  function close(){ menu.hidden=true; btn.setAttribute('aria-expanded','false'); }
  btn.addEventListener('click',function(e){ e.stopPropagation(); if(menu.hidden) open(); else close(); });
  document.addEventListener('click',function(e){ if(!wrap.contains(e.target)) close(); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape' && !menu.hidden) close(); });
  window.addEventListener('resize',function(){ if(!menu.hidden) place(); });
  window.addEventListener('scroll',function(){ if(!menu.hidden) close(); },{passive:true});
  setInterval(function(){ if(pref==='auto') apply(); },60000);
  wrap.appendChild(btn); wrap.appendChild(menu);
  var rv=host.querySelector('.revtog'); if(rv) host.insertBefore(wrap,rv); else host.appendChild(wrap);
  apply();
})();

/* =================== THE FOREST'S SMALL THINGS ===================
   None of this is explained on the page. It never moves while a simulator
   is stepping, never runs in Focus, and stands still for reduced motion. */
(function(){
  /* egg 2 · tree-ring badges: as many faint rings as the section's number */
  $$('.card.numbered > .badge').forEach(function(b){
    var n=parseInt(b.textContent,10); if(!n) return;
    var g=['#f6ecd8 0%'];
    for(var k=1;k<=n;k++){ var p=Math.round(84*k/(n+1)); g.push('#f6ecd8 '+(p-3)+'%','#cdb48e '+(p-3)+'%','#cdb48e '+(p-1)+'%','#f6ecd8 '+(p-1)+'%'); }
    g.push('#f6ecd8 86%','#a98a62 86%','#a98a62 100%');
    b.style.background='radial-gradient(circle closest-side,'+g.join(',')+')';
  });

  /* egg 1 · the progress twig: a leaf for each check answered, a flower at the end */
  var bar=$('#prog .pbar'), num=$('#pnum');
  var LF='<svg viewBox="0 0 13 9"><path d="M1 8C2 3 6 1 12 1c-1 5-4 7-11 7z" fill="#6f9a48"/></svg>';
  var FL='<svg viewBox="0 0 20 20"><g fill="#fff" stroke="#e0a33a" stroke-width=".8"><circle cx="10" cy="5" r="3.6"/><circle cx="15" cy="9" r="3.6"/><circle cx="13" cy="15" r="3.6"/><circle cx="7" cy="15" r="3.6"/><circle cx="5" cy="9" r="3.6"/></g><circle cx="10" cy="10" r="2.6" fill="#e0a33a"/></svg>';
  var shown=-1;
  function twig(){
    if(!bar||!num) return;
    var m=/(\d+)\s*\/\s*(\d+)/.exec(num.textContent); if(!m) return;
    var a=+m[1], t=+m[2];
    if(a===shown) return;
    $$('.twl,.twf',bar).forEach(function(x){ x.remove(); });
    for(var k=0;k<a;k++){
      var s=document.createElement('span'); s.className='twl '+(k%2?'dn':'up')+(shown>=0&&k>=shown&&!RM?' grow':'');
      s.style.left=(100*(k+.6)/t)+'%'; s.innerHTML=LF; bar.appendChild(s);
    }
    if(a===t&&t>0){ var f=document.createElement('span'); f.className='twf'; f.innerHTML=FL; bar.appendChild(f); }
    shown=a;
  }
  if(num){ new MutationObserver(twig).observe(num,{childList:true,characterData:true,subtree:true}); setTimeout(twig,0); }

  /* egg 6 · a right answer lets one leaf drift down */
  document.addEventListener('click',function(e){
    var o=e.target.closest && e.target.closest('.qopt[data-ok]');
    if(!o||RM||document.body.classList.contains('fsopen')) return;
    var q=o.closest('.quiz'); if(!q||q.dataset.leafed) return;
    q.dataset.leafed='1';
    if(getComputedStyle(q).position==='static') q.style.position='relative';
    var l=document.createElement('span'); l.className='leafdrop';
    l.innerHTML='<svg viewBox="0 0 16 12"><path d="M1 11C2 4 8 1 15 1c-1 6-5 10-14 10z" fill="#6f9a48"/><path d="M2 10L12 3" stroke="#3f5f28" stroke-width=".8"/></svg>';
    var r=o.getBoundingClientRect(), R=q.getBoundingClientRect();
    l.style.left=(r.right-R.left-28)+'px'; l.style.top=(r.top-R.top+4)+'px';
    q.appendChild(l); setTimeout(function(){ l.remove(); },1300);
  });
})();

/* the sprite sheets in assets/forest-art/, made by make_atlas.py from Gemini's pose sheets: cell size, the pinned point, pose names */
FZ.ART={"doel":{"src":"doel.webp","cw":153,"ch":163,"ax":86.1,"ay":142.8,"ref":96,"n":19,"f":{"p1":0,"p2":1,"p3":2,"p4":3,"p5":4,"p6":5,"p7":6,"p8":7,"p9":8,"p10":9,"w1":10,"w2":11,"w3":12,"w4":13,"w5":14,"w6":15,"crouch":16,"flare":17,"touch":18}},"bird":{"src":"bird.webp","cw":112,"ch":95,"ax":58.3,"ay":88.2,"ref":80,"n":10,"f":{"b1":0,"b2":1,"b3":2,"b4":3,"b5":4,"b6":5,"b7":6,"b8":7,"b9":8,"b10":9}},"hog":{"src":"hog.webp","cw":123,"ch":103,"ax":55.3,"ay":95.1,"ref":84,"n":10,"f":{"h1":0,"h2":1,"h3":2,"h4":3,"h5":4,"h6":5,"h7":6,"h8":7,"h9":8,"h10":9}},"ant":{"src":"ant.webp","cw":103,"ch":102,"ax":54.6,"ay":96.8,"ref":80,"n":10,"f":{"a1":0,"a2":1,"a3":2,"a4":3,"a5":4,"a6":5,"a7":6,"a8":7,"a9":8,"a10":9}},"bee":{"src":"bee.webp","cw":95,"ch":88,"ax":48.3,"ay":83.2,"ref":80,"n":10,"f":{"e1":0,"e2":1,"e3":2,"e4":3,"e5":4,"e6":5,"e7":6,"e8":7,"e9":8,"e10":9}},"spider":{"src":"spider.webp","cw":99,"ch":218,"ax":49.5,"ay":146.2,"ref":64,"n":10,"f":{"s1":0,"s2":1,"s3":2,"s4":3,"s5":4,"s6":5,"s7":6,"s8":7,"s9":8,"s10":9}},"owl":{"src":"owl.webp","cw":125,"ch":105,"ax":61.9,"ay":99.2,"ref":90,"n":10,"f":{"o1":0,"o2":1,"o3":2,"o4":3,"o5":4,"o6":5,"o7":6,"o8":7,"o9":8,"o10":9}},"mole":{"src":"mole.webp","cw":118,"ch":106,"ax":60.3,"ay":100.1,"ref":80,"n":10,"f":{"m1":0,"m2":1,"m3":2,"m4":3,"m5":4,"m6":5,"m7":6,"m8":7,"m9":8,"m10":9}},"cat":{"src":"cat.webp","cw":134,"ch":88,"ax":69.4,"ay":82.3,"ref":64,"n":12,"f":{"c1":0,"c2":1,"c3":2,"c4":3,"c5":4,"c6":5,"c7":6,"c8":7,"c9":8,"c10":9,"c11":10,"c12":11}},"wood":{"src":"wood.webp","cw":115,"ch":101,"ax":57.4,"ay":95.4,"ref":84,"n":10,"f":{"k1":0,"k2":1,"k3":2,"k4":3,"k5":4,"k6":5,"k7":6,"k8":7,"k9":8,"k10":9}},"tort":{"src":"tort.webp","cw":142,"ch":96,"ax":67.5,"ay":89.8,"ref":72,"n":10,"f":{"t1":0,"t2":1,"t3":2,"t4":3,"t5":4,"t6":5,"t7":6,"t8":7,"t9":8,"t10":9}},"deer":{"src":"deer.webp","cw":101,"ch":100,"ax":51.0,"ay":93.5,"ref":90,"n":15,"f":{"r1":0,"r2":1,"r3":2,"r4":3,"r5":4,"r6":5,"r7":6,"r8":7,"r9":8,"r10":9,"r11":10,"r12":11,"r13":12,"r14":13,"r15":14}},"squ":{"src":"squ.webp","cw":155,"ch":159,"ax":79.5,"ay":152.6,"ref":70,"n":10,"f":{"q1":0,"q2":1,"q3":2,"q4":3,"q5":4,"q6":5,"q7":6,"q8":7,"q9":8,"q10":9}},"fly":{"src":"fly.webp","cw":102,"ch":83,"ax":50.6,"ay":75.3,"ref":70,"n":10,"f":{"f1":0,"f2":1,"f3":2,"f4":3,"f5":4,"f6":5,"f7":6,"f8":7,"f9":8,"f10":9}},"frog":{"src":"frog.webp","cw":99,"ch":91,"ax":55.1,"ay":85.5,"ref":70,"n":10,"f":{"p1":0,"p2":1,"p3":2,"p4":3,"p5":4,"p6":5,"p7":6,"p8":7,"p9":8,"p10":9}},"flora":{"src":"flora.webp","cw":73,"ch":79,"ax":37.7,"ay":72.8,"ref":70,"n":10,"f":{"fern":0,"fernb":1,"grass":2,"grassb":3,"bush":4,"daisy":5,"pink":6,"bud":7,"half":8,"open":9}},"season":{"src":"season.webp","cw":74,"ch":80,"ax":34.5,"ay":73.8,"ref":70,"n":10,"f":{"kash":0,"kashb":1,"lily1":2,"lily2":3,"lily3":4,"stump":5,"mush":6,"pebble":7,"log":8,"leaf":9}},"treeR":{"src":"treeR.webp","cw":235,"ch":309,"ax":117.0,"ay":304.2,"ref":300,"n":2,"f":{"still":0,"blow":1}},"treeP":{"src":"treeP.webp","cw":118,"ch":368,"ax":63.0,"ay":361.5,"ref":360,"n":2,"f":{"still":0,"blow":1}}};

/* =================== THE ANIMALS: CLAY SPRITES ===================
   The doel, the songbird and the hedgehog are Gemini's clay poses (no eyes),
   cut out and packed one sheet per animal in assets/forest-art/. Every pose
   sits in an equal cell, pinned at the same point (feet, or the beak in
   flight), so a pose change is only a step of background-position, the way
   ahmedshamim.com plays its doyel. Nothing here runs for reduced motion, and
   every wait pauses while Focus is open or the tab is hidden.          */
(function(){
  if(RM || !FZ.ART) return;
  var DIR='../assets/forest-art/', SVGNS='http://www.w3.org/2000/svg';
  function busy(){ return document.body.classList.contains('fsopen') || document.hidden; }
  /* a wait that stands still while the page is busy */
  FZ.wait=function(ms){ return new Promise(function(res){ var left=ms, last=performance.now();
    (function tick(){ var now=performance.now(); if(!busy()) left-=now-last; last=now; if(left<=0) res(); else setTimeout(tick,Math.min(60,left)); })(); }); };
  /* a sprite: h is the height of the animal's resting pose on screen, in px */
  FZ.spr=function(kind,h,cls){
    var a=FZ.ART[kind], k=h/a.ref, el=document.createElement('span');
    el.className='fz-spr '+(cls||''); el.setAttribute('aria-hidden','true');
    el.style.width=(a.cw*k).toFixed(1)+'px'; el.style.height=(a.ch*k).toFixed(1)+'px';
    el.style.backgroundImage='url('+DIR+a.src+')'; el.style.backgroundSize=(a.n*100)+'% 100%';
    el.style.transformOrigin=(a.ax*k).toFixed(1)+'px '+(a.ay*k).toFixed(1)+'px';
    el._a=a; el._k=k; el._dir=1; FZ.frame(el,Object.keys(a.f)[0]); return el;
  };
  FZ.frame=function(el,name){ var a=el._a, i=a.f[name]; if(i==null) return; el.style.backgroundPosition=(a.n>1?i*100/(a.n-1):0)+'% 0'; el._f=name; };
  /* the pinned point inside the element: put this on the perch */
  FZ.pin=function(el){ return [el._a.ax*el._k, el._a.ay*el._k]; };
  FZ.place=function(el,x,y){ var p=FZ.pin(el); el.style.left=(x-p[0]).toFixed(1)+'px'; el.style.top=(y-p[1]).toFixed(1)+'px'; el._x=x; el._y=y; };
  FZ.face=function(el,dir){ el._dir=dir; el.style.transform=(el._extra||'')+(dir<0?' scaleX(-1)':''); };
  FZ.seq=async function(el,names,fps){ for(var i=0;i<names.length;i++){ FZ.frame(el,names[i]); await FZ.wait(1000/fps); } };
  /* loop poses until stop() */
  FZ.loop=function(el,names,fps){ var on=true, i=0;
    (async function(){ while(on){ FZ.frame(el,names[i]); i=(i+1)%names.length; await FZ.wait(1000/fps); } })();
    return function(){ on=false; }; };
  /* fly along a cubic curve (p0..p3 in the element's own container), beating its wings */
  function bz(a,b,c,d,t){ var u=1-t; return u*u*u*a+3*u*u*t*b+3*u*t*t*c+t*t*t*d; }
  FZ.fly=function(el,p0,p1,p2,p3,ms,beat,fps){
    var stop=FZ.loop(el,beat,fps);
    return new Promise(function(res){ var t0=null, spent=0, last=null;
      (function step(now){
        if(last==null) last=now; if(!busy()) spent+=now-last; last=now;
        var t=Math.min(1,spent/ms), x=bz(p0[0],p1[0],p2[0],p3[0],t), y=bz(p0[1],p1[1],p2[1],p3[1],t);
        var nx=bz(p0[0],p1[0],p2[0],p3[0],Math.min(1,t+.02)); if(Math.abs(nx-x)>.05) FZ.face(el,nx>x?1:-1);
        FZ.place(el,x,y);
        if(t<1 && el.isConnected) requestAnimationFrame(step); else { stop(); res(); }
      })(performance.now());
    });
  };
  /* walk in a straight line to (x, y) at v px a second, stepping through the poses, facing the way it goes */
  FZ.walk=function(e,x,y,v,poses,fps,keep){
    var x0=e._x, y0=e._y, ms=Math.hypot(x-x0,y-y0)/v*1000, stop=poses?FZ.loop(e,poses,fps||10):null;
    if(!keep && Math.abs(x-x0)>.5) FZ.face(e,x>x0?1:-1);
    return new Promise(function(res){ var spent=0, last=null;
      (function step(now){ if(last==null) last=now; if(!busy()) spent+=now-last; last=now;
        var t=ms?Math.min(1,spent/ms):1; FZ.place(e,x0+(x-x0)*t,y0+(y-y0)*t);
        if(t<1 && e.isConnected) requestAnimationFrame(step); else { if(stop) stop(); res(); } })(performance.now()); });
  };
  /* inside an SVG drawing (the margin trees): a nested svg shows one cell of the sheet */
  FZ.svgSpr=function(parent,kind,x,y,h){
    var a=FZ.ART[kind], k=h/a.ref, g=document.createElementNS(SVGNS,'g'), s=document.createElementNS(SVGNS,'svg'), im=document.createElementNS(SVGNS,'image');
    g.setAttribute('class','fz-sprg'); s.setAttribute('x',(x-a.ax*k).toFixed(1)); s.setAttribute('y',(y-a.ay*k).toFixed(1));
    s.setAttribute('width',(a.cw*k).toFixed(1)); s.setAttribute('height',(a.ch*k).toFixed(1)); s.setAttribute('overflow','hidden');
    im.setAttribute('href',DIR+a.src); im.setAttribute('width',a.cw*a.n); im.setAttribute('height',a.ch); im.setAttribute('preserveAspectRatio','none');
    s.appendChild(im); g.appendChild(s); parent.appendChild(g);
    g._show=function(name){ var i=a.f[name]; if(i==null) return; s.setAttribute('viewBox',(i*a.cw)+' 0 '+a.cw+' '+a.ch); g._f=name; };
    g._show(Object.keys(a.f)[0]); return g;
  };
  /* start the sheets loading at once, so the first pose is never blank */
  for(var k in FZ.ART){ var im=new Image(); im.src=DIR+FZ.ART[k].src; }
})();


/* =================== THE FOREST IS ALIVE ===================
   Small living things, all of them quiet. The rules (skill §75): nothing here
   moves in Focus, nothing is explained on the page, nothing sits inside a
   simulator, and prefers-reduced-motion stops every one of them. Each of them
   answers the pointer: the sky over the hero, the trees in the margins, the
   birds on the turns, and the forest floor at the end.                     */
(function(){
  if(RM) return;
  var root=document.documentElement;
  function ft(){ return root.getAttribute('data-ft')||'morning'; }
  function busy(){ return document.body.classList.contains('fsopen') || document.hidden; }
  function rnd(a,b){ return a+Math.random()*(b-a); }

  /* ---- 1 · the sky over each hero, which answers the pointer ----
     Morning motes drift away from it, afternoon butterflies flee it, evening
     leaves are pushed by it, night fireflies come to it. A click on the open
     sky adds one more thing of the hour, from that spot.                   */
  $$('.fhero').forEach(function(hero){
    var cv=document.createElement('canvas'); cv.className='fz-sky'; cv.setAttribute('aria-hidden','true');
    hero.insertBefore(cv,hero.firstChild);
    var cx=cv.getContext('2d'), W=0, H=0, dpr=1, seen=false, last=0, things=[], mode='', nextBird=4;
    var px=null, py=0, pvx=0, pvy=0, S={hero:hero, cx:cx};
    function size(){
      var r=hero.getBoundingClientRect(); dpr=Math.min(2,window.devicePixelRatio||1);
      W=r.width; H=r.height; cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
      cv.style.width=W+'px'; cv.style.height=H+'px'; cx.setTransform(dpr,0,0,dpr,0,0);
    }
    function fly(x,y,c){ return {k:'fly',x:x,y:y,a:rnd(0,6.3),s:rnd(18,30),p:rnd(0,6.3),c:c||(Math.random()<.5?'#e0a33a':'#9fbf86'),f:0}; }
    function leaf(x,y,k){ return {k:'leaf',x:x,y:y,v:rnd(10,22),rot:rnd(0,6.3),w:rnd(.6,1.6),p:rnd(0,6.3),c:['#c98a3c','#b5652f','#d9a24f'][k%3],vx:0}; }
    function ff(x,y){ return {k:'ff',x:x,y:y,p:rnd(0,6.3),v:rnd(.4,1.1),dx:rnd(-6,6),dy:rnd(-4,4)}; }
    function spawn(){
      mode=ft(); things=[];
      if(mode==='morning') for(var i=0;i<26;i++) things.push({k:'mote',x:rnd(0,W),y:rnd(0,H),r:rnd(.8,2.4),v:rnd(4,11),p:rnd(0,6.3)});
      if(mode==='afternoon') for(var j=0;j<3;j++) things.push(fly(rnd(W*.1,W*.9),rnd(H*.15,H*.7),j%2?'#e0a33a':'#9fbf86'));
      if(mode==='evening') for(var k=0;k<9;k++) things.push(leaf(rnd(0,W),rnd(-H,H),k));
      if(mode==='night') for(var m=0;m<18;m++) things.push(ff(rnd(0,W),rnd(H*.2,H)));
      nextBird=rnd(3,8);
    }
    function bird(x,y,vy){ things.push({k:'bird',x:x,y:y,v:rnd(55,80),vy:vy||0,p:0,s:rnd(.8,1.2)}); }
    function near(o,R){ if(px===null) return 0; var dx=o.x-px, dy=o.y-py, d=Math.sqrt(dx*dx+dy*dy)||1; return d<R?{dx:dx/d,dy:dy/d,f:1-d/R}:0; }
    function draw(dt,t){
      cx.clearRect(0,0,W,H);
      if(mode!==ft()) spawn();
      if(mode==='morning'){ nextBird-=dt; if(nextBird<0){ bird(-30,rnd(H*.12,H*.35)); nextBird=rnd(16,28); } }
      if(mode==='night' && px!==null){   /* a lantern's glow where the pointer is */
        var lg=cx.createRadialGradient(px,py,0,px,py,110); lg.addColorStop(0,'rgba(255,214,130,.16)'); lg.addColorStop(1,'rgba(255,214,130,0)');
        cx.globalAlpha=1; cx.fillStyle=lg; cx.beginPath(); cx.arc(px,py,110,0,6.283); cx.fill();
      }
      for(var i=things.length-1;i>=0;i--){
        var o=things[i], n;
        if(o.k==='mote'){
          o.y-=o.v*dt; o.x+=Math.sin(t*.4+o.p)*6*dt; if(o.y<-4){ o.y=H+4; o.x=rnd(0,W); }
          if((n=near(o,80))){ o.x+=n.dx*n.f*90*dt; o.y+=n.dy*n.f*90*dt; }
          cx.globalAlpha=.25+.2*Math.sin(t*.8+o.p); cx.fillStyle='#fff3cf';
          cx.beginPath(); cx.arc(o.x,o.y,o.r,0,6.283); cx.fill();
        } else if(o.k==='bird'){
          o.x+=o.v*dt; o.y+=o.vy*dt; o.vy*=Math.pow(.6,dt); o.p+=dt*9; var f=Math.sin(o.p)*5*o.s;
          cx.globalAlpha=.55; cx.strokeStyle='#2c4a37'; cx.lineWidth=1.8; cx.lineCap='round';
          cx.beginPath(); cx.moveTo(o.x-9*o.s,o.y-f); cx.quadraticCurveTo(o.x-4*o.s,o.y-2,o.x,o.y+1); cx.quadraticCurveTo(o.x+4*o.s,o.y-2,o.x+9*o.s,o.y-f); cx.stroke();
          if(o.x>W+40||o.y<-40) things.splice(i,1);
        } else if(o.k==='fly'){
          if((n=near(o,70))){ o.a=Math.atan2(n.dy,n.dx); o.f=1; }
          o.f=Math.max(0,o.f-dt*.8);
          o.a+=Math.sin(t*.7+o.p)*.9*dt; var sp=o.s*(1+2.5*o.f);
          o.x+=Math.cos(o.a)*sp*dt; o.y+=Math.sin(o.a)*sp*.6*dt;
          if(o.x<10||o.x>W-10){ o.a=Math.PI-o.a; o.x=Math.max(10,Math.min(W-10,o.x)); }
          if(o.y<H*.08||o.y>H*.85){ o.a=-o.a; o.y=Math.max(H*.08,Math.min(H*.85,o.y)); }
          var w=Math.abs(Math.sin(t*(14+10*o.f)+o.p));
          cx.globalAlpha=.7; cx.fillStyle=o.c;
          cx.beginPath(); cx.ellipse(o.x-3*w,o.y,4*w+.6,3,0,0,6.283); cx.ellipse(o.x+3*w,o.y,4*w+.6,3,0,0,6.283); cx.fill();
        } else if(o.k==='leaf'){
          if((n=near(o,90))){ o.vx+=pvx*n.f*.9*dt*8; o.rot+=n.f*dt*3; }
          o.vx*=Math.pow(.25,dt);
          o.y+=o.v*dt; o.x+=Math.sin(t*.9+o.p)*14*dt+o.vx*dt; o.rot+=o.w*dt;
          if(o.y>H+10||o.x<-40||o.x>W+40){ if(things.length>14){ things.splice(i,1); continue; } o.y=-10; o.x=rnd(0,W); o.vx=0; }
          cx.save(); cx.translate(o.x,o.y); cx.rotate(o.rot); cx.globalAlpha=.55; cx.fillStyle=o.c;
          cx.beginPath(); cx.moveTo(-6,0); cx.quadraticCurveTo(0,-5,6,0); cx.quadraticCurveTo(0,5,-6,0); cx.fill(); cx.restore();
        } else if(o.k==='ff'){
          o.x+=Math.sin(t*o.v+o.p)*o.dx*dt; o.y+=Math.cos(t*o.v*.7+o.p)*o.dy*dt;
          if((n=near(o,180))){ o.x-=n.dx*n.f*28*dt; o.y-=n.dy*n.f*28*dt; }
          var g=Math.max(0,Math.sin(t*o.v*1.6+o.p)); cx.globalAlpha=.15+.75*g;
          var gr=cx.createRadialGradient(o.x,o.y,0,o.x,o.y,7); gr.addColorStop(0,'rgba(255,226,140,1)'); gr.addColorStop(1,'rgba(255,226,140,0)');
          cx.fillStyle=gr; cx.beginPath(); cx.arc(o.x,o.y,7,0,6.283); cx.fill();
        }
      }
      pvx*=.85; pvy*=.85;
      cx.globalAlpha=1;
      S.W=W; S.H=H; S.px=px; S.py=py; S.dt=dt; S.t=t; S.mode=mode;   /* more life hangs here: forest.js §more */
      for(var hk=0;hk<FZ.sky.length;hk++){ FZ.sky[hk](S); cx.globalAlpha=1; }
    }
    function loop(ts){
      var t=ts/1000, dt=Math.min(.05,last?t-last:0); last=t;
      if(seen && !busy()) draw(dt,t); else last=0;
      requestAnimationFrame(loop);
    }
    new IntersectionObserver(function(e){ seen=e[0].isIntersecting; }).observe(hero);
    window.addEventListener('resize',function(){ size(); spawn(); });
    size(); spawn(); requestAnimationFrame(loop);

    hero.addEventListener('pointermove',function(e){
      var r=hero.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
      if(px!==null){ pvx=pvx*.5+(x-px)*30; pvy=pvy*.5+(y-py)*30; }
      px=x; py=y;
    });
    hero.addEventListener('pointerleave',function(){ px=null; pvx=pvy=0; });
    hero.addEventListener('click',function(e){
      if(e.target.closest('a,button,figure,input')) return;
      var r=hero.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top, m=ft(), k;
      if(m==='morning') bird(x,y,-40);
      else if(m==='afternoon') things.push(fly(x,y));
      else if(m==='evening') for(k=0;k<3;k++){ var l=leaf(x+rnd(-8,8),y+rnd(-6,6),k); l.vx=rnd(-60,60); things.push(l); }
      else for(k=0;k<3;k++) things.push(ff(x+rnd(-14,14),y+rnd(-10,10)));
    });
  });

  /* ---- 2 · a forest in the margins, rooted at the bottom of the window ----
     Only on screens wide enough to have margins. Scrolling is a gust of wind:
     the trees lean a little and settle back. A tree rustles and drops a leaf
     when the pointer brushes it; a click shakes more loose, and in daylight a
     bird leaves it. At night an owl sits in the tall pine on the left.      */
  var TREES='<svg viewBox="0 0 220 900" preserveAspectRatio="xMidYMax meet" aria-hidden="true">'+
    '<g class="fz-tree" style="--k:1"><g class="fz-lean"><g class="fz-sway" style="animation-delay:-2s"><path d="M70 900V700" stroke="currentColor" stroke-width="7"/><path class="fz-crown" d="M70 520l-46 90h22l-34 70h26l-30 64h124l-30-64h26l-34-70h22z" fill="currentColor"/>'+
      '<g class="fz-owl"><path d="M70 652c-7 0-11-5-11-12 0-5 2-9 5-11l1-6 4 4h2l4-4 1 6c3 2 5 6 5 11 0 7-4 12-11 12z"/><path class="bl" d="M70 650c-4 0-6-3-6-7 0-3 2-6 6-7 4 1 6 4 6 7 0 4-2 7-6 7z"/></g></g></g></g>'+
    '<g class="fz-tree" style="--k:1.5"><g class="fz-lean"><g class="fz-sway" style="animation-delay:-5s"><path d="M160 900V760" stroke="currentColor" stroke-width="6"/><g class="fz-crown"><circle cx="160" cy="720" r="44" fill="currentColor"/><circle cx="132" cy="752" r="30" fill="currentColor"/><circle cx="190" cy="750" r="28" fill="currentColor"/></g></g></g></g>'+
    '<g class="fz-tree" style="--k:2"><g class="fz-lean"><g class="fz-sway" style="animation-delay:-8s"><path d="M28 900V820" stroke="currentColor" stroke-width="4"/><path class="fz-crown" d="M28 730l-24 48h12l-18 40h60l-18-40h12z" fill="currentColor"/></g></g></g>'+
    '<path d="M0 900c30-14 60-14 110-6s90 6 110-4V900z" fill="currentColor"/></svg>';
  var guts=['l','r'].map(function(side){
    var g=document.createElement('div'); g.className='fz-gut '+side; g.setAttribute('aria-hidden','true'); g.innerHTML=TREES;
    if(side==='r'){ var o=g.querySelector('.fz-owl'); if(o) o.remove(); }
    document.body.appendChild(g); return g;
  });

  /* the gust: scrolling pushes, the trees spring back */
  var WIDE=window.matchMedia('(min-width:1320px)');
  var gust=0, lean=0, lastY=window.scrollY, blowing=false;
  function blow(){
    gust*=.9; lean+=(gust-lean)*.12;
    guts[0].style.setProperty('--fz-wind',(lean*3.2).toFixed(3));
    guts[1].style.setProperty('--fz-wind',(-lean*3.2).toFixed(3));
    if(Math.abs(lean)>.003||Math.abs(gust)>.003) requestAnimationFrame(blow);
    else { blowing=false; guts.forEach(function(g){ g.style.setProperty('--fz-wind','0'); }); }
  }
  FZ.guts=guts; FZ.WIDE=WIDE;
  FZ.gust=function(d){ if(busy()||!WIDE.matches) return; gust=Math.max(-1,Math.min(1,gust+d)); if(!blowing){ blowing=true; requestAnimationFrame(blow); } };
  window.addEventListener('scroll',function(){
    var dy=window.scrollY-lastY; lastY=window.scrollY;
    if(busy()||!WIDE.matches) return;
    gust=Math.max(-1,Math.min(1,gust+dy/700));
    if(!blowing){ blowing=true; requestAnimationFrame(blow); }
  },{passive:true});

  /* leaves and birds that leave a margin tree */
  var LEAFC={morning:'#7aa352',afternoon:'#8fae4f',evening:'#c98a3c',night:'#4f6f58'}, falling=0;
  function dropLeaf(tree,bias){
    if(falling>16) return;
    var cr=tree.querySelector('.fz-crown').getBoundingClientRect();
    var x=rnd(cr.left+cr.width*.15,cr.right-cr.width*.15), y=rnd(cr.top+cr.height*.3,cr.bottom-cr.height*.15);
    var l=document.createElement('span'); l.className='fz-mleaf'; l.setAttribute('aria-hidden','true');
    var pc=FZ.petal&&FZ.petal(), fill=pc||LEAFC[ft()]||LEAFC.morning;
    l.innerHTML='<svg viewBox="0 0 16 12"><path d="'+(pc?FZ.PETAL:'M1 11C2 4 8 1 15 1c-1 6-5 10-14 10z')+'" fill="'+fill+'"/></svg>';
    l.style.left=x+'px'; l.style.top=y+'px'; document.body.appendChild(l); falling++;
    var fall=Math.max(20,window.innerHeight-y-rnd(8,22)), dx=rnd(-26,26)+(bias||0), dur=rnd(2600,3800), rot=rnd(220,420)*(Math.random()<.5?-1:1);
    var a=l.animate([
      {transform:'translate(0,0) rotate(0deg)',opacity:0},
      {opacity:.9,offset:.08},
      {transform:'translate('+(dx*.6+12)+'px,'+(fall*.35)+'px) rotate('+(rot*.35)+'deg)',offset:.35},
      {transform:'translate('+(dx*.2-12)+'px,'+(fall*.7)+'px) rotate('+(rot*.7)+'deg)',offset:.7},
      {transform:'translate('+dx+'px,'+fall+'px) rotate('+rot+'deg)',opacity:.9,offset:.86},
      {transform:'translate('+dx+'px,'+fall+'px) rotate('+rot+'deg)',opacity:0}
    ],{duration:dur,easing:'ease-in'});
    a.onfinish=function(){ l.remove(); falling--; if(FZ.settle) FZ.settle(fill,!!pc); };
  }
  function flyOut(tree,side){
    var cr=tree.querySelector('.fz-crown').getBoundingClientRect();
    var b=document.createElement('span'); b.className='fz-mbird'; b.setAttribute('aria-hidden','true');
    b.innerHTML='<svg viewBox="0 0 24 12"><path d="M1 3c4 0 7 2 11 7 4-5 7-7 11-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    b.style.left=(cr.left+cr.width/2-12)+'px'; b.style.top=(cr.top+cr.height*.35)+'px'; document.body.appendChild(b);
    var dir=side==='l'?1:-1;
    b.animate([{transform:'translate(0,0) scale(.6)',opacity:0},{opacity:.8,offset:.12},
      {transform:'translate('+(dir*60)+'px,-90px) scale(1)',offset:.5},{transform:'translate('+(dir*140)+'px,-260px) scale(.8)',opacity:0}],
      {duration:2200,easing:'cubic-bezier(.3,.1,.4,1)'}).onfinish=function(){ b.remove(); };
  }
  function shake(tree,big){
    tree.classList.remove('fz-rustle','fz-rustle2'); void tree.getBoundingClientRect();
    tree.classList.add(big?'fz-rustle2':'fz-rustle');
  }
  /* a gust from the breeze (forest.js §more) shakes leaves loose downwind */
  FZ.blowTrees=function(dir){
    if(busy()||!WIDE.matches) return;
    guts.forEach(function(g){ $$('.fz-tree',g).forEach(function(t,k){ if(k>1) return; shake(t,false);
      setTimeout(function(){ dropLeaf(t,dir*rnd(50,110)); },k*140); setTimeout(function(){ dropLeaf(t,dir*rnd(50,110)); },k*140+260); }); });
  };
  guts.forEach(function(g){
    var side=g.classList.contains('l')?'l':'r';
    $$('.fz-tree',g).forEach(function(tree){
      var brushed=0;
      tree.addEventListener('pointerenter',function(){
        if(busy()) return; var now=Date.now(); if(now-brushed<900) return; brushed=now;
        shake(tree,false); dropLeaf(tree);
      });
      tree.addEventListener('click',function(){
        if(busy()) return; var m=ft();
        shake(tree,true);
        for(var k=0;k<(m==='evening'?7:4);k++) setTimeout(function(){ dropLeaf(tree); },k*140);
        if(m==='morning'||m==='afternoon') flyOut(tree,side);
        var owl=tree.querySelector('.fz-owl'); if(owl){ owl.classList.remove('blink'); void owl.getBoundingClientRect(); owl.classList.add('blink'); }
      });
    });
  });

  /* ---- 3 · cards rise into place as you reach them, once; their rings grow ---- */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('fz-in'); io.unobserve(e.target); } });
  },{rootMargin:'0px 0px -8% 0px'});
  $$('.panel .card').forEach(function(c){
    if(c.getBoundingClientRect().top<window.innerHeight) { c.classList.add('fz-in'); return; }
    c.classList.add('fz-rise'); io.observe(c);
  });

  /* ---- 4 · a bird perches on every "Your turn", and leaves when the answer is shown ----
     It hops when the pointer comes near, and flutters up and back when touched. */
  var BIRD='<svg viewBox="0 0 30 22" aria-hidden="true"><ellipse cx="13" cy="13" rx="9" ry="6.5" fill="#6f8a5a"/><circle cx="21" cy="8.5" r="4.6" fill="#6f8a5a"/>'+
    '<path d="M25.5 8.6l3.6 1-3.6 1.2z" fill="#e0a33a"/><path d="M5 12l-5 -2 3 5z" fill="#55704a"/>'+
    '<path class="wing" d="M9 11c3-4 8-4 10 0" fill="none" stroke="#55704a" stroke-width="1.6"/><path d="M11 19v3M15 19v3" stroke="#8a6240" stroke-width="1.2"/></svg>';
  $$('.turn').forEach(function(t){
    var th=t.querySelector('.th'), btn=t.querySelector('.tbtn'); if(!th||!btn) return;
    var b=document.createElement('span'); b.className='fz-bird'; th.appendChild(b);
    var sp=FZ.spr?FZ.spr('bird',24):null, beat=null;
    if(sp){ b.classList.add('sp'); b.appendChild(sp); } else b.innerHTML=BIRD;
    function flap(ms){ if(!sp) return; if(beat) beat(); beat=FZ.loop(sp,['b7','b9'],14); setTimeout(function(){ if(beat){ beat(); beat=null; } if(!b.classList.contains('gone')) FZ.frame(sp,'b1'); },ms); }
    btn.addEventListener('click',function(){ if(!b.classList.contains('gone')){ b.classList.add('gone'); flap(1200); } });
    b.addEventListener('click',function(e){
      e.stopPropagation(); if(b.classList.contains('gone')) return;
      b.classList.remove('flut'); void b.offsetWidth; b.classList.add('flut'); flap(950);
    });
    b.addEventListener('animationend',function(e){ if(e.animationName==='fzflut') b.classList.remove('flut'); });
    if(sp){
      /* it hops when the pointer comes; now and then it looks back, or pecks */
      b.addEventListener('pointerenter',function(){ if(!beat && !b.classList.contains('gone')) FZ.seq(sp,['b4','b5','b6','b1'],12); });
      (async function(){ var k=0;
        while(sp.isConnected && !b.classList.contains('gone')){
          await FZ.wait(5000+(k%3)*1600); if(beat || b.classList.contains('gone')) continue;
          if(k%2===0){ FZ.frame(sp,'b2'); await FZ.wait(900); } else { await FZ.seq(sp,['b3','b1','b3'],5); }
          if(!beat && !b.classList.contains('gone')) FZ.frame(sp,'b1'); k++;
        } })();
    }
  });

  /* ---- 5 · the forest floor at the end of a lesson ----
     Grass bends away from the pointer. The hedgehog crosses once when you
     arrive; touch it and it curls up; touch the empty floor and it crosses
     back. Mushrooms puff when touched. At night, fireflies over the floor. */
  var nav=$('#p-lesson .pagenav');
  if(nav){
    var fl=document.createElement('div'); fl.className='fz-floor'; fl.setAttribute('aria-hidden','true');
    var HOG='<svg class="hb" viewBox="0 0 44 26"><path d="M4 20c0-10 8-16 18-16s16 6 18 14l-4 2H6z" fill="#8a6240"/><path d="M8 10l-3-4 6 2M14 6l-1-5 4 4M21 4l1-5 3 5M28 6l3-4 1 5M33 10l4-3-1 5" fill="none" stroke="#6b4a2c" stroke-width="1.6"/>'+
      '<path d="M34 14c4 0 8 2 9 5l-9 2z" fill="#d7b994"/><circle cx="43" cy="19" r="1.1" fill="#1f2d24"/><path d="M12 22v3M28 22v3" stroke="#5b4027" stroke-width="2"/></svg>'+
      '<svg class="hball" viewBox="0 0 26 26"><circle cx="13" cy="13" r="10" fill="#8a6240"/><path d="M13 1v4M13 21v4M1 13h4M21 13h4M4.5 4.5l3 3M18.5 18.5l3 3M4.5 21.5l3-3M18.5 7.5l3-3" stroke="#6b4a2c" stroke-width="1.8" stroke-linecap="round"/></svg>';
    var MUSH=function(c,dot){ return '<svg viewBox="0 0 24 24"><g class="cap"><path d="M3 12c0-6 18-6 18 0z" fill="'+c+'"/>'+(dot||'')+'</g><path d="M10 12h4v8h-4z" fill="#efe2cf"/></svg>'; };
    var grass='';
    for(var gi=0;gi<46;gi++){ var gx=(gi+.5)*100/46+rnd(-.8,.8); grass+='<i class="fz-blade" style="left:'+gx.toFixed(2)+'%;height:'+rnd(8,15).toFixed(1)+'px;--r:'+rnd(-8,8).toFixed(1)+'deg"></i>'; }
    var ffl='';
    for(var fi=0;fi<6;fi++) ffl+='<i class="fz-ffl" style="left:'+rnd(6,94).toFixed(1)+'%;bottom:'+rnd(26,58).toFixed(0)+'px;animation-delay:'+rnd(-6,0).toFixed(2)+'s,'+rnd(-3,0).toFixed(2)+'s"></i>';
    fl.innerHTML='<svg class="fz-ground" viewBox="0 0 1000 70" preserveAspectRatio="none"><path d="M0 70V44c60-10 120 4 180-2s140-14 220-4 160 10 240 2 170-10 240-2 80 6 120 2V70z" fill="currentColor"/></svg>'+
      '<div class="fz-grass">'+grass+'</div>'+ffl+
      '<span class="fz-mush" style="left:12%">'+MUSH('#b5652f','<circle cx="9" cy="9" r="1.4" fill="#fbf3ea"/><circle cx="15" cy="8" r="1.1" fill="#fbf3ea"/>')+'</span>'+
      '<span class="fz-mush sm" style="left:15%">'+MUSH('#c98a3c')+'</span>'+
      '<span class="fz-mush" style="left:84%">'+MUSH('#8d5734','<circle cx="12" cy="8" r="1.3" fill="#fbf3ea"/>')+'</span>'+
      '<span class="fz-fern" style="left:46%"><svg viewBox="0 0 30 30"><path d="M15 30C15 18 9 10 3 6M15 30c0-12 6-20 12-24M15 30V4" fill="none" stroke="#6f9a48" stroke-width="2"/></svg></span>'+
      '<span class="fz-hog">'+HOG+'</span>';
    nav.parentNode.insertBefore(fl,nav.nextSibling);
    FZ.floor=fl;
    var hog=fl.querySelector('.fz-hog'), walking=false, crossings=0, hs=FZ.spr?FZ.spr('hog',26):null, curling=false;
    if(hs){ hog.innerHTML=''; hog.classList.add('sp'); hog.appendChild(hs); }
    function cross(){
      if(walking||busy()) return;
      if(!hs){ fl.classList.remove('walk','back'); void fl.offsetWidth; fl.classList.add(crossings%2?'back':'walk'); crossings++; walking=true; return; }
      var back=crossings%2===1; crossings++; walking=true;
      (async function(){
        var W=fl.clientWidth, dir=back?-1:1, x=back?W+50:-50, end=back?-50:W+50, mid=W*(back?.56:.46), sniffed=false, i=0, px=FZ.pin(hs)[0];
        FZ.face(hs,dir);
        while(dir>0?x<end:x>end){
          if(curling){ await FZ.wait(120); continue; }
          x+=dir*6; hog.style.left=(x-px).toFixed(1)+'px'; FZ.frame(hs,'h'+(1+(i++%4))); await FZ.wait(95);
          if(!sniffed && Math.abs(x-mid)<6){ sniffed=true; FZ.frame(hs,'h5'); await FZ.wait(850); FZ.frame(hs,'h6'); await FZ.wait(850); }
        }
        walking=false;
      })();
    }
    hog.addEventListener('animationend',function(e){ if(e.animationName==='fzwalk'||e.animationName==='fzwalkb') walking=false; });
    new IntersectionObserver(function(es,ob){
      es.forEach(function(e){ if(e.isIntersecting && !busy()){ cross(); ob.disconnect(); } });
    },{threshold:.6}).observe(fl);
    hog.addEventListener('click',function(e){
      e.stopPropagation(); if(hog.classList.contains('curl') || curling) return;
      if(hs){ curling=true; (async function(){ await FZ.seq(hs,['h7'],8); FZ.frame(hs,'h8'); await FZ.wait(1300); await FZ.seq(hs,['h9','h10'],3); FZ.frame(hs,'h1'); curling=false; })(); return; }
      hog.classList.add('curl'); setTimeout(function(){ hog.classList.remove('curl'); },1500);
    });
    fl.addEventListener('click',function(e){ if(!e.target.closest('.fz-mush,.fz-hog,.fz-x')) cross(); });
    $$('.fz-mush',fl).forEach(function(m){
      function puff(){
        if(m.classList.contains('puff')) return;
        m.classList.add('puff'); setTimeout(function(){ m.classList.remove('puff'); },700);
        for(var k=0;k<4;k++){
          var s=document.createElement('i'); s.className='fz-spore'; m.appendChild(s);
          s.animate([{transform:'translate(0,0)',opacity:.9},{transform:'translate('+rnd(-14,14)+'px,'+rnd(-30,-18)+'px)',opacity:0}],
            {duration:rnd(900,1400),easing:'ease-out'}).onfinish=(function(x){ return function(){ x.remove(); }; })(s);
        }
      }
      m.addEventListener('pointerenter',puff); m.addEventListener('click',function(e){ e.stopPropagation(); puff(); });
    });
    /* the grass leans away from the pointer, and stands up again */
    var blades=$$('.fz-blade',fl), gTick=null, gx0=null;
    function bend(){
      gTick=null; var r=fl.getBoundingClientRect();
      blades.forEach(function(b){
        var bx=b.offsetLeft, d=gx0===null?999:bx-(gx0-r.left), a=Math.abs(d)<46?(d>0?1:-1)*(46-Math.abs(d))*.9:0;
        b.style.setProperty('--p',a.toFixed(1)+'deg');
      });
    }
    fl.addEventListener('pointermove',function(e){ gx0=e.clientX; if(!gTick) gTick=requestAnimationFrame(bend); });
    fl.addEventListener('pointerleave',function(){ gx0=null; if(!gTick) gTick=requestAnimationFrame(bend); });
  }
})();


/* =================== THE FOREST, MORE ALIVE (2026-11-14) ===================
   The background behind the cards answers the pointer (canopy light, the
   breeze); the work earns life (leaves that stay, a bird for each simulator
   finished, a flower for each right answer, the owl for a perfect run); rare
   visitors come by; and the forest dresses for the Bangladeshi season. The
   same rules as above: nothing in Focus, nothing inside a simulator, nothing
   for reduced motion, nothing explained on the page.
   For a preview: ?fzseason=winter|spring|summer|monsoon|autumn and
   ?fzvisit=doel|deer|star|rain|sib|ant|den.                                 */
(function(){
  if(RM) return;
  var root=document.documentElement, Q=location.search;
  function ft(){ return root.getAttribute('data-ft')||'morning'; }
  function busy(){ return document.body.classList.contains('fsopen') || document.hidden; }
  function rnd(a,b){ return a+Math.random()*(b-a); }
  function day(){ var m=ft(); return m==='morning'||m==='afternoon'; }
  var WIDE=FZ.WIDE||window.matchMedia('(min-width:1320px)');
  var SVGNS='http://www.w3.org/2000/svg';
  var mv=/[?&]fzvisit=(\w+)/.exec(Q), FORCE=mv?mv[1]:'';

  /* ---- the season, from today's date (Bangladesh) ---- */
  var SEAS=['winter','spring','spring','summer','summer','monsoon','monsoon','monsoon','autumn','autumn','autumn','winter'];
  var ms=/[?&]fzseason=(\w+)/.exec(Q);
  var season=ms&&SEAS.indexOf(ms[1])>=0?ms[1]:SEAS[new Date().getMonth()];
  root.setAttribute('data-fzs',season);
  var PETALC={spring:'#c8402a',summer:'#e4572e'};
  FZ.PETAL='M8 1c4 2 6 6 5 9-2 2-8 2-10 0-1-3 1-7 5-9z';
  FZ.petal=function(){ return PETALC[season]||null; };
  var LEAFC={morning:'#7aa352',afternoon:'#8fae4f',evening:'#c98a3c',night:'#4f6f58'};

  function sprite(rgb,mid){
    var s=document.createElement('canvas'); s.width=s.height=128;
    var g=s.getContext('2d'), c='rgba('+rgb.join(',')+',', gr=g.createRadialGradient(64,64,0,64,64,64);
    gr.addColorStop(0,c+'1)'); gr.addColorStop(.5,c+(mid||.5)+')'); gr.addColorStop(1,c+'0)');
    g.fillStyle=gr; g.fillRect(0,0,128,128); return s;
  }

  /* ---- 6 · canopy light behind the cards, and the breeze ----
     Patches of light, as if through leaves overhead, drift over the page
     around the cards; the pointer is a gap in the leaves. Morning gold,
     small bright afternoon spots, long evening slants, moonlight and stars.
     A fast flick of the pointer over empty page is a gust: leaves blow
     across, the light shifts and settles, the margin trees lean.          */
  var LIGHT={morning:[[255,224,150],.3],afternoon:[[255,230,155],.34],evening:[[236,160,80],.14],night:[[190,210,255],.075]};
  var cv=document.createElement('canvas'); cv.className='fz-canopy'; cv.setAttribute('aria-hidden','true');
  document.body.insertBefore(cv,document.body.firstChild);
  var cx=cv.getContext('2d'), W=0, H=0, spots=[], stars=[], tumb=[], mode='', spr=null, last=0, drawnAt=0;
  var px=null, py=0, lx=null, ly=0, shift=0, shiftV=0, shoot=null, ML=0, MR=0, room=false;
  /* the light only shows in the margins and the gaps between cards; below 60 px of margin it is not drawn at all */
  function margins(){ var cs=$$('.card'), r=null; for(var i=0;i<cs.length && !r;i++){ var q=cs[i].getBoundingClientRect(); if(q.width) r=q; }
    ML=r?r.left:0; MR=r?W-r.right:0; room=Math.min(ML,MR)>=60; }
  function lsize(){ W=root.clientWidth; H=root.clientHeight; cv.width=W; cv.height=H; margins(); lspawn(); }
  function lspawn(){
    mode=ft(); var L=LIGHT[mode]||LIGHT.morning; spr=sprite(L[0],mode==='evening'?.55:.45); spots=[]; stars=[];
    var n=Math.round(Math.max(8,Math.min(18,W*H/80000)));
    if(mode==='afternoon') n=Math.round(n*1.5);
    if(mode==='evening') n=Math.max(4,Math.round(n*.35));
    for(var i=0;i<n;i++) spots.push({x:rnd(0,W),y:rnd(0,H),p:rnd(0,6.3),w:rnd(.12,.3),a:rnd(10,26),k:rnd(.6,1),
      r:mode==='afternoon'?rnd(22,50):mode==='evening'?rnd(70,120):rnd(40,95)});
    if(mode==='night') for(var j=0;j<Math.round(W*H/26000);j++) stars.push({x:rnd(0,W),y:rnd(0,H),r:rnd(.5,1.3),p:rnd(0,6.3),v:rnd(.5,1.4)});
  }
  function leafPath(c,x,y,rot,s){
    cx.save(); cx.translate(x,y); cx.rotate(rot); cx.scale(s,s); cx.fillStyle=c; cx.beginPath();
    if(PETALC[season]){ cx.ellipse(0,0,5,3.6,0,0,6.283); } else { cx.moveTo(-6,0); cx.quadraticCurveTo(0,-5,6,0); cx.quadraticCurveTo(0,5,-6,0); }
    cx.fill(); cx.restore();
  }
  function ldraw(dt,t){
    if(mode!==ft()) lspawn();
    var L=LIGHT[mode]||LIGHT.morning, i, s;
    cx.clearRect(0,0,W,H);
    shiftV+=(-shift*1.4-shiftV*1.9)*dt; shift+=shiftV*dt;          /* the light shifts in a gust, then settles */
    for(i=0;i<spots.length;i++){
      s=spots[i];
      var x=s.x+Math.sin(t*s.w+s.p)*s.a+shift*s.k, y=s.y+Math.cos(t*s.w*.8+s.p)*s.a*.6;
      cx.globalAlpha=L[1]*(.72+.28*Math.sin(t*s.w*1.7+s.p));
      if(mode==='evening'){ cx.save(); cx.translate(x,y); cx.rotate(-.62); cx.drawImage(spr,-s.r*1.8,-s.r*.3,s.r*3.6,s.r*.6); cx.restore(); }
      else cx.drawImage(spr,x-s.r,y-s.r,s.r*2,s.r*2);
    }
    if(stars.length){
      cx.fillStyle='#eef1ff';
      for(i=0;i<stars.length;i++){ s=stars[i]; cx.globalAlpha=.12+.5*Math.max(0,Math.sin(t*s.v+s.p)); cx.fillRect(s.x,s.y,s.r*1.6,s.r*1.6); }
    }
    if(px!==null){                                                   /* the gap in the leaves */
      if(lx===null){ lx=px; ly=py; }
      var k=Math.min(1,dt*2); lx+=(px-lx)*k; ly+=(py-ly)*k;
      var pr=mode==='afternoon'?70:mode==='evening'?120:110;
      cx.globalAlpha=L[1]*1.1; cx.drawImage(spr,lx-pr,ly-pr,pr*2,pr*2);
    }
    for(i=tumb.length-1;i>=0;i--){                                  /* leaves on the wind */
      s=tumb[i]; s.vy+=26*dt; s.vx*=Math.pow(.75,dt); s.x+=s.vx*dt; s.y+=s.vy*dt+Math.sin(t*3+s.p)*30*dt; s.r+=s.w*dt;
      cx.globalAlpha=.7; leafPath(s.c,s.x,s.y,s.r,1.1);
      if(s.x<-60||s.x>W+60||s.y>H+30) tumb.splice(i,1);
    }
    if(shoot){ drawStar(cx,shoot,dt); if(shoot.done) shoot=null; }
    cx.globalAlpha=1;
  }
  function lloop(ts){
    requestAnimationFrame(lloop);
    if(busy() || !room){ if(drawnAt){ cx.clearRect(0,0,W,H); drawnAt=0; } last=0; return; }
    if(drawnAt && ts-drawnAt<40) return;                             /* 25 frames a second is plenty for light */
    var t=ts/1000, dt=Math.min(.08,last?t-last:0); last=t; drawnAt=ts; ldraw(dt,t);
  }
  window.addEventListener('resize',lsize);
  lsize(); requestAnimationFrame(lloop);

  var hist=[], calm=0, gusts=0;
  var SOLID='.card,.sim,.fhero,.topbar,.drawer,.fab,.tabs,.pagenav,.fz-floor,.box,button,a,input,select,textarea,.fz-tree';
  function breeze(e){
    var now=e.timeStamp||performance.now();
    hist.push([now,e.clientX,e.clientY]); while(hist.length && now-hist[0][0]>140) hist.shift();
    if(now<calm || hist.length<3 || busy()) return;
    if(e.target && e.target.closest && e.target.closest(SOLID)) return;
    var a=hist[0], dx=e.clientX-a[1], dy=e.clientY-a[2], el=Math.max(1,now-a[0]);
    if(Math.abs(dx)<120 || Math.abs(dx)<2*Math.abs(dy) || Math.abs(dx)/el<1.6) return;
    calm=now+1600; hist=[]; gusts++;
    var dir=dx>0?1:-1, c=PETALC[season]||LEAFC[ft()]||LEAFC.morning;
    shiftV+=dir*Math.min(260,W*.18);
    /* the leaves start in the margins and drift slowly, so they are seen before they pass behind a card */
    if(room) for(var k=0;k<8;k++){ var lm=k%2===0;
      tumb.push({x:lm?rnd(ML*.05,ML*.55):rnd(W-MR*.95,W-MR*.45),y:rnd(H*.1,H*.75),vx:dir*rnd(80,160),vy:rnd(-50,-10),r:rnd(0,6.3),w:dir*rnd(2,4),p:rnd(0,6.3),c:c}); }
    if(FZ.gust) FZ.gust(dir*.9);
    if(FZ.blowTrees) FZ.blowTrees(dir);
  }
  window.addEventListener('pointermove',function(e){ px=e.clientX; py=e.clientY; breeze(e); },{passive:true});
  FZ.gustNow=function(dir){ var c=PETALC[season]||LEAFC[ft()]||LEAFC.morning; shiftV+=dir*Math.min(260,W*.18); gusts++;
    if(room) for(var k=0;k<8;k++){ var lm=k%2===0; tumb.push({x:lm?rnd(ML*.05,ML*.55):rnd(W-MR*.95,W-MR*.45),y:rnd(H*.1,H*.75),vx:dir*rnd(80,160),vy:rnd(-50,-10),r:rnd(0,6.3),w:dir*rnd(2,4),p:rnd(0,6.3),c:c}); }
    if(FZ.gust) FZ.gust(dir*.9); if(FZ.blowTrees) FZ.blowTrees(dir); };
  document.addEventListener('pointerleave',function(){ px=null; lx=null; });
  root.addEventListener('mouseleave',function(){ px=null; lx=null; });

  /* a shooting star: one streak across the top of whichever sky is in view */
  function newStar(w,h){ var dir=Math.random()<.5?1:-1; return {x:dir>0?rnd(w*.05,w*.5):rnd(w*.5,w*.95),y:rnd(h*.04,h*.3),dir:dir,a:rnd(.25,.45),v:rnd(700,950),t:0,d:rnd(.7,1)}; }
  function drawStar(c,s,dt){
    s.t+=dt; var f=s.t/s.d; if(f>=1){ s.done=true; return; }
    var hx=s.x+Math.cos(s.a)*s.v*s.t*s.dir, hy=s.y+Math.sin(s.a)*s.v*s.t, tl=170*(1-.7*Math.abs(f-.5));
    var tx=hx-Math.cos(s.a)*tl*s.dir, ty=hy-Math.sin(s.a)*tl, g=c.createLinearGradient(tx,ty,hx,hy);
    g.addColorStop(0,'rgba(255,246,220,0)'); g.addColorStop(1,'rgba(255,246,220,.95)');
    c.globalAlpha=Math.min(1,1.6*Math.sin(Math.PI*f)); c.strokeStyle=g; c.lineWidth=2.2; c.lineCap='round';
    c.beginPath(); c.moveTo(tx,ty); c.lineTo(hx,hy); c.stroke();
    var hg=c.createRadialGradient(hx,hy,0,hx,hy,7); hg.addColorStop(0,'rgba(255,250,230,.95)'); hg.addColorStop(1,'rgba(255,250,230,0)');
    c.fillStyle=hg; c.beginPath(); c.arc(hx,hy,7,0,6.283); c.fill();
  }
  var heroWant=false;
  FZ.sky.push(function(S){
    if(heroWant){ heroWant=false; S.star=newStar(S.W,S.H); }
    if(S.star){ drawStar(S.cx,S.star,S.dt); if(S.star.done) S.star=null; }
  });
  function star(){
    var h=$('#p-lesson .fhero'), r=h&&h.getBoundingClientRect();
    if(r && r.height && r.bottom>80 && r.top<window.innerHeight) heroWant=true;
    else if(room){                                                /* steep and slow, so it stays in a margin */
      var lm=Math.random()<.5; shoot={x:lm?rnd(ML*.15,ML*.4):rnd(W-MR*.4,W-MR*.15),y:rnd(H*.05,H*.35),dir:lm?1:-1,a:rnd(1,1.2),v:rnd(420,560),t:0,d:rnd(.55,.7)};
    }
  }

  /* ---- 7 · leaves that stay: what falls from a margin tree, and every right answer, lands on the floor ---- */
  var fl=FZ.floor, bed=null, fallen=[];
  var LEAF='M1 11C2 4 8 1 15 1c-1 6-5 10-14 10z';
  function onFloor(c,petal,big){
    var s=document.createElement('i'); s.className='fz-bl'+(big?' big':'');
    s.innerHTML='<svg viewBox="0 0 16 12"><path d="'+(petal?FZ.PETAL:LEAF)+'" fill="'+c+'"/></svg>';
    s.style.left=rnd(1,97).toFixed(1)+'%'; s.style.bottom=rnd(12,20).toFixed(0)+'px';
    s.style.transform='rotate('+rnd(-70,70).toFixed(0)+'deg)'; return s;
  }
  if(fl){ bed=document.createElement('div'); bed.className='fz-bed'; fl.insertBefore(bed,fl.querySelector('.fz-grass')); }
  FZ.settle=function(c,petal){
    if(!bed) return; var s=onFloor(c,petal,false); bed.appendChild(s); fallen.push(s);
    if(fallen.length>30) fallen.shift().remove();
  };

  /* ---- 8 · life you earn ----
     A simulator walked to its last step (or an explorer used a few times)
     brings a bird: to a margin tree on a wide screen, to the floor on a
     narrow one. A check answered right opens a flower on the floor and
     leaves a green leaf there. All of them right: the hero's owl is waiting
     on a stump at the end, and it nods. What is new opens when the floor
     comes into view.                                                       */
  var PB='<g class="fz-pb"><ellipse cx="0" cy="-6.5" rx="7.5" ry="5.2"/><circle cx="6.4" cy="-10.8" r="3.8"/>'+
    '<path class="bk" d="M9.8 -11.2l3.4 1-3.4 1.1z"/><path d="M-6.5 -7.5l-6 -2.4 2.6 5z"/>'+
    '<path class="ft" d="M-1.5 -1.6v1.6M1.8 -1.6v1.6"/></g>';
  var BIRDSVG='<svg viewBox="-14 -17 28 18">'+PB+'</svg>';
  var PERCH=[[0,106,610],[1,160,676],[0,24,680],[2,46,778],[1,128,723],[0,70,521]];   /* [tree, x, y] in the margin trees' own units */
  var FBSLOT=[17,35,58,71,89,8,44,81,62,29,97,50], FSLOT=[22,31,55,67,91,6,38,96,51,27];
  var FLOWER='<svg viewBox="0 0 16 22"><path d="M8 22V11" stroke="#6f9a48" stroke-width="1.4"/><path d="M8 17c-3-1-5-3-5-5 2 0 4 2 5 5z" fill="#7aa352"/>'+
    '<g class="pt" fill="#fff" stroke="#e0a33a" stroke-width=".7"><circle cx="8" cy="3.4" r="2.9"/><circle cx="12" cy="6.4" r="2.9"/><circle cx="10.5" cy="11" r="2.9"/><circle cx="5.5" cy="11" r="2.9"/><circle cx="4" cy="6.4" r="2.9"/></g>'+
    '<circle cx="8" cy="7.4" r="2.2" fill="#e0a33a"/></svg>';
  var OWL='<svg viewBox="0 0 30 38"><path d="M2 34h26l-2 4H4z" fill="#8a6240"/><path d="M4 30h22v5H4z" fill="#a98a62"/><ellipse cx="15" cy="30" rx="9" ry="1.2" fill="#cdb48e"/>'+
    '<g class="hd"><path d="M6 9l-1-6 5 4zM24 9l1-6-5 4z" fill="#6b4a2c"/><ellipse cx="15" cy="20" rx="9.5" ry="10.5" fill="#8a6240"/><ellipse cx="15" cy="23" rx="6" ry="6.6" fill="#d7b994"/>'+
    '<path d="M12 21l1.5 1.5L15 21l1.5 1.5L18 21M12 25l1.5 1.5L15 25l1.5 1.5L18 25" fill="none" stroke="#a98a62" stroke-width=".8"/>'+
    '<path d="M15 11c-3-3-8-2-8 2 0 4 4 7 8 8 4-1 8-4 8-8 0-4-5-5-8-2z" fill="#e6cfa8"/>'+
        '<path d="M14 16l1 2.4 1-2.4z" fill="#e0a33a"/></g></svg>';
  var arrivals=0, floorSeen=false, flowers=[], greens=[], owl=null;
  function bud(el){ el.classList.add('bud'); if(floorSeen) setTimeout(open,60); }
  function open(){
    if(!fl) return;
    $$('.bud',fl).forEach(function(el,k){ setTimeout(function(){ el.classList.remove('bud'); el.classList.add('opn'); },k*220); });
  }
  if(fl) new IntersectionObserver(function(es){ floorSeen=es[0].isIntersecting; if(floorSeen && !busy()) open(); },{threshold:.4}).observe(fl);

  /* every perched clay bird lives a little: now and then it looks back or pecks; at night it sleeps */
  var LIVES=[], lifeTick=0;
  setInterval(function(){
    if(busy()) return; lifeTick++;
    var night=ft()==='night';
    LIVES.forEach(function(L,i){ if(L.busy) return; var ph=(lifeTick+i*2)%7, f=night?'b10':ph===0?'b2':ph===3?'b3':'b1'; L.show(f); });
  },1300);
  function arrive(){
    var k=arrivals++;
    if(FZ.guts){
      var g=FZ.guts[k%2], p=PERCH[Math.floor(k/2)%PERCH.length], tr=$$('.fz-sway',g)[p[0]];
      if(tr && FZ.svgSpr){
        var sg=FZ.svgSpr(tr,'bird',p[1],p[2],17); sg.classList.add('fz-perch2');   /* small, and a silhouette like its tree (CSS) */
        var L={show:sg._show,busy:true}; LIVES.push(L);
        /* it lands: wings beating while the group glides in, then it folds them */
        var i=0, flap=setInterval(function(){ sg._show(i++%2?'b9':'b7'); },70);
        setTimeout(function(){ clearInterval(flap); sg._show('b6'); setTimeout(function(){ sg._show('b1'); L.busy=false; },180); },1500);
      } else if(tr){ var e=document.createElementNS(SVGNS,'g'); e.setAttribute('class','fz-perch'); e.setAttribute('transform','translate('+p[1]+','+p[2]+')');
        e.innerHTML=PB; tr.appendChild(e); }
    }
    if(fl){ var b=document.createElement('span'); b.className='fz-fbird fz-x'; b.style.left=FBSLOT[k%FBSLOT.length]+'%';
      var sp=FZ.spr?FZ.spr('bird',19):null;
      if(sp){ b.classList.add('sp'); b.appendChild(sp); var L2={show:function(f){ FZ.frame(sp,f); },busy:false}; LIVES.push(L2);
        b.addEventListener('click',function(e){ e.stopPropagation(); hop(b); L2.busy=true; FZ.seq(sp,['b4','b5','b6','b1'],12).then(function(){ L2.busy=false; }); }); }
      else { b.innerHTML=BIRDSVG; b.addEventListener('click',function(e){ e.stopPropagation(); hop(b); }); }
      fl.appendChild(b); bud(b); }
  }
  function hop(el){ el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop'); }
  $$('#p-lesson .sim').forEach(function(sim){
    var done=false, clicks=0, cnt=$('.simcnt',sim);
    function fin(){ if(!done){ done=true; arrive(); } }
    if(cnt) new MutationObserver(function(){
      var m=/(\d+)\s*\/\s*(\d+)/.exec(cnt.textContent); if(m && +m[1]===+m[2] && +m[2]>1) fin();
    }).observe(cnt,{childList:true,characterData:true,subtree:true});
    else sim.addEventListener('click',function(e){ if(!e.target.closest('.focusb') && ++clicks>=4) fin(); });
  });

  function score(){
    var r=0, n=0;
    $$('.quiz').forEach(function(q){ var o=$$('.qopt',q); if(!o.length) return; n++; if(o[0].disabled && !q.querySelector('.qopt.no')) r++; });
    return {n:n,r:r};
  }
  function sync(){
    if(!fl) return;
    var s=score();
    while(flowers.length<s.r){
      var k=flowers.length, f=document.createElement('span'); f.className='fz-flower fz-x';
      if(FZ.spr && FZ.ART.flora){   /* the clay flower opens from a bud */
        (function(fs){ fs.style.position='absolute'; f.appendChild(fs); FZ.place(fs,6,17); FZ.frame(fs,'bud');
          setTimeout(function(){ FZ.frame(fs,'half'); },700); setTimeout(function(){ FZ.frame(fs,'open'); },1400); })(FZ.spr('flora',21));
      } else f.innerHTML=FLOWER;
      f.style.left=FSLOT[k%FSLOT.length]+'%'; fl.appendChild(f); flowers.push(f); bud(f);
      f.addEventListener('click',function(e){ e.stopPropagation(); hop(this); });
      var l=onFloor('#6f9a48',false,true); bed.appendChild(l); greens.push(l);
    }
    while(flowers.length>s.r){ flowers.pop().remove(); greens.pop().remove(); }
    var perfect=s.n>0 && s.r===s.n;
    if(perfect && !owl){
      owl=document.createElement('span'); owl.className='fz-owlf fz-x'; fl.appendChild(owl);
      if(FZ.spr){   /* the clay owl on the stump: asleep at night */
        owl.innerHTML='<svg viewBox="0 0 30 38"><path d="M2 34h26l-2 4H4z" fill="#8a6240"/><path d="M4 30h22v5H4z" fill="#a98a62"/><ellipse cx="15" cy="30" rx="9" ry="1.2" fill="#cdb48e"/></svg>';
        var os=FZ.spr('owl',22); os.style.position='absolute'; owl.appendChild(os); FZ.place(os,13,26.5); FZ.face(os,-1); owl._s=os;
        FZ.frame(os,ft()==='night'?'o9':'o1');
        new MutationObserver(function(){ if(owl && owl._s) FZ.frame(owl._s,ft()==='night'?'o9':'o1'); }).observe(root,{attributes:true,attributeFilter:['data-ft']});
      } else owl.innerHTML=OWL;
      bud(owl);
      owl.addEventListener('click',function(e){ e.stopPropagation(); hop(owl); });
    } else if(!perfect && owl){ owl.remove(); owl=null; }
  }
  var pn=$('#pnum'); if(pn) new MutationObserver(sync).observe(pn,{childList:true,characterData:true,subtree:true});
  document.addEventListener('click',function(e){ if(e.target.closest && e.target.closest('.qopt,#preset')) setTimeout(sync,30); });
  sync();

  /* ---- 9 · rare visitors ----
     The doel (magpie-robin) by day, about one visit in eight: it lands,
     sings, and goes. A shooting star at night, every three minutes or so.
     A barking deer, about one visit in two on a wide screen: it peeks in at
     the left edge and ducks back if the pointer comes near.               */
  /* teacher mode (extras.js): nothing comes by itself, only on demand from the panel */
  FZ.quiet=function(){ return root.classList.contains('teach'); };
  function later(sec,fn){ setTimeout(function tick(){ if(busy() || FZ.quiet()) return setTimeout(tick,4000); fn(); },sec*1000); }   /* teacher mode holds it, so the visitor clock keeps going *
  /* when an element first comes into view (most of it), once */
  function onSeen(el,fn,th){ if(!el) return; var ob=new IntersectionObserver(function(es){ if(es[0].isIntersecting){ ob.disconnect(); fn(); } },{threshold:th||.6}); ob.observe(el); }
  function topSeen(card){ if(!card) return false; var h=$('.hdr-row',card)||card, r=h.getBoundingClientRect(); return r.top>0 && r.bottom<window.innerHeight; }
  /* a small stage on a card's top edge, at the right: every screen width shows it, and it is outside any simulator */
  function edge(card,name){
    var st=$('.fz-edge.'+name,card); if(st) return st;
    if(getComputedStyle(card).position==='static') card.style.position='relative';
    st=document.createElement('div'); st.className='fz-edge '+name; st.setAttribute('aria-hidden','true'); card.appendChild(st); return st;
  }
  var CARDS=$$('#p-lesson .card.numbered'), MID=CARDS[Math.floor(CARDS.length/2)], LAST=CARDS[CARDS.length-1];
  /* when a card's top-edge stage is fully in view below the sticky top bar: reading down the page always passes this */
  function edgeSeen(card,name,fn){
    if(!card) return; var st=edge(card,name), bar=$('.topbar'), top=bar?Math.round(bar.getBoundingClientRect().height):0;
    var ob=new IntersectionObserver(function(es){ if(es[0].isIntersecting){ ob.disconnect(); fn(); } },{rootMargin:(-top)+'px 0px 0px 0px',threshold:1});
    ob.observe(st);
  }
  FZ.edge=edge; FZ.edgeSeen=edgeSeen; FZ.later=later; FZ.topSeen=topSeen; FZ.onSeen=onSeen;   /* for the section creatures */
  var DOEL='<svg viewBox="0 0 30 24"><path d="M9 13L3 3" stroke="#1d1f22" stroke-width="3" stroke-linecap="round"/><ellipse cx="13.5" cy="14" rx="7.5" ry="5.2" fill="#1d1f22"/>'+
    '<path d="M8 15.5c2.5 4 9.5 4.6 12.4.4-4.2 1-8.4.6-12.4-.4z" fill="#f4f2ec"/><path d="M10 12h6" stroke="#f4f2ec" stroke-width="1.7" stroke-linecap="round"/>'+
    '<circle cx="20.6" cy="9.4" r="3.9" fill="#1d1f22"/><path d="M24.2 9l3.6 1-3.6 1z" fill="#1d1f22"/>'+
    '<path d="M12.5 19v4.5M15.5 19v4.5" stroke="#55606a" stroke-width="1.1"/></svg>';
  var NOTE='<svg viewBox="0 0 10 14"><path d="M7 1.5v8.2" stroke="currentColor" stroke-width="1.3"/><ellipse cx="4.9" cy="10.2" rx="2.4" ry="1.8" fill="currentColor"/><path d="M7 1.5c1.6 1 2.5 2.2 2.5 4.3" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
  function sing(el,then,times){
    var n=0, max=times||5;
    (function note(){
      if(!el.isConnected) return;
      if(n++>=max){ if(then) then(); return; }
      var r=el.getBoundingClientRect(), s=document.createElement('span'); s.className='fz-note'; s.innerHTML=NOTE; s.setAttribute('aria-hidden','true');
      s.style.left=(r.left+r.width*.7)+'px'; s.style.top=(r.top-4)+'px'; document.body.appendChild(s);
      s.animate([{transform:'translate(0,0) rotate(-8deg)',opacity:0},{opacity:.85,offset:.2},{transform:'translate('+rnd(4,16)+'px,-34px) rotate(10deg)',opacity:0}],
        {duration:1700,easing:'ease-out'}).onfinish=function(){ s.remove(); };
      setTimeout(note,rnd(500,900));
    })();
  }
  var doelOn=false;
  /* the clay doel's visit, wherever it lands: (host, x, y) is the perch in the host's own coordinates */
  async function doelVisit(host,x,y,from,to,fixed){
    var d=FZ.spr('doel',fixed?30:26,'fz-doel fz-doel2 tap'); d.style.position=fixed?'fixed':'absolute'; d.style.zIndex=fixed?'0':'3';
    host.appendChild(d); d.addEventListener('click',function(e){ e.stopPropagation(); sing(d,null,3); d.animate([{translate:'0 0'},{translate:'0 -5px'},{translate:'0 0'}],{duration:320}); });
    if(!fixed) from=offTo(host,from[0]<x?-1:1);   /* it comes in from above the screen, never from past its right edge */
    var dir=from[0]<x?1:-1;
    await FZ.fly(d,from,[from[0]+dir*60,from[1]+40],[x-dir*70,y-60],[x,y],1150,['w1','w2','w3','w4','w5','w6'],22);
    FZ.face(d,dir); await FZ.seq(d,['flare','touch','p1'],9);
    var R=[['p2',600],['p4',900,1],['p1',300],['p3',750],['p1',250],['p4',900,1],['p6',320],['p1',500]];
    for(var i=0;i<R.length && d.isConnected;i++){ FZ.frame(d,R[i][0]); if(R[i][2]) notesAt(d); await FZ.wait(R[i][1]); }
    await FZ.seq(d,['crouch'],10);
    if(!fixed) to=offTo(host,to[0]<x?-1:1);
    await FZ.fly(d,[x,y],[x+(to[0]-x)*.3,y-50],[to[0]-(to[0]-x)*.2,to[1]+40],to,fixed?1100:offMs([x,y],to),['w1','w2','w3','w4','w5','w6'],22);
    d.remove();
  }
  function notesAt(d){ sing(d,null,2); }
  function doel(force,card){
    if(doelOn || (!day() && !force)) return; doelOn=true;
    if(FZ.spr){
      var done=function(){ doelOn=false; };
      /* not on the margin silhouettes any more (Jamil, 2026-11-15): on a branch that grows out of a section in view, else on the floor */
      var limb=(FZ.limbs||[]).filter(function(l){ var r=l.getBoundingClientRect(); return getComputedStyle(l).display!=='none' && r.top>60 && r.bottom<window.innerHeight; })[0];
      if(limb && !card){ doelVisit(limb,limb._px,limb._py,[0,0],[-1,0],false).then(done); }
      else if(WIDE.matches && FZ.flsky && inView(fl)){ var fx=fl.clientWidth*.46+34; doelVisit(FZ.flsky,fx,floorY(),[fx+200,0],[fx-200,0],false).then(done); }
      else if(card){
        var st=edge(card,'doel'), w=st.clientWidth||130;
        doelVisit(st,w-24,33,[w+90,-150],[w+120,-170],false).then(done);
      } else if(fl){
        var ob=new IntersectionObserver(function(es){ if(!es[0].isIntersecting) return; ob.disconnect();
          var fx=fl.clientWidth*.46+34; doelVisit(FZ.flsky||fl,fx,floorY(),[fx+120,-10],[fx-160,-20],false).then(done); },{threshold:.6});
        ob.observe(fl);
      } else doelOn=false;
      return;
    }
    var d=document.createElement('span'); d.className='fz-doel'; d.setAttribute('aria-hidden','true'); d.innerHTML=DOEL;
    function leave(){ d.classList.add('go'); setTimeout(function(){ d.remove(); doelOn=false; },1600); }
    if(WIDE.matches && FZ.guts){
      /* on the right lobe of the round tree, in the margin */
      var g=FZ.guts[Math.random()<.5?0:1], c=$$('.fz-crown',g)[1]; if(!c){ doelOn=false; return; }
      var r=c.getBoundingClientRect(), side=g.classList.contains('r');
      d.classList.add('m'); if(side) d.classList.add('flip');
      d.style.left=(side?r.left+r.width*.08:r.right-r.width*.38)+'px'; d.style.top=(r.top+r.height*.1-18)+'px';
      document.body.appendChild(d);
      setTimeout(function(){ sing(d,function(){ setTimeout(leave,900); }); },1500);
    } else if(card){
      /* on the top edge of the card the reader has reached */
      d.classList.add('e'); edge(card,'doel').appendChild(d);
      setTimeout(function(){ sing(d,function(){ setTimeout(leave,900); }); },1500);
    } else if(fl){
      /* on the fern on the floor, once the floor is in view */
      d.classList.add('f');
      var ob=new IntersectionObserver(function(es){ if(!es[0].isIntersecting) return; ob.disconnect();
        fl.appendChild(d); setTimeout(function(){ sing(d,function(){ setTimeout(leave,900); }); },1500); },{threshold:.6});
      ob.observe(fl);
    } else doelOn=false;
  }
  var DEER='<svg viewBox="0 0 70 58"><g class="bd"><ellipse cx="18" cy="35" rx="22" ry="10.5"/><path d="M31 31l9-15 8 3-7 16z"/>'+
    '<path d="M36 41h3.4v17H36zM42.5 40h3.4v18h-3.4z"/></g><path class="th" d="M38 33l6-13 3 1-5 13z"/>'+
    '<g class="hd"><path class="bd" d="M42 12c3-3 9-3 12 0l9 7c1.4 1.2.6 3.2-1.2 3.2l-9.8-.6c-4 0-8-2-10-5z"/>'+
    '<path class="ear bd" d="M44.5 11.5l-5-7 7.5 4.5z"/><path class="ant" d="M47.5 9.5l.6-6.5M48.1 3l2.4 1"/>'+
    '<path class="st" d="M47 11.5l6 6"/><circle class="ns" cx="62.6" cy="20.8" r="1"/></g></svg>';
  var deerOn=false;
  function deer(){
    if(deerOn) return;
    /* on the floor whenever the floor is on screen (in front of it, any width); else in the margin on a wide screen */
    var narrow=!WIDE.matches || !FZ.guts || inView(fl); if(narrow && !fl) return; deerOn=true;
    var d=document.createElement('span'); d.className='fz-deer'+(narrow?' fd':''); d.setAttribute('aria-hidden','true'); d.innerHTML=DEER;
    if(narrow) fl.insertBefore(d,fl.querySelector('.fz-bed')); else FZ.guts[0].appendChild(d);   /* on a phone: behind the den, peeking over it */
    /* the clay deer: it walks in, stands, grazes and looks back; it bounds away when the pointer comes near */
    var ds=null, stopW=null;
    if(FZ.spr && FZ.ART.deer){ d.innerHTML=''; d.classList.add('sp'); ds=FZ.spr('deer',narrow?40:54); ds.style.position='absolute'; d.appendChild(ds);
      FZ.place(ds,39,narrow?55:63); stopW=FZ.loop(ds,['r1','r2','r3','r4'],8);
      (async function(){ await FZ.wait(1600); if(stopW){ stopW(); stopW=null; }
        var R=[['r5',1200],['r6',1600],['r11',1400],['r5',700],['r7',1300],['r5',900],['r6',1500]];
        for(var i=0;i<R.length && !gone && ds.isConnected;i++){ FZ.frame(ds,R[i][0]); await FZ.wait(R[i][1]); } })();
    }
    void d.offsetWidth; d.classList.add('peek');
    var gone=false;
    function away(fast){ if(gone) return; gone=true; window.removeEventListener('pointermove',near);
      if(ds){ if(stopW) stopW(); FZ.face(ds,-1); FZ.loop(ds,fast?['r13','r14','r15']:['r1','r2','r3','r4'],fast?9:8); }
      d.classList.add(fast?'duck':'leave'); setTimeout(function(){ d.remove(); },fast?600:1600); }
    function near(e){ var r=d.getBoundingClientRect(); if(Math.abs(e.clientX-(r.left+r.width/2))<170 && Math.abs(e.clientY-(r.top+r.height/2))<170) away(true); }
    setTimeout(function(){ window.addEventListener('pointermove',near,{passive:true}); },1200);
    setTimeout(function(){ away(false); },10000);
  }
  /* Not left to chance (Jamil, 2026-11-14: "they should not be too random and everyone should see it"):
     the doel comes by day when the reader reaches the middle section; the deer when the reader reaches the
     page to keep (on a narrow screen, at the floor); a shooting star 15 s into Night, then every 3 minutes. */
  if(MID){ if(WIDE.matches) onSeen($('.hdr-row',MID)||MID,function(){ later(1.5,function(){ doel(false); }); },1);
    else edgeSeen(MID,'doel',function(){ later(1,function(){ doel(false,MID); }); }); }
  if(LAST) onSeen(WIDE.matches?($('.hdr-row',LAST)||LAST):fl,function(){ later(1.5,deer); },WIDE.matches?1:.6);
  /* then they keep coming (Jamil, 2026-11-14: "visible all the time or with minimum gap"): every minute and a half or
     so, the doel by day and the deer in turn, wherever the reader is. On a narrow screen the doel takes the edge of a
     card in view with no creature of its own, else the floor if it is in view; the deer needs the floor in view. */
  /* the floor's ground line, in the floor's sky layer (which sits above the floor's top margin) */
  function floorY(){ var s=FZ.flsky; return (s?fl.getBoundingClientRect().top-s.getBoundingClientRect().top:0)+fl.clientHeight-14; }
  function inView(el){ if(!el) return false; var r=el.getBoundingClientRect(); return r.bottom>0 && r.top<window.innerHeight; }
  function freeCard(){ return CARDS.filter(function(c){ return topSeen(c) && !$$('.fz-edge',c).some(function(e){ return !/\b(doel|comb)\b/.test(e.className) && (e.childNodes.length || e.on); }); })[0]; }
  var vturn=0;
  (function again(){ later(rnd(75,105),function(){
    var wide=WIDE.matches && FZ.guts, k=vturn++%2;
    if(k===0 && day()){ if(wide) doel(false); else { var c=freeCard(); if(c) doel(false,c); else if(inView(fl)) doel(false); } }
    else if(wide || inView(fl)) deer();
    again(); }); })();
  var nightFor=0, starAt=15;
  setInterval(function(){
    if(busy()) return;
    if(ft()==='night'){ nightFor++; if(nightFor>=starAt){ star(); starAt=nightFor+180; } } else { nightFor=0; starAt=15; }
  },1000);
  if(FORCE==='doel') later(2,function(){ doel(true); });
  if(FORCE==='deer') later(2,deer);
  if(FORCE==='star') later(2,star);

  /* ---- 10 · the season ----
     Winter: on Morning, fog over the hero's picture and over the floor; the
     pointer wipes it, and it closes again slowly. Spring: shimul flowers in
     the margin trees and red petals on the floor. Summer: krishnachura.
     Monsoon: a shower over the hero now and then, and a frog on the floor.
     Autumn: white kash flowers on the floor, which bend away from the pointer. */
  function fog(host){
    var c=document.createElement('canvas'); c.className='fz-fog'; c.setAttribute('aria-hidden','true'); host.appendChild(c);
    var g=c.getContext('2d'), w=0, h=0, blobs=[], wipes=[], seen=false, lt=0, white=sprite([255,255,255],.55), hole=sprite([0,0,0],.6);
    function sz(){ var r=host.getBoundingClientRect(); w=Math.max(1,r.width); h=Math.max(1,r.height); c.width=Math.round(w); c.height=Math.round(h);
      blobs=[]; var n=Math.max(8,Math.round(w*h/9000)); n=Math.min(n,30);
      for(var i=0;i<n;i++) blobs.push({x:rnd(-.1,1.1)*w,y:rnd(.15,1)*h,r:rnd(.18,.34)*Math.max(h,w*.35),v:rnd(4,9)*(i%2?1:-1),a:rnd(.45,.75)}); }
    function frame(ts){
      requestAnimationFrame(frame);
      var on=seen && !busy() && ft()==='morning';
      if(!on){ if(lt){ g.clearRect(0,0,w,h); lt=0; } return; }
      var t=ts/1000, dt=Math.min(.08,lt?t-lt:0); if(lt && dt<.04) return; lt=t;
      g.clearRect(0,0,w,h); g.globalCompositeOperation='source-over';
      for(var i=0;i<blobs.length;i++){ var b=blobs[i]; b.x+=b.v*dt; if(b.x<-b.r) b.x=w+b.r; if(b.x>w+b.r) b.x=-b.r;
        g.globalAlpha=b.a; g.drawImage(white,b.x-b.r,b.y-b.r*.6,b.r*2,b.r*1.2); }
      g.globalCompositeOperation='destination-out';
      for(var j=wipes.length-1;j>=0;j--){ var p=wipes[j]; p.age+=dt; if(p.age>14){ wipes.splice(j,1); continue; }
        g.globalAlpha=.9*(1-p.age/14); g.drawImage(hole,p.x-48,p.y-48,96,96); }
      g.globalCompositeOperation='source-over'; g.globalAlpha=1;
    }
    host.addEventListener('pointermove',function(e){
      var r=host.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top, q=wipes[wipes.length-1];
      if(q && Math.abs(q.x-x)+Math.abs(q.y-y)<14) return;
      wipes.push({x:x,y:y,age:0}); if(wipes.length>140) wipes.shift();
    });
    new IntersectionObserver(function(es){ seen=es[0].isIntersecting; }).observe(host);
    window.addEventListener('resize',sz); sz(); requestAnimationFrame(frame);
  }
  var art=$('#p-lesson .fhero .heroart');
  if(season==='winter'){ if(art) fog(art); if(fl) fog(fl); }

  /* blossom in the margin trees: shimul in spring, krishnachura in summer */
  if((season==='spring'||season==='summer') && FZ.guts){
    var BL=season==='spring'
      ? [[0,[[58,575],[84,592],[40,640],[99,648],[30,705],[70,690],[112,712],[52,730]]],[1,[[146,690],[176,700],[160,722],[130,742],[192,738]]],[2,[[24,770],[34,800]]]]
      : [[1,[[140,686],[158,680],[178,692],[150,705],[170,712],[192,724],[124,736],[140,756],[200,748],[184,762],[160,740]]],[0,[[70,600],[46,668]]],[2,[[30,790]]]];
    FZ.guts.forEach(function(g){
      var sw=$$('.fz-sway',g);
      BL.forEach(function(t){ var e=document.createElementNS(SVGNS,'g'); e.setAttribute('class','fz-bloom');
        e.innerHTML=t[1].map(function(p){ return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(season==='spring'?3.4:4.2)+'"/>'; }).join('');
        if(sw[t[0]]) sw[t[0]].appendChild(e); });
    });
  }
  if(fl){
    var extra='';
    if(PETALC[season]) for(var pi=0;pi<8;pi++)
      extra+='<i class="fz-petal" style="left:'+rnd(3,96).toFixed(1)+'%;bottom:'+rnd(12,19).toFixed(0)+'px;transform:rotate('+rnd(0,360).toFixed(0)+'deg)"><svg viewBox="0 0 16 12"><path d="'+FZ.PETAL+'" fill="'+PETALC[season]+'"/></svg></i>';
    if(season==='autumn') [3,25,41,60,71,94].forEach(function(x,k){
      var st='';
      for(var j=0;j<3;j++){ var hgt=rnd(30,46), lean=rnd(-9,9);
        st+='<g class="ks" style="--r:'+lean.toFixed(1)+'deg;animation-delay:'+rnd(-6,0).toFixed(2)+'s"><path d="M'+(10+j*5)+' 60V'+(60-hgt).toFixed(0)+'" stroke="#b9a46a" stroke-width="1.1"/>'+
            '<path class="pl" d="M'+(10+j*5)+' '+(60-hgt).toFixed(0)+'c-3 4-3 9 0 13c3-4 3-9 0-13z"/></g>'; }
      extra+='<span class="fz-kash" style="left:'+x+'%"><svg viewBox="0 0 30 60">'+st+'</svg></span>';
    });
    if(season==='monsoon') extra+='<span class="fz-frog fz-x"><svg viewBox="0 0 26 18"><path d="M3 15c0-6 4-10 10-10s10 4 10 10z" fill="#6f9a48"/>'+
      '<circle cx="8.5" cy="6.5" r="3" fill="#6f9a48"/><circle cx="17.5" cy="6.5" r="3" fill="#6f9a48"/>'+
      '<path d="M8 12c3 1.6 7 1.6 10 0" fill="none" stroke="#3f5f28" stroke-width=".9"/><path d="M1 17c2-2 4-2 6-1M25 17c-2-2-4-2-6-1" stroke="#55704a" stroke-width="1.8" stroke-linecap="round"/></svg></span>';
    if(extra){ var hold=document.createElement('div'); hold.innerHTML=extra;
      while(hold.firstChild) fl.insertBefore(hold.firstChild,fl.querySelector('.fz-hog')); }
    var frog=$('.fz-frog',fl);
    if(frog){ frog.addEventListener('pointerenter',function(){ hop(frog); }); frog.addEventListener('click',function(e){ e.stopPropagation(); hop(frog); }); }
    var kash=$$('.fz-kash',fl);
    if(kash.length){ var kt=null, kx=null;
      var kbend=function(){ kt=null; var r=fl.getBoundingClientRect();
        kash.forEach(function(k){ var d=kx===null?999:k.offsetLeft+k.offsetWidth/2-(kx-r.left), a=Math.abs(d)<60?(d>0?1:-1)*(60-Math.abs(d))*.35:0; k.style.setProperty('--p',a.toFixed(1)+'deg'); }); };
      fl.addEventListener('pointermove',function(e){ kx=e.clientX; if(!kt) kt=requestAnimationFrame(kbend); });
      fl.addEventListener('pointerleave',function(){ kx=null; if(!kt) kt=requestAnimationFrame(kbend); });
    }
  }

  /* monsoon: a short shower over the hero now and then; the drops ring at the bottom */
  if(season==='monsoon'){
    var rainAt=performance.now()/1000+(FORCE==='rain'?2:20), rainFor=0;
    FZ.rainNow=function(){ rainAt=performance.now()/1000; rainFor=0; };
    FZ.sky.push(function(S){
      var now=performance.now()/1000;
      if(!S.rain){ S.rain=[]; S.ring=[]; }
      if(now>rainAt && !rainFor){ rainFor=25; rainAt=now; }
      var on=rainFor && now-rainAt<rainFor, f=on?Math.min(1,(now-rainAt)/3,(rainAt+rainFor-now)/3):0;
      if(rainFor && !on){ rainFor=0; rainAt=now+240; }
      var c=S.cx, n=Math.round(f*Math.min(140,S.W*S.H/2600)), night=S.mode==='night';
      while(S.rain.length<n) S.rain.push({x:rnd(-40,S.W),y:rnd(-S.H,0),v:rnd(380,520)});
      c.strokeStyle=night?'rgba(170,190,210,1)':'rgba(110,135,150,1)'; c.lineWidth=1; c.globalAlpha=night?.3:.32;
      c.beginPath();
      for(var i=S.rain.length-1;i>=0;i--){ var d=S.rain[i]; d.y+=d.v*S.dt; d.x+=d.v*.12*S.dt;
        if(d.y>S.H*rnd(.8,1)){ if(S.ring.length<40) S.ring.push({x:d.x,y:d.y,r:1,a:.5}); if(S.rain.length>n){ S.rain.splice(i,1); continue; } d.y=rnd(-40,0); d.x=rnd(-40,S.W); }
        c.moveTo(d.x,d.y); c.lineTo(d.x-1.6,d.y-11); }
      c.stroke();
      for(var j=S.ring.length-1;j>=0;j--){ var g=S.ring[j]; g.r+=14*S.dt; g.a-=.6*S.dt; if(g.a<=0){ S.ring.splice(j,1); continue; }
        c.globalAlpha=g.a; c.beginPath(); c.ellipse(g.x,g.y,g.r,g.r*.3,0,0,6.283); c.stroke(); }
    });
  }

  /* ---- 11 · one background egg per class, tied to its topic ----
     Trees 1, siblings: two chicks on one branch, a parent above who feeds them.
     Trees 2, the walk round the tree: an ant walks the outline of a margin pine,
     down the left of every ledge and up the right (on a narrow screen, round the
     fern on the floor). Trees 3, the rolling acorn: on the floor stands a small
     tree of twigs, root at the top; each acorn that drops rolls left if it is
     smaller than the acorn at a fork and right if bigger, and stops at the first
     empty knot. Later classes add theirs here.                              */
  var PG=(/\/0(\d)-[a-z-]+\.html/.exec(location.pathname)||[])[1]||'';

  /* Trees 1, siblings: on the top edge of Section 2 ("The words"), when the reader reaches it, and again
     whenever "Siblings" is picked in the word explorer while that edge is in view. */
  var BR='<path class="br" d="M2 31C40 30 80 29 128 26M92 29C94 22 95 16 97 12"/><path class="lf" d="M97 12c-5-2-7-6-6-9 4 1 6 4 6 9z"/>';
  /* a point past the edge of the screen, in a host's own coordinates: leaving birds fly there, never vanish mid-page */
  function offTo(host,side){ var r=host.getBoundingClientRect(); return [side<0?-r.left-90:window.innerWidth-r.left-40, -r.top-90]; }   /* rightwards: out of the top, inside the page's width */
  function offMs(a,b){ return Math.min(3500,Math.max(1500,Math.hypot(b[0]-a[0],b[1]-a[1])*2.1)); }
  async function sibsClay(st){
    st.innerHTML='<svg viewBox="0 0 130 34">'+BR+'</svg>';
    var c1=FZ.spr('bird',10,'fz-chick'), c2=FZ.spr('bird',10,'fz-chick'), pa=FZ.spr('bird',17);
    [c1,c2,pa].forEach(function(e){ e.style.position='absolute'; st.appendChild(e); });
    FZ.place(c1,72,30); FZ.place(c2,118,27); FZ.face(c2,-1);
    c1.classList.add('opn'); c2.classList.add('opn');
    await FZ.fly(pa,[130,-110],[128,-60],[110,-20],[96,13],1100,['b7','b9'],14);   /* from above, inside the page's width */
    FZ.frame(pa,'b6'); await FZ.wait(180); FZ.frame(pa,'b1'); await FZ.wait(500);
    for(var r=0;r<2 && st.isConnected;r++){
      FZ.face(pa,-1); FZ.frame(pa,'b3'); FZ.seq(c1,['b4','b5','b4','b1'],8); await FZ.wait(650); FZ.frame(pa,'b1'); await FZ.wait(350);
      FZ.face(pa,1); FZ.frame(pa,'b3'); FZ.seq(c2,['b4','b5','b4','b1'],8); await FZ.wait(650); FZ.frame(pa,'b1'); await FZ.wait(450);
    }
    FZ.frame(pa,'b2'); await FZ.wait(700);
    var o=offTo(st,1);
    await Promise.all([FZ.fly(pa,[96,13],[120,-10],[o[0]-160,o[1]+140],o,offMs([96,13],o),['b7','b9'],14),
      (async function(){ await FZ.wait(250); await FZ.fly(c1,[72,30],[95,10],[o[0]-180,o[1]+160],[o[0]-14,o[1]+6],offMs([72,30],o),['b7','b9'],16); })(),
      (async function(){ await FZ.wait(450); await FZ.fly(c2,[118,27],[140,8],[o[0]-150,o[1]+170],[o[0]+12,o[1]+12],offMs([118,27],o),['b7','b9'],16); })()]);
    st.innerHTML=''; st.on=false;
  }
  function sibs(){
    var card=$('#s2'); if(!card) return;
    var st=edge(card,'sib'); if(st.on) return; st.on=true;
    if(FZ.spr){ sibsClay(st); return; }
    st.innerHTML='<svg viewBox="0 0 130 34">'+BR+'<g class="fz-sib2"><g class="sp" transform="translate(96,13) scale(.95)">'+PB+'</g>'+
      '<g class="sc" transform="translate(74,30) scale(.62)">'+PB+'</g><g class="sc s2" transform="translate(118,27) scale(.62)">'+PB+'</g></g></svg>';
    var g=$('.fz-sib2',st);
    setTimeout(function(){ g.classList.add('feed'); },2000);
    setTimeout(function(){ g.classList.add('go'); },10500);
    setTimeout(function(){ st.innerHTML=''; st.on=false; },12600);
  }

  /* Trees 2, the walk round the tree: on the top edge of Section 1 ("One walk, three visits") an ant walks
     round a small twig: up the trunk, out to each tip and back, as the walk in Section 1 does. When the reader
     reaches that edge, and again when the walk simulator reaches its end with the edge in view. */
  var antOn=false;
  function ant(){
    var card=$('#s1'); if(antOn || !card) return; antOn=true;
    var st=edge(card,'ant');
    st.innerHTML='<svg viewBox="0 0 130 34"><path class="br" d="M100 34V20L88 6M100 20L112 6"/><path class="lf" d="M88 6c-5-1-7-4-7-6 3 0 6 2 7 6z"/><path class="lf" d="M112 6c5-1 7-4 7-6-3 0-6 2-7 6z"/>'+
      '<path class="route" d="M100 34V20L88 6L100 20L112 6L100 20V34" fill="none" stroke="none"/></svg>';
    var svg=$('svg',st), path=$('.route',st), L=path.getTotalLength(), a=document.createElementNS(SVGNS,'g'); a.setAttribute('class','fz-ant');
    a.innerHTML='<circle cx="-3.4" cy="0" r="1.9"/><circle cx="0" cy="0" r="1.4"/><circle cx="2.8" cy="0" r="1.6"/>'+
      '<path d="M-1 0l-1.6-2.4M-1 0l-1.6 2.4M.4 0l.6-2.6M.4 0l.6 2.6M1.6 0l2-2.2M1.6 0l2 2.2"/>';
    svg.appendChild(a);
    var d=0, last=0, speed=9;
    (function step(ts){
      if(!a.isConnected){ antOn=false; return; }
      var t=ts/1000, dt=last?Math.min(.1,t-last):0; last=t;
      if(!busy()) d+=speed*dt;
      if(d>=L){ setTimeout(function(){ st.innerHTML=''; antOn=false; },1200); return; }
      var p=path.getPointAtLength(d), q=path.getPointAtLength(Math.min(L,d+1)), ang=Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI;
      a.setAttribute('transform','translate('+p.x.toFixed(2)+','+p.y.toFixed(2)+') rotate('+ang.toFixed(1)+') scale(.6)');
      requestAnimationFrame(step);
    })(0);
  }

  /* the rolling acorn: a tree of twigs, root at the top, seven knots */
  var KN=[[40,9],[20,25],[60,25],[10,41],[30,41],[50,41],[70,41]];
  function acornTree(){
    if(!fl) return;
    var w=document.createElement('span'); w.className='fz-bst fz-x'; w.setAttribute('aria-hidden','true');
    var tw='';
    [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]].forEach(function(e){ var a=KN[e[0]], b=KN[e[1]]; tw+='<path d="M'+a[0]+' '+a[1]+'L'+b[0]+' '+b[1]+'"/>'; });
    w.innerHTML='<svg viewBox="0 0 80 58"><g class="tw"><path d="M40 9V0"/>'+tw+'</g><g class="ac"></g></svg>';
    fl.insertBefore(w,fl.querySelector('.fz-hog'));
    var g=$('.ac',w), held=[], seen=false, busyDrop=false, order=[];
    function nut(r){ var e=document.createElementNS(SVGNS,'g'); e.setAttribute('class','nut');
      e.innerHTML='<ellipse cx="0" cy="'+(r*.25).toFixed(2)+'" rx="'+(r*.82).toFixed(2)+'" ry="'+r.toFixed(2)+'" class="nb"/><path d="M'+(-r)+' '+(-r*.25)+'q'+r+' '+(-r*1.1)+' '+(2*r)+' 0z" class="cp"/>'; return e; }
    function round(){ var a=[1,2].sort(function(){return Math.random()-.5;}), b=[0,1,2,3].sort(function(){return Math.random()-.5;});
      /* keys 1..7 by rank; 4 first, then 2 and 6, then 1 3 5 7: always lands as a full tree of three levels */
      order=[4].concat(a.map(function(i){ return i*4-2; }), b.map(function(i){ return i*2+1; })); }
    function slot(key){ var i=0; while(held[i]!==undefined){ i=key<held[i]?2*i+1:2*i+2; } return i; }
    function route(key){ var i=0, pts=[[40,-6],KN[0]]; while(held[i]!==undefined){ i=key<held[i]?2*i+1:2*i+2; pts.push(KN[i]); } return {i:i,pts:pts}; }
    function drop(){
      if(busyDrop) return;
      if(!order.length){ busyDrop=true; w.classList.add('shake');
        setTimeout(function(){ g.innerHTML=''; held=[]; w.classList.remove('shake'); busyDrop=false; round(); },1200); return; }
      busyDrop=true;
      var key=order.shift(), r=2.4+key*.42, rt=route(key), e=nut(r); g.appendChild(e);
      var seg=0, f=0, last=0;
      (function roll(ts){
        var t=ts/1000, dt=last?Math.min(.1,t-last):0; last=t;
        if(!busy()){
          var a=rt.pts[seg], b=rt.pts[seg+1], len=Math.hypot(b[0]-a[0],b[1]-a[1])||1; f+=dt*(seg===0?60:34)/len;
          if(f>=1){ f=0; seg++; }
        }
        if(seg>=rt.pts.length-1){ var p=rt.pts[rt.pts.length-1]; e.setAttribute('transform','translate('+p[0]+','+(p[1]-r*.9)+')'); held[rt.i]=key; busyDrop=false; return; }
        var A=rt.pts[seg], B=rt.pts[seg+1];
        e.setAttribute('transform','translate('+(A[0]+(B[0]-A[0])*f).toFixed(2)+','+(A[1]+(B[1]-A[1])*f-r*.9).toFixed(2)+') rotate('+((seg+f)*140*(B[0]<A[0]?-1:1)).toFixed(0)+')');
        requestAnimationFrame(roll);
      })(0);
    }
    round();
    w.addEventListener('click',function(e){ e.stopPropagation(); drop(); });
    new IntersectionObserver(function(es){ seen=es[0].isIntersecting; },{threshold:.4}).observe(fl);
    setInterval(function(){ if(seen && !busy()) drop(); },6500);
    FZ.bstDrop=drop;
  }

  /* Trees 4, pruning: a sapling on the floor with one dead twig, which has one live twig under it.
     Click the dead twig: it drops, and the live twig moves up into its place (case 2). It grows back. */
  function prune(){
    if(!fl) return;
    var w=document.createElement('span'); w.className='fz-prune fz-x'; w.setAttribute('aria-hidden','true');
    w.innerHTML='<svg viewBox="0 0 70 56"><path class="wd" d="M35 56V30M35 30L18 16"/><path class="lf" d="M18 16c-6-1-8-5-8-8 4 0 7 3 8 8z"/>'+
      '<g class="dead"><path d="M35 30L52 18"/><circle cx="52" cy="18" r="1.6"/></g>'+
      '<g class="kid"><path class="wd" d="M52 18L62 8"/><path class="lf" d="M62 8c5-1 7-4 7-7-3 0-6 2-7 7z"/></g></svg>';
    fl.insertBefore(w,fl.querySelector('.fz-hog'));
    var dead=$('.dead',w), cut=false;
    dead.addEventListener('click',function(e){
      e.stopPropagation(); if(cut || busy()) return; cut=true; w.classList.add('cut');
      setTimeout(function(){ w.classList.remove('cut'); w.classList.add('grow'); setTimeout(function(){ w.classList.remove('grow'); cut=false; },1600); },22000);
    });
    FZ.prune=function(){ dead.dispatchEvent(new MouseEvent('click',{bubbles:true})); };
    onSeen(fl,function(){ later(2,FZ.prune); });
  }
  if(PG==='4') prune();
  if(PG==='1'){
    edgeSeen($('#s2'),'sib',function(){ later(.6,sibs); });
    var pick=$('#tw-pick'); if(pick) pick.addEventListener('click',function(e){ var b=e.target.closest('button'); if(b && b.dataset.w==='siblings' && topSeen($('#s2'))) sibs(); });
    if(FORCE==='sib') later(2,sibs);
  }
  if(PG==='2'){
    edgeSeen($('#s1'),'ant',function(){ later(.6,ant); });
    var wcnt=$('#s1 .sim .simcnt');
    if(wcnt) new MutationObserver(function(){ var m=/(\d+)\s*\/\s*(\d+)/.exec(wcnt.textContent); if(m && +m[1]===+m[2] && topSeen($('#s1'))) ant(); }).observe(wcnt,{childList:true,characterData:true,subtree:true});
    if(FORCE==='ant') later(2,ant);
  }
  if(PG==='3') acornTree();

  /* ---- 12 · the acorn hunt ----
     Every tree page hides three acorns: in the hero's grass, inside a Dig deeper,
     and at the end of the Exam tab. A click sends one to the hedgehog's pile on
     the floor. The pile is kept across all six pages in this browser; with all
     eighteen found, the hedgehog's den gets a little door.                    */
  var AKEY='cse2321-forest-acorns', ALL=18, found=[];
  try{ found=JSON.parse(localStorage.getItem(AKEY)||'[]')||[]; }catch(e){ found=[]; }
  if(FORCE==='den') found=['a1','a2','a3','a4','a5','a6','a7','a8','a9','a10','a11','a12','a13','a14','a15','a16','a17','a18'];
  var ACORN='<svg viewBox="0 0 14 16"><path d="M7 15c-4 0-5.6-3.6-5.6-7h11.2c0 3.4-1.6 7-5.6 7z" fill="#c69a5b"/><path d="M1 8.2C1 4.6 3.6 3 7 3s6 1.6 6 5.2z" fill="#8a6240"/>'+
    '<path d="M2.4 6.4h9.2M3 4.8h8" stroke="#6b4a2c" stroke-width=".6"/><path d="M7 3V.8" stroke="#6b4a2c" stroke-width="1.3" stroke-linecap="round"/></svg>';
  var den=null, pile=null;
  if(fl){
    den=document.createElement('span'); den.className='fz-den fz-x'; den.setAttribute('aria-hidden','true');
    den.innerHTML='<svg viewBox="0 0 48 26"><path d="M2 25c0-12 9-20 22-20s22 8 22 20z" fill="#8a6240"/><path d="M8 25c0-8 7-14 16-14" fill="none" stroke="#6b4a2c" stroke-width="1"/>'+
      '<ellipse cx="24" cy="20" rx="7.5" ry="6.5" fill="#3a2a1c"/><g class="door"><ellipse cx="24" cy="20" rx="6.6" ry="5.8" fill="#c69a5b" stroke="#6b4a2c" stroke-width=".8"/>'+
      '<path d="M24 14.4v11.2M19 18h10" stroke="#a98a62" stroke-width=".5"/><circle cx="27.4" cy="20.4" r=".8" fill="#6b4a2c"/></g></svg>';
    fl.insertBefore(den,fl.querySelector('.fz-hog'));
    pile=document.createElement('span'); pile.className='fz-pile'; pile.setAttribute('aria-hidden','true');
    fl.insertBefore(pile,fl.querySelector('.fz-hog'));
  }
  function showPile(){
    if(!pile) return;
    var n=Math.min(ALL,found.length), h='', i=0;
    for(var row=0;row<4 && i<n;row++) for(var col=0;col<6-row && i<n;col++,i++)   /* a heap: six at the bottom, then five, four, three */
      h+='<i style="left:'+(col*9+row*4.5)+'px;bottom:'+(row*7)+'px;transform:rotate('+((i*47)%40-20)+'deg)">'+ACORN+'</i>';
    pile.innerHTML=h; if(den) den.classList.toggle('open',found.length>=ALL);
  }
  function hide(id,host,css){
    if(!host || found.indexOf(id)>=0) return;
    var a=document.createElement('span'); a.className='fz-acorn'; a.setAttribute('aria-hidden','true'); a.innerHTML=ACORN;
    if(css) a.style.cssText=css; host.appendChild(a);
    a.addEventListener('click',function(e){
      e.stopPropagation(); if(a.classList.contains('got')) return;
      a.classList.add('got'); if(found.indexOf(id)<0) found.push(id);
      try{ localStorage.setItem(AKEY,JSON.stringify(found)); }catch(x){}
      setTimeout(function(){ a.remove(); },900); showPile();
    });
  }
  if(PG){
    var hero=$('#p-lesson .fhero'), dig=$('details.dig'), ex=$('#p-exam main')||$('#p-exam'), keep=$('.keep3');
    hide('t'+PG+'a',hero,'left:2.2%;bottom:10px');
    var slot=dig||(keep&&keep.parentNode);   /* the first Dig deeper on the page, else the page to keep */
    if(slot){ var body=document.createElement('span'); body.className='fz-acorn-slot'; slot.appendChild(body); hide('t'+PG+'b',body); }
    if(ex){ var foot=document.createElement('div'); foot.className='fz-acorn-foot'; ex.appendChild(foot); hide('t'+PG+'c',foot); }
  }
  showPile();

  /* ---- 13 · the review panel: ?fzreview in the address shows every living thing on demand ----
     For checking the page before it goes live. Students never see it.                      */
  FZ.revHooks=[]; FZ.onRev=function(fn){ if(FZ.rev) fn(FZ.rev); else FZ.revHooks.push(fn); };
  function buildRev(){
    if(FZ.rev){ FZ.rev.style.display=''; return FZ.rev; }
    var R=document.createElement('div'); R.className='fz-rev';
    var here=location.pathname, qs=function(extra){ return here+'?fzreview=1'+(extra||''); };
    var EGG={'1':['Siblings, on the edge of Section 2','sibs'],'2':['The ant, on the edge of Section 1','ant'],'3':['Drop an acorn (floor)','bst'],'4':['Prune the twig (floor)','prune']}[PG];
    R.innerHTML='<h4>Forest review <button type="button" data-a="min">hide</button></h4><div class="fz-revb">'+
      '<p>Season</p><div class="row">'+['winter','spring','summer','monsoon','autumn'].map(function(x){ return '<a href="'+qs('&fzseason='+x)+'" class="'+(x===season?'on':'')+'">'+x+'</a>'; }).join('')+'</div>'+
      '<p>Visitors</p><div class="row"><button data-a="doel">Doel</button><button data-a="deer">Deer</button><button data-a="star">Shooting star</button>'+(season==='monsoon'?'<button data-a="rain">Rain</button>':'')+'</div>'+
      (EGG?'<p>The egg on this page</p><div class="row"><button data-a="'+EGG[1]+'">'+EGG[0]+'</button></div>':'')+
      '<p>Earned</p><div class="row"><button data-a="sims">Finish every simulator</button><button data-a="quiz">Answer every check</button><button data-a="clear">Clear the checks</button></div>'+
      '<p>Acorn hunt</p><div class="row"><button data-a="show">Show where</button><button data-a="all">Find all 18</button><button data-a="reset">Reset</button></div>'+
      '<p>Wind and places</p><div class="row"><button data-a="gust">A gust</button><button data-a="top">To the hero</button><button data-a="floor">To the floor</button></div>'+
      '<p class="note">Time of day: the menu in the top bar. Breeze: a fast flick over empty page. The panel is here only because the address has ?fzreview.</p></div>';
    document.body.appendChild(R); FZ.rev=R;
    R.addEventListener('click',function(e){
      var b=e.target.closest('button'); if(!b) return; var a=b.dataset.a;
      if(a==='min'){ R.classList.toggle('min'); b.textContent=R.classList.contains('min')?'show':'hide'; return; }
      if(a==='doel') doel(true); if(a==='deer'){ deerOn=false; deer(); } if(a==='star') star(); if(a==='rain' && FZ.rainNow) FZ.rainNow();
      if(a==='sibs') sibs(); if(a==='ant') ant(); if(a==='bst' && FZ.bstDrop) FZ.bstDrop(); if(a==='prune' && FZ.prune) FZ.prune();
      if(a==='sims'){ Sim.all().forEach(function(s){ if(s.count && s.count()>1) s.go(s.count()-1); }); $$('#p-lesson .sim').forEach(function(sim){ if(!$('.simcnt',sim)) for(var k=0;k<4;k++) $('.simbd',sim).click(); }); }
      if(a==='quiz') $$('.quiz').forEach(function(q){ var o=$('.qopt[data-ok]',q); if(o && !o.disabled) o.click(); });
      if(a==='clear'){ var pr=$('#preset'); if(pr) pr.click(); }
      if(a==='show'){ $$('details.dig').forEach(function(d){ if(d.querySelector('.fz-acorn')) d.open=true; }); $$('.fz-acorn').forEach(function(x){ x.classList.add('reveal'); });
        var f=$('.fz-acorn'); if(f) f.scrollIntoView({block:'center'}); else alert('No acorns left on this page: all found.'); }
      if(a==='all'){ try{ localStorage.setItem(AKEY,JSON.stringify(['t1a','t1b','t1c','t2a','t2b','t2c','t3a','t3b','t3c','t4a','t4b','t4c','t5a','t5b','t5c','t6a','t6b','t6c'])); }catch(x){} location.reload(); }
      if(a==='reset'){ try{ localStorage.removeItem(AKEY); }catch(x){} location.reload(); }
      if(a==='gust' && FZ.gustNow) FZ.gustNow(1);
      if(a==='top') window.scrollTo({top:0}); if(a==='floor' && fl) fl.scrollIntoView({block:'center'});
    });
    FZ.revHooks.forEach(function(f){ f(R); }); return R;
  }
  FZ.buildRev=buildRev; if(/[?&]fzreview/.test(Q)) buildRev();

  window.__forest={season:season, arrive:arrive, sync:sync, star:star, doel:doel, deer:deer, sibs:sibs, ant:ant,
    bstDrop:function(){ if(FZ.bstDrop) FZ.bstDrop(); }, acorns:function(){ return found.slice(); },
    state:function(){ return {arrivals:arrivals, flowers:flowers.length, owl:!!owl, bed:bed?bed.children.length:0, gusts:gusts, tumbling:tumb.length,
      perched:$$('.fz-perch,.fz-perch2').length, doel:!!$('.fz-doel'), deer:!!$('.fz-deer'), shooting:!!shoot}; }};
})();


/* =================== THE FLOOR, IN CLAY (2026-11-15) ===================
   On every tree page's floor: the monsoon frog is a clay sprite that puffs
   its throat and hops when touched; a palm squirrel runs in now and then,
   sits up with an acorn, nibbles, and runs off; by day a butterfly drifts in,
   rests on a flower or the fern, and flies on. They come and go through the
   floor's own edges, so nothing vanishes mid-page. Each comes back about every
   minute while the floor is on screen. Nothing for reduced motion or in Focus. */
(function(){
  if(RM || !FZ.spr || !FZ.ART.squ || !FZ.floor) return;
  var fl=FZ.floor, wait=FZ.wait;
  function busy(){ return document.body.classList.contains('fsopen') || document.hidden; }
  function seen(){ var r=fl.getBoundingClientRect(); return r.bottom>0 && r.top<window.innerHeight; }
  function day(){ var m=document.documentElement.getAttribute('data-ft')||'morning'; return m==='morning'||m==='afternoon'; }
  function rnd(a,b){ return a+Math.random()*(b-a); }
  /* the floor reaches from one edge of the window to the other: animals come and go at the screen's own edges */
  function bleed(){ fl.style.marginLeft='0px'; fl.style.width='auto'; var r=fl.getBoundingClientRect(), W=document.documentElement.clientWidth;
    fl.style.marginLeft=(-r.left)+'px'; fl.style.width=W+'px'; }
  /* the floor's sky: a layer just above the floor, unclipped, so a bird can fly down onto the floor without being cut off */
  var sky=document.createElement('div'); sky.className='fz-flsky'; sky.setAttribute('aria-hidden','true'); fl.parentNode.insertBefore(sky,fl); FZ.flsky=sky;
  function bleed2(){ sky.style.marginLeft=fl.style.marginLeft; sky.style.width=fl.style.width; }
  bleed(); bleed2(); window.addEventListener('resize',function(){ bleed(); bleed2(); });

  /* ---- branches growing out of four sections, on wide screens: somewhere for the doel to land ---- */
  var cards=$$('#p-lesson .card.numbered'); FZ.limbs=[];
  /* one of them is the middle section's: the doel's fixed moment is reaching it */
  [cards[1], cards[Math.floor(cards.length/2)], cards[Math.round(.67*(cards.length-1))], cards[Math.round(.9*(cards.length-1))]]
    .filter(function(c,i,a){ return c && a.indexOf(c)===i; })
    .forEach(function(c,i){
      if(getComputedStyle(c).position==='static') c.style.position='relative';
      /* they alternate sides and come in two shapes; each is drawn the right way round (a mirrored one would mirror the doel's flight too) */
      var right=i%2===1, v=i%4>1, l=document.createElement('div'); l.className='fz-limb'+(right?' r':''); l.setAttribute('aria-hidden','true');
      var P=v ? ['M96 28C76 26 58 30 40 24S14 10 4 12','M40 24c-2-8 2-13 8-17','M48 7c5-4 10-3 11 1-4 3-8 3-11-1z','M8 12c-5 3-9 1-10-3 4-2 8-1 10 3z','M70 28c2 5 0 9-4 10-1-4 0-8 4-10z'] 
              : ['M96 30C70 30 50 26 30 22S10 16 2 18','M46 25c-4-8-6-12-4-18','M42 7c-6-3-7-8-4-11 4 2 6 6 4 11z','M14 18c-5 2-10 0-11-4 4-2 9-1 11 4z','M64 27c3 5 1 10-3 11-2-4-1-8 3-11z'];
      /* a right-hand branch flips only its drawing; the doel lands in the element itself, which is not flipped */
      l.innerHTML='<svg viewBox="0 0 96 44"><g'+(right?' transform="translate(96 0) scale(-1 1)"':'')+'><path class="lb" d="'+P[0]+'"/><path class="lb t" d="'+P[1]+'"/>'+
        P.slice(2).map(function(d){ return '<path class="lv" d="'+d+'"/>'; }).join('')+'</g></svg>';
      c.appendChild(l); l._px=right?72:24; l._py=v?14:20; FZ.limbs.push(l);
    });

  var G=fl.clientHeight-13;   /* the floor's ground line, as the hedgehog walks it */
  function put(kind,h,x,y,dir,pose){ var e=FZ.spr(kind,h,'fz-flr'); e.style.position='absolute'; fl.appendChild(e); if(pose) FZ.frame(e,pose); FZ.place(e,x,y); FZ.face(e,dir||1); return e; }
  /* a click on an animal: a small hop, and a pose for a moment */
  function tap(e,pose){ e.classList.add('tap'); e.addEventListener('click',function(ev){ ev.stopPropagation(); if(e._t) return; e._t=1;
    e.animate([{translate:'0 0'},{translate:'0 -7px'},{translate:'0 0'}],{duration:380,easing:'ease-out'}); if(pose) FZ.frame(e,pose);
    setTimeout(function(){ e._t=0; },650); }); return e; }
  /* every so often, while the floor is in view */
  function every(a,b,fn){ (function again(){ setTimeout(async function(){ if(!busy() && !FZ.quiet() && seen() && !fn.on){ fn.on=true; try{ await fn(); }catch(x){} fn.on=false; } again(); },rnd(a,b)*1000); })(); }

  /* ---- the plants: clay in place of the drawn fern and mushrooms, and more of them along the floor.
     A fern, a grass tuft or the bush bends when the pointer passes. Kash in autumn, a shapla in monsoon. ---- */
  var sway=[];
  if(FZ.ART.flora){
    var season=(window.__forest&&window.__forest.season)||'';
    fl.classList.add('clay');
    function plant(host,kind,pose,h,x,y,b){ var e=FZ.spr(kind,h,'fz-pl'); e.style.position='absolute'; host.appendChild(e); FZ.frame(e,pose); FZ.place(e,x,y);
      if(b){ e._s=pose; e._b=b; sway.push(e); } return e; }
    var fern=$('.fz-fern',fl); if(fern){ fern.innerHTML=''; plant(fern,'flora','fern',30,15,30,'fernb'); }
    $$('.fz-mush',fl).forEach(function(m,i){ m.innerHTML=''; plant(m,'season','mush',i===1?24:30,12,24); });
    var W=fl.clientWidth, ground=13, used=[.46*W];
    var S=[[.08,'flora','grass',16,'grassb'],[.2,'flora','daisy',22],[.29,'flora','grass',15,'grassb'],[.35,'season','pebble',24],[.55,'flora','pink',22],
           [.66,'flora','bush',26],[.74,'flora','grass',16,'grassb'],[.9,'flora','grass',15,'grassb'],[.96,'flora','daisy',18]];
    if(season==='autumn') S.push([.16,'season','kash',34,'kashb'],[.81,'season','kash',30,'kashb'],[.42,'season','leaf',16],[.61,'season','leaf',14]);
    if(season==='spring'||season==='summer') S.push([.4,'flora','pink',20],[.86,'flora','daisy',20]);
    if(season==='winter') S.push([.4,'season','stump',30]);
    if(season==='monsoon') S.push([.3,'season','lily3',30]);
    S.sort(function(a,b){ return a[0]-b[0]; }).forEach(function(s){
      var x=s[0]*W; if(x<125 || x>W-16 || used.some(function(u){ return Math.abs(u-x)<26; })) return;   /* clear of the den and the acorn pile, and of each other */
      used.push(x); var w=document.createElement('span'); w.className='fz-plant'+(s[2]==='lily3'?' pond':''); w.style.left=(s[0]*100)+'%'; w.style.bottom=ground+'px';
      fl.insertBefore(w,fl.querySelector('.fz-hog')); plant(w,s[1],s[2],s[3],0,0,s[4]);
    });
    var bendT=null;
    fl.addEventListener('pointermove',function(e){ var R=fl.getBoundingClientRect(), x=e.clientX-R.left;
      sway.forEach(function(p){ var r=p.getBoundingClientRect(), c=r.left-R.left+r.width/2; if(Math.abs(c-x)<38 && !p._bent){ p._bent=true; FZ.frame(p,p._b);
        setTimeout(function(){ FZ.frame(p,p._s); p._bent=false; },650); } }); });
  }

  /* ---- the margin trees in clay: switched off (Jamil, 2026-11-15: too prominent; the silhouettes stay). Kept for a later try. ---- */
  if(false && FZ.ART.treeR && FZ.guts && FZ.svgSpr){
    var TS=[];
    FZ.guts.forEach(function(g){
      g.classList.add('clay');
      var sw=$$('.fz-sway',g);
      if(sw[0]) TS.push(FZ.svgSpr(sw[0],'treeP',70,904,392));
      if(sw[1]) TS.push(FZ.svgSpr(sw[1],'treeR',160,904,236));
      if(sw[2]) TS.push(FZ.svgSpr(sw[2],'treeP',28,904,178));
      TS.forEach(function(t){ var s=t.parentNode; s.insertBefore(t,s.firstChild); });   /* behind the owl and any bird */
    });
    /* a gust (a fast scroll) bends them for a moment */
    var lastY=window.scrollY, bentT=null;
    window.addEventListener('scroll',function(){ var dy=Math.abs(window.scrollY-lastY); lastY=window.scrollY;
      if(dy>60){ TS.forEach(function(t){ t._show('blow'); }); clearTimeout(bentT); bentT=setTimeout(function(){ TS.forEach(function(t){ t._show('still'); }); },700); } },{passive:true});
  }

  /* the frog (monsoon only): the drawn one is swapped for the clay one */
  var old=$('.fz-frog',fl);
  if(old && FZ.ART.frog){
    var fr=old.cloneNode(false); old.replaceWith(fr); fr.classList.add('sp');   /* a clean copy: the drawn frog's own hop goes with the old one */
    var f=FZ.spr('frog',21); f.style.position='absolute'; fr.appendChild(f); FZ.place(f,15,23);
    var hopping=false;
    async function hop(){ if(hopping) return; hopping=true; var dir=Math.random()<.5?-1:1, x0=parseFloat(getComputedStyle(fr).left)||0, W=fl.clientWidth;
      if(x0+dir*40<20 || x0+dir*40>W-30) dir=-dir; FZ.face(f,dir);
      FZ.frame(f,'p4'); await wait(160); FZ.frame(f,'p5');
      fr.style.transition='left .45s cubic-bezier(.3,.6,.4,1)'; fr.style.left=(x0+dir*40)+'px';
      f.animate([{translate:'0 0'},{translate:'0 -14px'},{translate:'0 0'}],{duration:450,easing:'ease-out'});
      await wait(150); FZ.frame(f,'p6'); await wait(150); FZ.frame(f,'p7'); await wait(150); FZ.frame(f,'p8'); await wait(260); FZ.frame(f,'p1'); hopping=false; }
    fr.addEventListener('pointerenter',hop); fr.addEventListener('click',function(e){ e.stopPropagation(); hop(); });
    every(6,11,async function(){ if(hopping) return; for(var i of ['p2','p3','p2','p3','p2','p1']){ FZ.frame(f,i); await wait(220); } });
  }

  /* the squirrel: in from the right edge, up with an acorn, and away */
  async function squirrel(){
    var W=fl.clientWidth, x=W-rnd(140,300), s=tap(put('squ',26,W+40,G,-1,'q1'),'q6');   /* not far in: it is a quick visit */
    await FZ.walk(s,x,G,150,['q1','q2'],12);
    var R=[['q3',700],['q4',600],['q5',300],['q4',300],['q5',300],['q4',300],['q5',300],['q4',700],['q6',500],['q4',300],['q7',900],['q3',400]];
    for(var i=0;i<R.length && s.isConnected;i++){ FZ.frame(s,R[i][0]); await wait(R[i][1]); }
    FZ.face(s,1); await FZ.walk(s,W+60,G,110,['q1','q2'],10); s.remove();
  }
  /* the butterfly, by day: in from the left, a rest on a flower or the fern, and on out to the right */
  async function butterfly(force){
    if(!day() && !force) return;
    var W=fl.clientWidth, spots=$$('.fz-flower,.fz-fern',fl), t=spots[Math.floor(Math.random()*spots.length)];
    var R=t?t.getBoundingClientRect():null, F=fl.getBoundingClientRect(), tx=R?R.left-F.left+R.width/2:W*.46, ty=R?R.top-F.top+3:G-24;
    var b=tap(put('fly',20,-30,rnd(8,22),1,'f8'));
    await FZ.fly(b,[-30,b._y],[tx*.4,6],[tx*.8,Math.max(6,ty-30)],[tx,ty],Math.max(2600,tx*9),['f1','f2','f3','f2'],16);
    for(var k=0;k<6 && b.isConnected;k++){ for(var w of ['f5','f6','f7','f6','f5']){ FZ.frame(b,w); await wait(140); } await wait(k%2?500:900); }
    FZ.frame(b,'f5'); await wait(900);
    await FZ.fly(b,[tx,ty],[tx+60,Math.max(6,ty-30)],[W-80,8],[W+40,rnd(8,20)],Math.max(2600,(W-tx)*9),['f1','f2','f3','f2'],16); b.remove();
  }
  every(25,45,squirrel);
  every(30,55,butterfly);
  /* the review panel: one button each, whatever the time of day */
  FZ.onRev(function(REV){ var row=$$('.fz-revb .row',REV)[1];
    if(row){ row.insertAdjacentHTML('beforeend','<button type="button" data-f="squ">Squirrel</button><button type="button" data-f="fly">Butterfly</button>');
      row.addEventListener('click',function(e){ var b=e.target.closest('button[data-f]'); if(!b) return; fl.scrollIntoView({block:'center'});
        setTimeout(function(){ if(b.dataset.f==='squ' && !squirrel.on) squirrel(); if(b.dataset.f==='fly') butterfly(true); },500); }); } });
  window.__floor={squirrel:squirrel, butterfly:butterfly};
})();


/* =================== THE SECTION CREATURES (Trees 1, 2026-11-14) ===================
   One small clay creature per section acts out the section's idea, once, when
   the reader reaches its spot (the eggs' fixed moment), and is never explained:
   ants turn a line into a tree (§1), a mole, a caterpillar, a spider and the owl
   answer four of §2's words, a sapling grows by the recursive rule (§3), a bee
   fills a comb from the left (§4), a spider walks its web's threads (§5), a
   woodpecker pecks a row of holes (§6), the owl keeps the last card (§7), and a
   tortoise walks the Exam tab. Faceless sprites (sprites.js). One creature moves
   at a time; nothing for reduced motion or in Focus. ?fzreview lists them all,
   ?fzcrea=<name> plays one.                                                      */
(function(){
  if(RM || !FZ.spr || !FZ.edge) return;
  var PG=(/\/0(\d)-[a-z-]+\.html/.exec(location.pathname)||[])[1]||'';
  if(PG!=='1') return;
  var SVGNS='http://www.w3.org/2000/svg', mv=/[?&]fzcrea=(\w+)/.exec(location.search), FORCE=mv?mv[1]:'', wait=FZ.wait;
  function busy(){ return document.body.classList.contains('fsopen') || document.hidden; }
  function night(){ return document.documentElement.getAttribute('data-ft')==='night'; }
  /* one creature at a time: each run waits for the one before */
  var chain=Promise.resolve();
  function q(fn){ chain=chain.then(fn).catch(function(){}); return chain; }

  /* a stage on a card's top edge, w wide and h tall; its ground (the card's border) is at y = h - 3 */
  function stage(card,name,w,h){
    var st=FZ.edge(card,name); st.style.width=w+'px';
    if(h){ st.style.height=h+'px'; st.style.top=(3-h)+'px'; }
    if(name==='comb'){ st.style.left='64px'; st.style.right='auto'; }   /* past the section's number badge; the doel's phone perch is the middle card's right corner */
    return st;
  }
  function svg(st,w,h,inner){ st.innerHTML='<svg viewBox="0 0 '+w+' '+h+'">'+inner+'</svg>'; return st.firstChild; }
  function put(st,kind,h,x,y,dir,pose){
    var e=FZ.spr(kind,h); e.style.position='absolute'; st.appendChild(e);
    if(pose) FZ.frame(e,pose); FZ.place(e,x,y); FZ.face(e,dir||1); return e;
  }
  /* grow in from small, and shrink away: the CSS scale property, so it adds to the facing and tilt */
  function show(e,ms){ return e.animate([{opacity:0,scale:'.3'},{opacity:1,scale:'1'}],{duration:ms||520,easing:'cubic-bezier(.3,1.45,.5,1)'}).finished; }
  function hide(e,ms){ return e.animate([{opacity:1,scale:'1'},{opacity:0,scale:'.3'}],{duration:ms||420,easing:'ease-in',fill:'forwards'}).finished; }
  /* a click on any creature: a small hop, and a pose for a moment if it has one */
  function tap(e,pose,ms){ e.classList.add('tap');
    e.addEventListener('click',function(ev){ ev.stopPropagation(); if(e._t) return; e._t=1;
      e.animate([{translate:'0 0'},{translate:'0 -6px'},{translate:'0 0'}],{duration:360,easing:'ease-out'});
      var was=e._f; if(pose) FZ.frame(e,pose); setTimeout(function(){ if(pose && e._f===pose) FZ.frame(e,was); e._t=0; },ms||650); });
    return e; }
  function tilt(e,deg){ e._extra=deg?'rotate('+deg+'deg)':''; FZ.face(e,e._dir); }
  /* walk in a straight line to (x, y) at v px a second, stepping through the poses; turn to face the way */
  function walk(e,x,y,v,poses,fps,keep){
    var x0=e._x, y0=e._y, ms=Math.hypot(x-x0,y-y0)/v*1000, stop=poses?FZ.loop(e,poses,fps||10):null;
    if(!keep && Math.abs(x-x0)>.5) FZ.face(e,x>x0?1:-1);
    return new Promise(function(res){ var spent=0, last=null;
      (function step(now){ if(last==null) last=now; if(!busy()) spent+=now-last; last=now;
        var t=ms?Math.min(1,spent/ms):1; FZ.place(e,x0+(x-x0)*t,y0+(y-y0)*t);
        if(t<1 && e.isConnected) requestAnimationFrame(step); else { if(stop) stop(); res(); } })(performance.now()); });
  }
  /* walk along a slanted thread: the body tilts with the thread */
  function along(e,x,y,v,poses,fps){
    var dx=x-e._x, dy=y-e._y, dir=dx>=0?1:-1, a=Math.atan2(dir*dy,dir*dx)*180/Math.PI;
    e._dir=dir; tilt(e,a); return walk(e,x,y,v,poses,fps,true);
  }
  /* leave for good: fly out past the edge of the screen (side -1 left, 1 right), never vanish mid-page */
  function flyOff(e,host,side,beat,fps){
    var r=host.getBoundingClientRect(), tx=side<0?-r.left-90:Math.min(window.innerWidth-r.left-40,e._x+170), ty=-r.top-90,   /* rightwards: up and out of the top, inside the page's width, so no sideways scroll */
        d=Math.hypot(tx-e._x,ty-e._y);
    return FZ.fly(e,[e._x,e._y],[e._x+side*30,e._y-35],[tx-side*Math.min(220,d*.3),ty+Math.min(200,d*.35)],[tx,ty],Math.min(3500,Math.max(1500,d*2.1)),beat,fps).then(function(){ e.remove(); });
  }
  /* a thread from a fixed point to the spider, redrawn as it moves, while the promise runs */
  function spin(svgEl,x0,y0,e,run,cls){
    var l=document.createElementNS(SVGNS,'path'); l.setAttribute('class','fz-web'+(cls?' '+cls:'')); svgEl.appendChild(l); var on=true;
    (function f(){ l.setAttribute('d','M'+x0+' '+y0+'L'+e._x.toFixed(1)+' '+e._y.toFixed(1)); if(on) requestAnimationFrame(f); })();
    return run.then(function(){ on=false; l.setAttribute('d','M'+x0+' '+y0+'L'+e._x.toFixed(1)+' '+e._y.toFixed(1)); return l; });
  }
  function grow(p,ms,delay){ p.style.strokeDasharray='1'; p.style.strokeDashoffset='1';
    return p.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{duration:ms,delay:delay||0,easing:'ease-out',fill:'forwards'}).finished; }
  function seen(el){ if(!el) return false; var r=el.getBoundingClientRect(), bar=$('.topbar'), top=bar?bar.getBoundingClientRect().height:0;
    return r.bottom>top && r.top<window.innerHeight; }

  /* ---- §1 · ants: a file of five walks in as a list, climbs a twig into who-is-under-whom, then files off ---- */
  async function ants(force){
    var card=$('#s1'); if(!card) return; var st=stage(card,'ants',210,42); if(st.on && !force) return; st.on=true;
    var G=39, N=[[150,G-24],[133,G-12],[167,G-12],[124,G],[142,G]];
    var tw='<path class="tw2" d="M150 '+(G-24)+'L133 '+(G-12)+'M150 '+(G-24)+'L167 '+(G-12)+'M133 '+(G-12)+'L124 '+G+'M133 '+(G-12)+'L142 '+G+'"/>';
    N.slice(0,3).forEach(function(n){ tw+='<path class="pad" d="M'+(n[0]-4)+' '+n[1]+'h8"/>'; });
    svg(st,210,42,tw);
    var A=[]; for(var i=0;i<5;i++){ var a=tap(put(st,'ant',12,204,G,-1),'a10'); a.style.opacity='0'; A.push(a); }   /* all from the stage's right end, one after another: nothing past the page's edge */
    await Promise.all(A.map(function(a,i){ return wait(i*500).then(function(){ a.style.opacity=''; show(a,400); return walk(a,86+i*15,G,26,['a1','a2','a3','a4'],10); }); }));
    A.forEach(function(a){ FZ.frame(a,'a1'); }); await wait(700);
    /* the first is the root; the next two go under it; the last two under the left one */
    await Promise.all(A.map(function(a,i){ return wait(i*380).then(function(){ return walk(a,N[i][0],N[i][1],20,['a1','a2','a3','a4'],10); }).then(function(){ FZ.face(a,-1); FZ.frame(a,'a1'); }); }));
    FZ.frame(A[0],'a5'); await wait(900); FZ.frame(A[1],'a6'); FZ.frame(A[2],'a6'); await wait(1300);
    FZ.frame(A[0],'a10'); await wait(700); A.forEach(function(a){ FZ.frame(a,'a1'); }); await wait(900);
    /* back into a line, and away */
    await Promise.all(A.map(function(a,i){ return wait((4-i)*220).then(function(){ return walk(a,86+i*15,G,22,['a1','a2','a3','a4'],10); }); }));
    /* to the left end, then down behind the card's edge, one after another */
    await Promise.all(A.map(function(a,i){ return wait(i*420).then(function(){ return walk(a,22,G,26,['a1','a2','a3','a4'],10); })
      .then(function(){ return walk(a,10,G+14,18,['a1','a2','a3','a4'],10,true); }); }));
    A.forEach(function(a){ a.remove(); });
  }

  /* ---- §2 · word visitors, in a strip under the explorer, once per word per visit ---- */
  var sim=$('#tw-sim'), vst=null, met={};
  if(sim){ vst=document.createElement('div'); vst.className='fz-vst'; vst.setAttribute('aria-hidden','true'); sim.parentNode.insertBefore(vst,sim.nextSibling); }
  var VG=41, vchain=Promise.resolve();   /* the visitors have their own strip, so they wait only for each other */
  function vq(fn){ vchain=vchain.then(fn).catch(function(){}); return vchain; }
  async function mole(){   /* Root: it pushes up out of the ground, looks round, and goes back down */
    vst.innerHTML=''; var m=tap(put(vst,'mole',27,44,VG,1,'m1'),'m7',800); await show(m,400);
    var R=[['m1',500],['m2',420],['m3',600],['m4',800],['m5',650],['m6',650],['m3',300],['m7',800],['m3',400],['m8',380],['m9',380],['m10',900]];
    for(var i=0;i<R.length && m.isConnected;i++){ FZ.frame(m,R[i][0]); await wait(R[i][1]); }
    await m.animate([{opacity:1},{opacity:0}],{duration:1400,fill:'forwards'}).finished; m.remove();
  }
  async function caterpillar(){   /* Leaves: on its leaf it crawls, eats some of the leaf, curls up, and crawls off */
    vst.innerHTML=''; var c=tap(put(vst,'cat',20,62,VG,1,'c1'),'c9',800); await show(c,500);
    var R=[['c2',420],['c3',420],['c2',420],['c1',420],['c4',800],['c5',380],['c6',380],['c5',380],['c8',600],['c9',700],['c11',1500],['c9',400],['c1',400]];
    for(var i=0;i<R.length && c.isConnected;i++){ FZ.frame(c,R[i][0]); await wait(R[i][1]); }
    await walk(c,40,VG+22,7,['c1','c2','c3','c2'],3,true); c.remove();   /* down behind the Your-turn box */
  }
  async function depth(){   /* Depth: the spider lets itself down from the explorer, one level at a time: five */
    vst.innerHTML=''; var s=tap(put(vst,'spider',13,58,-8,1,'s6'));
    for(var k=1;k<=5 && s.isConnected;k++){ await walk(s,58,-8+k*7,30,null,0,true); await wait(520); }
    await wait(700);
    await walk(s,58,-30,22,['s7','s8'],6,true); s.remove();
  }
  async function ancestors(){   /* Ancestors: the owl shows for a moment, looking back up the way it came */
    vst.innerHTML=''; var o=tap(put(vst,'owl',25,96,VG,1,'o1'),'o4'); await show(o,500);
    await wait(500); FZ.frame(o,'o10'); await wait(1100); FZ.frame(o,'o3'); await wait(600); FZ.frame(o,'o1'); await wait(500);
    FZ.frame(o,'o5'); await wait(250);
    await FZ.fly(o,[96,VG],[110,VG-12],[150,0],[175,-40],1300,['o6','o7'],8); o.remove();   /* up and behind the explorer */
  }
  var VIS={root:mole, leaves:caterpillar, depth:depth, ancestors:ancestors};
  var pick=$('#tw-pick');
  if(pick && vst) pick.addEventListener('click',function(e){
    var b=e.target.closest('button'), w=b&&b.dataset.w; if(!w || !VIS[w] || met[w] || !seen(vst)) return;
    met[w]=true; vq(VIS[w]);
  });

  /* ---- §3 · the sapling: a stem, then two, then two more and one that stops empty; a sparrow looks into the empty one ---- */
  async function sapling(force){
    var card=$('#s3'); if(!card) return; var st=stage(card,'sap',150,42); if(st.on && !force) return; st.on=true;
    var G=39, s=svg(st,150,42,
      '<path class="tw2 l0" pathLength="1" d="M100 '+G+'V28"/>'+
      '<path class="tw2 l1" pathLength="1" d="M100 28L88 20"/><path class="tw2 l1" pathLength="1" d="M100 28L112 20"/>'+
      '<path class="tw2 l2" pathLength="1" d="M88 20L81 12"/><path class="tw2 l2" pathLength="1" d="M88 20L95 12"/><path class="tw2 l2" pathLength="1" d="M112 20L119 12"/>'+
      '<path class="tw2 l2" pathLength="1" d="M112 20L108.5 16.5"/><circle class="stump" cx="108.3" cy="16.3" r="1.5"/>'+
      '<g class="lv"><path class="lf" d="M81 12c-4-1-6-4-6-6 3 0 6 2 6 6z"/><path class="lf" d="M95 12c4-1 6-4 6-6-3 0-6 2-6 6z"/><path class="lf" d="M119 12c4-1 6-4 6-6-3 0-6 2-6 6z"/></g>');
    var stump=$('.stump',s), lv=$('.lv',s); stump.style.opacity='0'; lv.style.opacity='0';
    $$('.tw2',s).forEach(function(p){ p.style.strokeDasharray='1'; p.style.strokeDashoffset='1'; });
    await Promise.all($$('.l0',s).map(function(p){ return grow(p,700); })); await wait(200);
    await Promise.all($$('.l1',s).map(function(p){ return grow(p,600); })); await wait(200);
    await Promise.all($$('.l2',s).map(function(p){ return grow(p,600); }));
    stump.animate([{opacity:0},{opacity:1}],{duration:400,fill:'forwards'});
    lv.animate([{opacity:0,transform:'scale(.4)'},{opacity:1,transform:'scale(1)'}],{duration:600,fill:'forwards'});
    await wait(1400);
    var b=tap(put(st,'bird',15,140,-90,-1,'b7'),'b5');
    await FZ.fly(b,[140,-90],[140,-40],[120,-6],[108.5,16.5],1100,['b7','b9'],14);
    FZ.face(b,-1); FZ.frame(b,'b6'); await wait(160); FZ.frame(b,'b1'); await wait(500);
    for(var r=0;r<2 && b.isConnected;r++){ FZ.frame(b,'b4'); await wait(900); FZ.frame(b,'b1'); await wait(500); }
    FZ.frame(b,'b3'); await wait(600);
    await flyOff(b,st,-1,['b7','b9'],14);
  }

  /* ---- §4 · the comb and the flowers. The comb, 1 + 2 + 4 cells, sits on a stump; flowers stand in grass along the edge.
     The bee fetches nectar for every cell and fills the comb level by level, left to right; the first time it skips one,
     sees the gap, and goes back. Then the honey is taken, cell by cell, and it starts again: it never stops while the
     section is on screen. It flies slow, loose spirals and lands on a flower's head or on top of a cell. ---- */
  var bee=null, beeW=0;
  var FH={daisy:.99,pink:.74,open:.95};   /* each flower's height against the sheet's reference pose, as cut */
  async function comb(force){
    var card=$('#s4'); if(!card) return; beeW=Math.max(200,Math.min(400,card.clientWidth-96));
    var st=stage(card,'comb',beeW,64); if(st.on && !force) return; st.on=true; bee=null; st._run=(st._run||0)+1; var run=st._run;
    st.innerHTML='';
    var G=61, r=7, CX=60, stump=FZ.spr('season',36,'fz-bloomf'); stump.style.position='absolute'; st.appendChild(stump); FZ.frame(stump,'stump'); FZ.place(stump,CX,G);
    var top=G-17, w=r*Math.sqrt(3), C=[[CX,top-r-21],[CX-w/2,top-r-10.5],[CX+w/2,top-r-10.5],[CX-1.5*w,top-r],[CX-w/2,top-r],[CX+w/2,top-r],[CX+1.5*w,top-r]];
    function hex(c){ var p=''; for(var k=0;k<6;k++){ var a=Math.PI/3*k+Math.PI/6; p+=(k?'L':'M')+(c[0]+r*Math.cos(a)).toFixed(1)+' '+(c[1]+r*Math.sin(a)).toFixed(1); } return p+'z'; }
    var s=document.createElementNS(SVGNS,'svg'); s.setAttribute('viewBox','0 0 '+beeW+' 64'); s.innerHTML=C.map(function(c,i){ return '<path class="fz-cell" data-i="'+i+'" d="'+hex(c)+'"/>'; }).join('');
    st.appendChild(s);
    var cells=$$('.fz-cell',s);
    /* flowers in grass, at random places to the right of the comb */
    var F=[], kinds=['daisy','pink','open','daisy'].sort(function(){ return Math.random()-.5; }), n=beeW>300?4:3;
    for(var t=0;t<60 && F.length<n;t++){ var x=120+Math.random()*(beeW-140); if(F.every(function(f){ return Math.abs(f.x-x)>46; })) F.push({x:x}); }
    F.sort(function(p,q){ return p.x-q.x; }).forEach(function(f,i){
      var gr=FZ.spr('flora',18,'fz-bloomf'); gr.style.position='absolute'; st.appendChild(gr); FZ.frame(gr,'grass'); FZ.place(gr,f.x+9,G);
      var h=kinds[i]==='pink'?30:36, e=FZ.spr('flora',h,'fz-bloomf'); e.style.position='absolute'; st.appendChild(e); FZ.frame(e,kinds[i]); FZ.place(e,f.x,G);
      f.e=e; f.head=G-h*FH[kinds[i]]; show(e,500); });
    cells.forEach(function(c){ c.animate([{opacity:0},{opacity:1}],{duration:600}); });
    await wait(900);
    var e=put(st,'bee',14,beeW+20,-40,-1,'e1'); e.classList.add('tap'); bee=e;
    e.addEventListener('click',function(){ buzz(true); });
    /* a slow, loose spiral: the straight path, plus a circle that shrinks to nothing as it arrives, so the landing is exact */
    function spiralTo(x,y){ var x0=e._x, y0=e._y, d=Math.hypot(x-x0,y-y0), ms=1100+d*11, turns=.8+Math.random()*1.1, ph=Math.random()*6.3,
        R=Math.min(26,8+d*.18), dir=Math.random()<.5?1:-1, stop=FZ.loop(e,['e1','e2'],22);
      return new Promise(function(res){ var spent=0, last=null;
        (function step(now){ if(last==null) last=now; if(!busy()) spent+=now-last; last=now;
          var t=Math.min(1,spent/ms), u=t*t*(3-2*t), a=ph+dir*turns*6.283*t, k=R*Math.sin(Math.PI*t)*(1-t*.35);
          var px=x0+(x-x0)*u+k*Math.cos(a), py=Math.max(t<.15?-60:20,y0+(y-y0)*u+k*.4*Math.sin(a)-Math.sin(Math.PI*t)*4);   /* it keeps to the gap between the cards */
          var nx=x0+(x-x0)*Math.min(1,u+.03)+k*Math.cos(a+dir*.2); if(Math.abs(nx-px)>.15) FZ.face(e,nx>px?1:-1);
          FZ.place(e,px,py);
          if(t<1 && e.isConnected) requestAnimationFrame(step); else { stop(); res(); } })(performance.now()); }); }
    /* it lands: legs down, a moment's settle, wings still */
    async function land(){ FZ.frame(e,'e5'); await wait(220); FZ.frame(e,'e6'); }
    async function sip(){ var f=F[Math.floor(Math.random()*F.length)]; await spiralTo(f.x,f.head+2); await land();   /* the bee's pin is at its feet: feet on the flower's head */
      f.e.animate([{rotate:'0deg'},{rotate:'-6deg'},{rotate:'3deg'},{rotate:'0deg'}],{duration:700}); FZ.frame(e,'e9'); await wait(900); FZ.frame(e,'e6'); await wait(250); }
    async function fill(i){ await sip(); var c=C[i]; await spiralTo(c[0],c[1]-r+2); await land(); FZ.frame(e,'e9'); await wait(420); cells[i].classList.add('f'); await wait(260); }
    /* the first time: 1 to 5, then it skips 6, hovers at 7, sees the gap, and goes back */
    for(var i of [0,1,2,3,4]) await fill(i);
    await sip(); await spiralTo(C[6][0],C[6][1]-r-8); for(var k=0;k<6;k++){ FZ.frame(e,k%2?'e4':'e3'); await wait(170); }
    await spiralTo(C[5][0],C[5][1]-r+2); await land(); FZ.frame(e,'e9'); await wait(420); cells[5].classList.add('f'); await wait(300);
    await fill(6);
    setTimeout(function(){ work(run); },10);   /* the rest of its day runs outside the queue */
    async function work(id){
      while(st._run===id && e.isConnected){
        await spiralTo(C[0][0],C[0][1]-r+2); await land(); await wait(2600);
        while((!seen(st) || FZ.quiet()) && st._run===id) await wait(1500);   /* nobody watching, or teacher mode: it waits */
        for(var j=6;j>=0;j--){ cells[j].classList.remove('f'); await wait(180); }   /* the honey is taken, cell by cell */
        await wait(500);
        for(var j2=0;j2<7 && st._run===id;j2++) await fill(j2);
      }
    }
  }
  async function buzz(spin){ var e=bee; if(!e || !e.isConnected || e._busy) return; e._busy=true; var L=FZ.loop(e,['e3','e4'],14), y=e._y;
    if(spin) await e.animate([{rotate:'0deg',translate:'0 0'},{rotate:'-20deg',translate:'0 -8px'},{rotate:'20deg',translate:'0 -4px'},{rotate:'0deg',translate:'0 0'}],{duration:700}).finished;
    else { e.animate([{translate:'0 0'},{translate:'0 -5px'},{translate:'0 0'}],{duration:500}); await wait(500); }
    L(); e._busy=false; }
  document.addEventListener('click',function(ev){ var b=ev.target.closest && ev.target.closest('#kd-sim .kdchk button'); if(b && bee && seen(bee)) buzz(); });
  /* a new width (a phone turned, a window resized): the comb and its flowers are laid out again to fit */
  var combT=null;
  window.addEventListener('resize',function(){ clearTimeout(combT); combT=setTimeout(function(){
    var card=$('#s4'), st=card&&$('.fz-edge.comb',card); if(!st || !st.on) return;
    var w=Math.max(200,Math.min(400,card.clientWidth-96)); if(Math.abs(w-beeW)<24) return;
    st._run=(st._run||0)+1; bee=null; st.innerHTML=''; st.style.width=w+'px'; st.on=false; q(function(){ return comb(true); });
  },350); });

  /* ---- §5 · the web: the spider spins it, thread by thread: a knot with a LEFT and a RIGHT thread to two knots, whose own
     threads hang loose (null). Then, now and then, it lets itself down into the card's margin and climbs back. ---- */
  var spider=null;
  async function web(force){
    var card=$('#s5'); if(!card) return; var st=stage(card,'web',150,42); if(st.on && !force) return; st.on=true; spider=null;
    var G=39, T=[100,13], Lk=[84,29], Rk=[116,29], padR=parseFloat(getComputedStyle(card).paddingRight)||30,
        HX=Math.round(150+22-padR/2);          /* the hanging spot: the middle of the card's right margin, clear of any text */
    var s=svg(st,150,42,'<path class="tw2" d="M128 '+G+'V4M94 4.5L'+(HX+4)+' 3.5"/><path class="lf" d="M118 4.3c-1-3 1-5 4-5 0 3-2 5-4 5z"/>'+
      '<path class="lf" d="M'+(HX+4)+' 3.5c3-2 6-1 7 1-3 1-5 1-7-1z"/>');
    s.animate([{opacity:0},{opacity:1}],{duration:700}); await wait(800);
    var WALK=['s1','s2','s3','s4'], p=put(st,'spider',11,100,4,1,'s5'); await show(p,400);
    function knot(c){ var k=document.createElementNS(SVGNS,'circle'); k.setAttribute('class','fz-knot'); k.setAttribute('cx',c[0]); k.setAttribute('cy',c[1]); k.setAttribute('r','2.3'); s.appendChild(k);
      k.animate([{r:0},{r:2.3}],{duration:350,easing:'cubic-bezier(.3,1.6,.5,1)'}); }
    /* down from the branch to the top knot, spinning */
    await spin(s,100,4,p,walk(p,T[0],T[1],10,['s1','s3'],6,true)); knot(T); FZ.frame(p,'s5'); await wait(500);
    /* the left thread, and back up it; then the right one */
    for(var side of [Lk,Rk]){
      await spin(s,T[0],T[1],p,along(p,side[0],side[1],12,WALK,9)); tilt(p,0); knot(side); FZ.frame(p,'s10'); await wait(600);
      var loose=document.createElementNS(SVGNS,'path'); loose.setAttribute('class','fz-web fz-loose'+(side===Rk?' b':'')); loose.setAttribute('d','M'+side[0]+' '+side[1]+'v8'); loose.setAttribute('pathLength','1');
      s.appendChild(loose); grow(loose,500); FZ.frame(p,'s5'); await wait(500);
      await along(p,T[0],T[1],12,WALK,9); tilt(p,0); FZ.frame(p,'s5'); await wait(300);
    }
    FZ.face(p,1); FZ.frame(p,'s9'); spider=p; p.classList.add('tap');
    p.addEventListener('click',function(){ hang(); });
    setTimeout(hang,2500);   /* outside the queue: the next creature need not wait for the swing */
  }
  /* up to the branch, out to its tip over the card's margin, down a thread into the margin, a swing, and back */
  async function hang(){
    var p=spider; if(!p || p._busy || !p.isConnected) return; p._busy=true;
    var st=p.parentNode, s=$('svg',st), card=st.parentNode, padR=parseFloat(getComputedStyle(card).paddingRight)||30, HX=Math.round(150+22-padR/2), T=[100,13];
    var WALK=['s1','s2','s3','s4'], drop=Math.min(70,Math.max(40,card.clientHeight*.06));
    await walk(p,100,5,10,['s7','s8'],6,true); FZ.frame(p,'s5');
    await walk(p,HX,4,16,WALK,9); FZ.frame(p,'s5'); await wait(300);
    p.style.clipPath='inset('+((p._a.ay-p._a.ref*.95)*p._k).toFixed(1)+'px 0 0 0)';   /* the sheet draws its own thread above: ours is drawn instead */
    FZ.frame(p,'s6'); var line=await spin(s,HX,4,p,walk(p,HX,4+drop,14,null,0,true));
    for(var k=0;k<3;k++){ tilt(p,k%2?-7:7); await wait(500); } tilt(p,0); FZ.frame(p,'s10'); await wait(900);
    FZ.frame(p,'s7'); var up=walk(p,HX,4,12,['s7','s8'],5,true), on=true;
    (function f(){ line.setAttribute('d','M'+HX+' 4L'+HX+' '+p._y.toFixed(1)); if(on) requestAnimationFrame(f); })();
    await up; on=false; line.remove(); p.style.clipPath='';
    FZ.frame(p,'s5'); await walk(p,100,4,16,WALK,9); await walk(p,T[0],T[1],10,['s1','s3'],6,true); FZ.face(p,1); FZ.frame(p,'s9');
    p._busy=false;
  }
  /* while the web is on screen, the spider goes down again about every 40 seconds */
  setInterval(function(){ if(spider && !busy() && !FZ.quiet() && seen(spider)) hang(); },40000);

  /* ---- §6 · the woodpecker pecks a row of equal holes along a log, one a beat: an array ---- */
  async function pecker(force){
    var card=$('#s6'); if(!card) return; var st=stage(card,'peck',170,44); if(st.on && !force) return; st.on=true;
    var G=41, top=30, H=[50,70,90,110,130];
    var s=svg(st,170,44,'<rect class="fz-log" x="26" y="'+top+'" width="124" height="'+(G-top)+'" rx="5"/><path class="fz-log2" d="M30 '+(top+2.5)+'h112" stroke-width="1.2"/>'+
      '<ellipse class="fz-log2" cx="150" cy="'+((top+G)/2)+'" rx="3.2" ry="'+((G-top)/2)+'"/>'+
      H.map(function(x){ return '<ellipse class="fz-hole" cx="'+x+'" cy="'+(top+1.4)+'" rx="2.8" ry="1.3" opacity="0"/>'; }).join(''));
    var holes=$$('.fz-hole',s);
    s.animate([{opacity:0},{opacity:1}],{duration:600}); await wait(700);
    var b=tap(put(st,'wood',19,-30,-40,1,'k8'));
    await FZ.fly(b,[-30,-40],[0,-30],[H[0]-34,top-20],[H[0]-19,top],1000,['k8','k9'],12);
    FZ.frame(b,'k1'); await wait(400);
    for(var i=0;i<H.length && b.isConnected;i++){
      if(i){ FZ.frame(b,'k7'); await walk(b,H[i]-19,top,60,null,0,true); FZ.frame(b,'k1'); await wait(160); }
      FZ.frame(b,'k2'); await wait(180);
      for(var n=0;n<2;n++){ tilt(b,44); FZ.frame(b,'k3'); await wait(110); tilt(b,24); FZ.frame(b,'k4'); await wait(110); }
      tilt(b,44); FZ.frame(b,'k3'); holes[i].setAttribute('opacity','1'); chip(st,H[i],top); await wait(140);
      tilt(b,0); FZ.frame(b,'k1'); await wait(380);
    }
    FZ.frame(b,'k6'); await wait(700); FZ.frame(b,'k1'); await wait(300);
    await flyOff(b,st,1,['k8','k9'],12);
  }
  function chip(st,x,y){ var c=document.createElement('i'); c.className='fz-chip'; c.style.left=x+'px'; c.style.top=y+'px'; st.appendChild(c);
    c.animate([{transform:'translate(0,0)',opacity:1},{transform:'translate('+(4+Math.random()*6)+'px,-9px)',opacity:1,offset:.5},{transform:'translate('+(8+Math.random()*6)+'px,6px)',opacity:0}],{duration:600,easing:'ease-out'}).onfinish=function(){ c.remove(); }; }

  /* ---- §7 · the owl flies in to the last card and stays; it sleeps at night, and nods at the last right answer ---- */
  var owl=null;
  async function keeper(force){
    var card=$('#s7'); if(!card) return; var st=stage(card,'owl',130,0); if(st.on && !force) return; st.on=true; st.innerHTML=''; owl=null;
    var o=put(st,'owl',28,120,-120,-1,'o6');
    await FZ.fly(o,[120,-120],[125,-70],[115,-10],[100,31],1300,['o6','o7'],7);
    FZ.face(o,-1); FZ.frame(o,'o8'); await wait(260); FZ.frame(o,'o1'); await wait(700);
    FZ.frame(o,'o5'); await wait(600); FZ.frame(o,'o1');
    owl=o; o.classList.add('tap'); sleepy();
    o.addEventListener('click',async function(){ if(o._busy) return; o._busy=true; FZ.frame(o,'o4'); await wait(650); FZ.frame(o,night()?'o9':'o1'); o._busy=false; });
  }
  function sleepy(){ if(owl && !owl._busy) FZ.frame(owl,night()?'o9':'o1'); }
  new MutationObserver(sleepy).observe(document.documentElement,{attributes:true,attributeFilter:['data-ft']});
  var lastQ=$$('#p-lesson .quiz').pop();
  document.addEventListener('click',async function(ev){
    var o=ev.target.closest && ev.target.closest('.qopt[data-ok]'); if(!o || !owl || o.closest('.quiz')!==lastQ || owl._busy) return;
    owl._busy=true; for(var k=0;k<2;k++){ FZ.frame(owl,'o2'); await wait(320); FZ.frame(owl,'o1'); await wait(260); } owl._busy=false; sleepy();
  });

  /* ---- Exam tab · a tortoise walks the bottom of the first card, slowly, and rests in the corner ---- */
  async function tortoise(force){
    var card=$('#p-exam .card'); if(!card) return; var st=FZ.edge(card,'tort'); if(st.on && !force) return; st.on=true; st.innerHTML='';
    var t=put(st,'tort',22,14,28,1,'t1'); await show(t,600);
    await walk(t,168,28,9,['t1','t2','t3','t4'],4);
    FZ.frame(t,'t5'); await wait(900); FZ.frame(t,'t10');
    t.classList.add('tap');
    t.addEventListener('click',async function(){ if(t._busy) return; t._busy=true;
      FZ.frame(t,'t7'); await wait(260); FZ.frame(t,'t8'); await wait(1800); FZ.frame(t,'t9'); await wait(700); FZ.frame(t,'t10'); t._busy=false; });
  }

  /* the fixed moments: each when its spot is fully in view below the top bar */
  var RUN={ants:ants, sapling:sapling, comb:comb, web:web, pecker:pecker, keeper:keeper, tortoise:tortoise};
  var AT={ants:['#s1','ants',210,42], sapling:['#s3','sap',150,42], comb:['#s4','comb',Math.max(200,Math.min(400,($('#s4')||{clientWidth:500}).clientWidth-96)),64], web:['#s5','web',150,42], pecker:['#s6','peck',170,44], keeper:['#s7','owl',130,0]};
  Object.keys(AT).forEach(function(k){ var a=AT[k], card=$(a[0]); if(!card) return; stage(card,a[1],a[2],a[3]);
    FZ.edgeSeen(card,a[1],function(){ FZ.later(.5,function(){ q(RUN[k]); }); }); });
  var ex=$('#p-exam .card'); if(ex){ FZ.edge(ex,'tort'); FZ.edgeSeen(ex,'tort',function(){ FZ.later(.8,function(){ q(tortoise); }); }); }

  /* the review panel: one button each */
  var ALL={ants:'Ants · §1', mole:'Mole · Root', caterpillar:'Caterpillar · Leaves', depth:'Spider · Depth', ancestors:'Owl · Ancestors',
    sapling:'Sapling · §3', comb:'Bee · §4', web:'Web · §5', pecker:'Woodpecker · §6', keeper:'Owl · §7', tortoise:'Tortoise · Exam'};
  var VIA={mole:'root', caterpillar:'leaves', depth:'depth', ancestors:'ancestors'};
  function play(k){
    if(VIA[k]){ if(!vst) return; vst.scrollIntoView({block:'center'}); setTimeout(function(){ vq(VIS[VIA[k]]); },600); return; }
    if(k==='tortoise'){ var tb=$('[aria-controls="p-exam"]')||$$('.tabs button,[role=tab]').filter(function(b){ return /exam/i.test(b.textContent); })[0]; if(tb) tb.click(); }
    var a=AT[k], card=a?$(a[0]):$('#p-exam .card'), st=card&&$('.fz-edge.'+(a?a[1]:'tort'),card); if(!st) return;
    st.innerHTML=''; st.on=true; st.scrollIntoView({block:'center'}); setTimeout(function(){ q(function(){ return RUN[k](true); }); },600);
  }
  FZ.onRev(function(REV){
    var at=$$('.fz-revb p',REV).filter(function(p){ return /Earned/.test(p.textContent); })[0], box=document.createElement('div');
    box.innerHTML='<p>Section creatures</p><div class="row">'+Object.keys(ALL).map(function(k){ return '<button type="button" data-c="'+k+'">'+ALL[k]+'</button>'; }).join('')+'</div>';
    while(box.firstChild) at.parentNode.insertBefore(box.firstChild,at);
    REV.addEventListener('click',function(e){ var b=e.target.closest('button[data-c]'); if(b) play(b.dataset.c); });
  });
  if(FORCE && ALL[FORCE]) FZ.later(1.5,function(){ play(FORCE); });
  window.__crea={hang:hang, play:play, met:met, owl:function(){ return owl; }, bee:function(){ return bee; }};
})();


/* =================== TEACHER MODE, SOUND, NIGHT STUDY, ANT TRAILS (2026-11-15) ===================
   Teacher mode (the T key, or ?teach=1): larger text, a quieter forest, and no animal
   comes by itself; the panel calls one when the teacher wants it. Sound: off until the
   speaker button is pressed; birdsong by day, crickets at night, rain in the monsoon,
   all very quiet, made by the browser (no sound files). Night study: after 10 pm, the
   fireflies gather round the section being read, and once a night a small owl says
   goodnight. Ant trails (Trees 2): ants walk round a tree and leave numbered crumbs in
   the order the chosen walk visits the nodes. Preview: ?fznight=1.                    */
(function(){
  var root=document.documentElement, Q=location.search, PG=(/\/0(\d)-[a-z-]+\.html/.exec(location.pathname)||[])[1]||'';
  function ft(){ return root.getAttribute('data-ft')||'morning'; }
  function store(k,v){ try{ if(v===undefined) return localStorage.getItem(k); if(v===null) localStorage.removeItem(k); else localStorage.setItem(k,v); }catch(e){ return null; } }
  function busy(){ return document.body.classList.contains('fsopen') || document.hidden; }
  var host=$('.ftwrap')&&$('.ftwrap').parentNode;

  /* ---- 1 · teacher mode ---- */
  var TKEY='cse2321-teach', badge=null;
  function teach(on,quietly){
    root.classList.toggle('teach',on); store(TKEY,on?'1':null);
    if(on){ snd(false); if(FZ.buildRev){ var R=FZ.buildRev(); var h=$('h4',R); if(h && h.firstChild) h.firstChild.textContent='Teacher: call an animal '; } }
    else if(FZ.rev && !/[?&]fzreview/.test(Q)) FZ.rev.style.display='none';
    if(!badge){ badge=document.createElement('button'); badge.type='button'; badge.className='fz-teachb'; badge.addEventListener('click',function(){ teach(false); }); document.body.appendChild(badge); }
    badge.textContent='Teacher mode · press T to leave'; badge.hidden=!on;
    if(!quietly) toast(on?'Teacher mode: larger text, a quiet forest. Animals come only when called.':'Teacher mode off.');
  }
  function toast(t){ var e=document.createElement('div'); e.className='fz-toast'; e.setAttribute('role','status'); e.textContent=t; document.body.appendChild(e);
    setTimeout(function(){ e.classList.add('go'); setTimeout(function(){ e.remove(); },600); },2600); }
  document.addEventListener('keydown',function(e){
    if(e.key!=='t' && e.key!=='T') return; if(e.ctrlKey||e.metaKey||e.altKey) return;
    var t=e.target; if(t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    teach(!root.classList.contains('teach'));
  });
  if(/[?&]teach=1/.test(Q) || store(TKEY)==='1') teach(true,true);

  /* ---- 2 · sound, off until asked for ---- */
  var SKEY='cse2321-forest-sound', AC=null, master=null, sOn=false, rainSrc=null, tB=null, tC=null, sbtn=null;
  if(host && !RM){
    sbtn=document.createElement('button'); sbtn.type='button'; sbtn.className='fz-sndb'; sbtn.setAttribute('aria-pressed','false');
    sbtn.setAttribute('aria-label','Forest sounds'); sbtn.title='Forest sounds (quiet)';
    sbtn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path class="w" d="M16 9c1.5 1.5 1.5 4.5 0 6M18.5 6.5c3 3 3 8 0 11"/></svg>';
    host.insertBefore(sbtn,$('.ftwrap').nextSibling);
    sbtn.addEventListener('click',function(){ snd(!sOn,true); });
  }
  function snd(on,user){
    if(on && root.classList.contains('teach')) on=false;
    sOn=on; if(sbtn){ sbtn.setAttribute('aria-pressed',on?'true':'false'); sbtn.classList.toggle('on',on); }
    if(user) store(SKEY,on?'on':null);
    if(!on){ if(master && AC) master.gain.setTargetAtTime(0,AC.currentTime,.5); clearTimeout(tB); clearTimeout(tC); return; }
    try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return; }
    if(AC.state==='suspended') AC.resume();
    if(!master) build();
    master.gain.setTargetAtTime(.07,AC.currentTime,1.2);
    clearTimeout(tB); clearTimeout(tC); dayLoop(); nightLoop();
  }
  /* ---- the sound engine: everything is made here, nothing is loaded. One quiet bus, a gentle limiter,
     a little forest echo, and each voice placed somewhere left or right, near or far. ---- */
  var dry=null, wet=null, NOISE=null;
  function build(){
    master=AC.createGain(); master.gain.value=0;
    var comp=AC.createDynamicsCompressor(); comp.threshold.value=-30; comp.ratio.value=4; comp.attack.value=.01; comp.release.value=.4;
    master.connect(comp); comp.connect(AC.destination);
    dry=AC.createGain(); dry.connect(master);
    var verb=AC.createConvolver(), n=Math.floor(AC.sampleRate*2.2), ir=AC.createBuffer(2,n,AC.sampleRate);
    for(var ch=0;ch<2;ch++){ var d=ir.getChannelData(ch); for(var i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3.2)*(i<AC.sampleRate*.012?0:1); }
    verb.buffer=ir; wet=AC.createGain(); wet.gain.value=.32; wet.connect(verb); verb.connect(master);
    var m=AC.sampleRate*3; NOISE=AC.createBuffer(1,m,AC.sampleRate); var nd=NOISE.getChannelData(0), last=0;
    for(var j=0;j<m;j++){ var w=Math.random()*2-1; last=(last+.02*w)/1.02; nd[j]=w*.6+last*3; }   /* a little pinker than white */
    breeze(); rain();
  }
  function rnd(a,b){ return a+Math.random()*(b-a); }
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
  /* a voice's place: pan from left to right, and how near (near = louder, less echo) */
  function place(pan,near){ var p=AC.createStereoPanner?AC.createStereoPanner():null, g=AC.createGain(), e=AC.createGain();
    g.gain.value=near; e.gain.value=1-near*.6;
    if(p){ p.pan.value=pan; p.connect(g); p.connect(e); } g.connect(dry); e.connect(wet); return p||g; }
  function tone(out,t,type,f,dur,peak,glide){ var o=AC.createOscillator(), g=AC.createGain(); o.type=type; o.frequency.setValueAtTime(f[0],t);
    for(var i=1;i<f.length;i++) o.frequency.exponentialRampToValueAtTime(f[i],t+dur*i/(f.length-1)*(glide||1));
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(peak,t+Math.min(.025,dur*.25)); g.gain.setTargetAtTime(0,t+dur*.55,dur*.18);
    o.connect(g); g.connect(out); o.start(t); o.stop(t+dur+.3); }
  function noise(out,t,dur,peak,type,f,q){ var s=AC.createBufferSource(), b=AC.createBiquadFilter(), g=AC.createGain(); s.buffer=NOISE; s.loop=true;
    b.type=type; b.frequency.value=f; b.Q.value=q||1; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(peak,t+dur*.3); g.gain.setTargetAtTime(0,t+dur*.6,dur*.2);
    s.connect(b); b.connect(g); g.connect(out); s.start(t,Math.random()*2); s.stop(t+dur+.5); return b; }
  /* the day's voices */
  var PENTA=[2093,2349,2637,3136,3520,4186];
  var DAY={
    doel:function(t){ var out=place(rnd(-.8,.8),rnd(.45,.8)), n=3+Math.floor(Math.random()*4), base=pick([1,1.12,1.25]);   /* a sweet whistled phrase */
      for(var i=0;i<n;i++){ var f=pick(PENTA)*base*.8; tone(out,t,'sine',[f,f*rnd(.94,1.12)],rnd(.12,.26),.3); t+=rnd(.14,.28); } },
    bulbul:function(t){ var out=place(rnd(-.9,.9),rnd(.4,.7)), f=rnd(1500,2100);   /* a bubbly two-part chatter */
      for(var r=0;r<2+Math.floor(Math.random()*2);r++){ tone(out,t,'triangle',[f,f*1.4,f*1.15],.11,.22); tone(out,t+.13,'triangle',[f*1.3,f*.95],.09,.18); t+=.32; } },
    tit:function(t){ var out=place(rnd(-.9,.9),rnd(.3,.6)), f=rnd(4200,5200), n=7+Math.floor(Math.random()*6);   /* a fast bright trill */
      for(var i=0;i<n;i++){ tone(out,t,'sine',[f,f*.86],.045,.16); t+=.065; } },
    koel:function(t){ var out=place(rnd(-1,1),rnd(.15,.3)), f=rnd(780,880);   /* far away, rising, a few times */
      for(var i=0;i<2+Math.floor(Math.random()*2);i++){ tone(out,t,'sine',[f,f*1.33],.32,.3,.7); tone(out,t+.36,'sine',[f*1.33,f*1.36],.34,.3); f*=1.06; t+=1.05; } },
    peck:function(t){ var out=place(rnd(-1,1),rnd(.2,.4)), n=6+Math.floor(Math.random()*8);   /* a woodpecker, distant */
      for(var i=0;i<n;i++){ noise(out,t,.03,.5,'bandpass',rnd(1100,1400),6); t+=.055; } },
    rustle:function(t){ var out=place(rnd(-1,1),rnd(.3,.6)), b=noise(out,t,rnd(.8,1.6),.18,'bandpass',3200,.7);   /* leaves stir */
      b.frequency.setValueAtTime(2200,t); b.frequency.linearRampToValueAtTime(4200,t+.8); }
  };
  /* the night's voices */
  var NIGHT={
    cricket:function(t){ var out=place(rnd(-.9,.9),rnd(.3,.6)), f=rnd(4100,4700), bursts=2+Math.floor(Math.random()*3);
      for(var k=0;k<bursts;k++){ for(var j=0;j<3;j++) tone(out,t+j*.055,'sine',[f,f*1.01],.035,.11); t+=rnd(.35,.55); } },
    cricket2:function(t){ var out=place(rnd(-.9,.9),rnd(.2,.4)), f=rnd(5300,5800); for(var j=0;j<10;j++) tone(out,t+j*.03,'sine',[f],.02,.06); },
    owl:function(t){ var out=place(rnd(-1,1),rnd(.15,.3)), f=rnd(360,420);   /* a soft hoo, hoo-hoo */
      tone(out,t,'sine',[f,f*.96],.5,.4); tone(out,t+.85,'sine',[f*1.02,f*.97],.22,.32); tone(out,t+1.12,'sine',[f,f*.95],.45,.36); },
    frog:function(t){ if(!monsoon()) return; var out=place(rnd(-1,1),rnd(.25,.45));   /* a low croak, twice */
      for(var i=0;i<2;i++){ var o=AC.createOscillator(), g=AC.createGain(), lp=AC.createBiquadFilter(); o.type='sawtooth'; o.frequency.setValueAtTime(rnd(160,200),t);
        lp.type='lowpass'; lp.frequency.value=900; g.gain.setValueAtTime(0,t); for(var k=0;k<5;k++){ g.gain.linearRampToValueAtTime(.12,t+k*.03+.01); g.gain.linearRampToValueAtTime(.02,t+k*.03+.025); }
        g.gain.linearRampToValueAtTime(0,t+.2); o.connect(lp); lp.connect(g); g.connect(out); o.start(t); o.stop(t+.25); t+=.35; } }
  };
  function monsoon(){ return window.__forest && window.__forest.season==='monsoon'; }
  /* how often each voice speaks: something every second or two, never the same twice in a row */
  var DAYW=[['doel',5],['bulbul',4],['tit',3],['rustle',3],['koel',1],['peck',1]], NIGHTW=[['cricket',6],['cricket2',3],['owl',1],['frog',2]], lastV='';
  function choose(W){ var tot=W.reduce(function(s,w){ return s+w[1]; },0), r; do{ r=Math.random()*tot; for(var i=0;i<W.length;i++){ r-=W[i][1]; if(r<0){ r=W[i][0]; break; } } }while(r===lastV && W.length>1); lastV=r; return r; }
  function dayLoop(){ clearTimeout(tB); if(!sOn) return;
    var m=ft(); if(m!=='night' && !busy()){ var v=choose(DAYW); if(m==='evening' && (v==='tit'||v==='peck')) v='koel'; DAY[v](AC.currentTime+.05); }
    tB=setTimeout(dayLoop,ft()==='evening'?rnd(2200,4200):rnd(1100,2800)); }
  function nightLoop(){ clearTimeout(tC); if(!sOn) return;
    var m=ft(); if((m==='night'||m==='evening') && !busy()){ var v=choose(NIGHTW); if(m==='evening' && v!=='cricket') v='cricket'; NIGHT[v](AC.currentTime+.05); }
    tC=setTimeout(nightLoop,m==='night'?rnd(700,1700):rnd(2500,5000)); }
  /* the bed under everything: a breeze that swells and fades, and rain in the monsoon */
  function breeze(){ var s=AC.createBufferSource(), b=AC.createBiquadFilter(), g=AC.createGain(), lfo=AC.createOscillator(), lg=AC.createGain();
    s.buffer=NOISE; s.loop=true; b.type='lowpass'; b.frequency.value=520; b.Q.value=.4; g.gain.value=.05;
    lfo.frequency.value=.07; lg.gain.value=.035; lfo.connect(lg); lg.connect(g.gain);
    var lfo2=AC.createOscillator(), lg2=AC.createGain(); lfo2.frequency.value=.031; lg2.gain.value=260; lfo2.connect(lg2); lg2.connect(b.frequency);
    s.connect(b); b.connect(g); g.connect(dry); s.start(); lfo.start(); lfo2.start(); }
  function rain(){ if(!monsoon() || rainSrc) return;
    rainSrc=AC.createBufferSource(); rainSrc.buffer=NOISE; rainSrc.loop=true;
    var lp=AC.createBiquadFilter(), hp=AC.createBiquadFilter(), g=AC.createGain(); lp.type='lowpass'; lp.frequency.value=2600; hp.type='highpass'; hp.frequency.value=400; g.gain.value=.16;
    rainSrc.connect(hp); hp.connect(lp); lp.connect(g); g.connect(dry); rainSrc.start();
    (function thunder(){ setTimeout(function(){ if(sOn && !busy()){ var t=AC.currentTime+.05, out=place(rnd(-.6,.6),.5); noise(out,t,3.5,.35,'lowpass',140,.7); } thunder(); },rnd(40000,90000)); })(); }
  /* a tap on any creature gets a small answer, if the sound is on */
  document.addEventListener('click',function(e){ if(!sOn || !AC || !e.target.closest) return; var c=e.target.closest('.fz-spr.tap,.fz-hog,.fz-frog,.fz-x');
    if(c) tone(place(0,.6),AC.currentTime+.02,'sine',[2600,3400,2900],.16,.18); },true);
  /* a returning listener who chose sound: it waits for their first click (browsers ask for one) */
  if(store(SKEY)==='on' && sbtn){ sbtn.classList.add('wait'); document.addEventListener('pointerdown',function f(){ document.removeEventListener('pointerdown',f); sbtn.classList.remove('wait'); snd(true); }); }

  /* ---- 3 · night study ---- */
  var NF=/[?&]fznight=1/.test(Q);
  function late(){ var h=new Date().getHours(); return NF || h>=22 || h<5; }
  if(!RM){
    var flies=[], layer=null;
    function cardNow(){ var best=null, c=window.innerHeight/2; $$('#p-lesson .card.numbered,#p-exam .card').forEach(function(k){ var r=k.getBoundingClientRect(); if(r.top<c && r.bottom>c) best=k; }); return best; }
    function flyTick(now){
      var want=ft()==='night' && late() && !root.classList.contains('teach') && !busy();
      if(want && !layer){ layer=document.createElement('div'); layer.className='fz-nflies'; layer.setAttribute('aria-hidden','true'); document.body.appendChild(layer);
        for(var i=0;i<7;i++){ var e=document.createElement('i'); e.style.animationDelay=(-Math.random()*3)+'s'; layer.appendChild(e);
          flies.push({e:e,x:Math.random()*innerWidth,y:innerHeight*(.3+Math.random()*.5),a:Math.random()*6.3,s:.5+Math.random()*.6}); } }
      if(!want && layer){ layer.remove(); layer=null; flies=[]; }
      if(layer){ var k=cardNow(), r=k?k.getBoundingClientRect():null;
        flies.forEach(function(f,i){ f.a+=.004*f.s*(i%2?1:-1)*1.6;
          var tx, ty;
          if(r){ /* round the edge of the section being read, a little outside it */
            var p=(f.a/6.283%1+1)%1, W=r.width+40, H=Math.min(r.height,innerHeight*.8)+40, L=2*(W+H), d=p*L, x0=r.left-20, y0=Math.max(r.top,60)-20;
            if(d<W){ tx=x0+d; ty=y0; } else if(d<W+H){ tx=x0+W; ty=y0+(d-W); } else if(d<2*W+H){ tx=x0+W-(d-W-H); ty=y0+H; } else { tx=x0; ty=y0+H-(d-2*W-H); }
          } else { tx=innerWidth/2+Math.cos(f.a*3)*200; ty=innerHeight/2+Math.sin(f.a*2)*120; }
          f.x+=(tx-f.x)*.02+Math.sin(now/700+i)*.4; f.y+=(ty-f.y)*.02+Math.cos(now/900+i*2)*.4;
          f.e.style.transform='translate('+f.x.toFixed(1)+'px,'+f.y.toFixed(1)+'px)'; }); }
      requestAnimationFrame(flyTick);
    }
    requestAnimationFrame(flyTick);
    /* the owl's goodnight: once a night, after a while on the page */
    var day=new Date(); if(day.getHours()<5) day.setDate(day.getDate()-1);
    var OKEY='cse2321-goodnight-'+day.toISOString().slice(0,10);
    function goodnight(){
      if(!late() || store(OKEY) || root.classList.contains('teach') || !FZ.spr || !FZ.ART.owl){ return; }
      store(OKEY,'1');
      var w=document.createElement('div'); w.className='fz-gn'; w.setAttribute('role','status'); document.body.appendChild(w);
      var o=FZ.spr('owl',34,'fz-gnowl tap'); o.style.position='absolute'; w.appendChild(o);
      var b=document.createElement('p'); b.className='fz-gnb'; b.innerHTML='It is late. The tree will be here tomorrow.<br>Sleep well.'; w.appendChild(b);
      FZ.place(o,40,60); FZ.face(o,1);
      FZ.fly(o,[-60,-200],[0,-120],[30,20],[40,60],1400,['o6','o7'],7).then(function(){ FZ.frame(o,'o8'); setTimeout(function(){ FZ.frame(o,'o1'); w.classList.add('say'); },250); });
      function bye(){ if(w._gone) return; w._gone=true; w.classList.remove('say'); FZ.fly(o,[o._x,o._y],[o._x+40,o._y-60],[-40,-200],[-120,-320],1300,['o6','o7'],7).then(function(){ w.remove(); }); }
      w.addEventListener('click',bye); setTimeout(bye,16000);
    }
    setTimeout(function wait(){ if(busy()) return setTimeout(wait,5000); goodnight(); },NF?2500:45000);
  }

  /* ---- 4 · ant trails, on Trees 2: the walk, crumb by crumb ---- */
  var AT=$('#ant-trail');
  if(AT && window.TreeLib){
    var stageEl=$('.antstage',AT), out=$('.antout',AT), V=TreeLib.drawTree(stageEl,'A(B(D,E),C(-,F))',{xg:62,r:18,yg:70,mx:44,padB:16,label:'A small tree for the ants: A has children B and C; B has D and E; C has only a right child, F'});
    var R=V.R, svg=V.svg, P={};
    V.all.forEach(function(n){ var c=$('circle.o',V.node[n.id]); P[n.id]={x:+c.getAttribute('cx'),y:+c.getAttribute('cy'),n:n}; });
    var off=12;
    function Lp(n){ var p=P[n.id]; return {x:p.x-R-off,y:p.y+3}; } function Bp(n){ var p=P[n.id]; return {x:p.x,y:p.y+R+off}; } function Rp(n){ var p=P[n.id]; return {x:p.x+R+off,y:p.y+3}; }
    /* the path round the tree, with its three passes at every node: left (pre), under (in), right (post) */
    var path=[];
    (function tour(n){ var p=Lp(n); p.ev={n:n,k:'pre'}; path.push(p);
      if(n.l){ tour(n.l); } var b=Bp(n); b.ev={n:n,k:'in'}; path.push(b);
      if(n.r){ tour(n.r); } var q=Rp(n); q.ev={n:n,k:'post'}; path.push(q); })(V.t);
    var alayer=document.createElement('div'); alayer.className='antlayer'; stageEl.appendChild(alayer); stageEl.style.position='relative';
    var running=0, crumbs=[];
    function scale(){ var r=svg.getBoundingClientRect(), s=stageEl.getBoundingClientRect(); return {k:r.width/V.W, ox:r.left-s.left, oy:r.top-s.top}; }
    function clear(){ crumbs.forEach(function(c){ c.remove(); }); crumbs=[]; alayer.innerHTML=''; $$('.tv-nd',svg).forEach(function(g){ g.classList.remove('ant-on'); }); }
    function crumb(p,num){ var g=TreeLib.sv('g',{'class':'antcr'},svg); TreeLib.sv('circle',{cx:p.x,cy:p.y,r:8},g); var t=TreeLib.sv('text',{x:p.x,y:p.y},g); t.textContent=num; crumbs.push(g); }
    async function walkIt(kind,id){
      clear(); var seq=[], s=scale(), useSpr=!!(FZ.spr && FZ.ART.ant) && !RM;
      $$('button[data-o]',AT).forEach(function(b){ b.classList.toggle('on',b.dataset.o===kind); });
      out.innerHTML='<b>'+{pre:'Preorder',in:'Inorder',post:'Postorder'}[kind]+'</b>: the ants drop a crumb at each node\'s '+{pre:'first',in:'second',post:'third'}[kind]+' pass. Say the order before they finish.';
      var ants=[];
      if(useSpr) for(var i=0;i<3;i++){ var a=FZ.spr('ant',13,'antsp'); a.style.position='absolute'; alayer.appendChild(a); FZ.place(a,path[0].x*s.k+s.ox,path[0].y*s.k+s.oy); a.style.opacity=i?'.85':'1'; ants.push(a); }
      function at(a,p){ var x=p.x*s.k+s.ox, y=p.y*s.k+s.oy; return [x,y]; }
      function step(a,p){ var q=at(a,p), dx=q[0]-a._x, dy=q[1]-a._y, dir=dx>=0?1:-1; a._extra=(Math.abs(dx)+Math.abs(dy)>1)?'rotate('+(Math.atan2(dir*dy,dir*dx)*180/Math.PI).toFixed(1)+'deg)':''; FZ.face(a,dir);
        return FZ.walk(a,q[0],q[1],95,['a1','a2','a3','a4'],14,true); }
      async function follower(a,delay){ await FZ.wait(delay); for(var j=1;j<path.length && running===id;j++) await step(a,path[j]); }
      if(ants[1]) follower(ants[1],650); if(ants[2]) follower(ants[2],1300);
      for(var j=0;j<path.length && running===id;j++){
        var p=path[j];
        if(useSpr && j) await step(ants[0],p); else if(!useSpr) { /* reduced motion: no walk, the crumbs at once */ }
        if(p.ev && p.ev.k===kind){ seq.push(p.ev.n.k); crumb(p,seq.length); V.node[p.ev.n.id].classList.add('ant-on');
          out.innerHTML='<b>'+{pre:'Preorder',in:'Inorder',post:'Postorder'}[kind]+'</b>: <span class="mono">'+seq.join(' ')+'</span>'; if(useSpr) await FZ.wait(380); }
      }
      if(running!==id) return;
      ants.forEach(function(a){ a.animate([{opacity:1},{opacity:0}],{duration:600,fill:'forwards'}); });
      out.innerHTML='<b>'+{pre:'Preorder',in:'Inorder',post:'Postorder'}[kind]+'</b>: <span class="mono">'+seq.join(' ')+'</span>. '+
        {pre:'Each node is written the first time the ants pass it, on its left.',in:'Each node is written as the ants pass under it, between its two subtrees.',post:'Each node is written the last time the ants pass it, on its right.'}[kind];
    }
    AT.addEventListener('click',function(e){ var b=e.target.closest('button[data-o]'); if(!b) return; running++; walkIt(b.dataset.o,running); });
  }
  window.__extras={teach:teach, snd:snd, late:late};
})();

})();
