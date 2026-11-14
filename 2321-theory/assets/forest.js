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
      '<g class="fz-owl"><circle cx="62" cy="636" r="3.4"/><circle cx="78" cy="636" r="3.4"/></g></g></g></g>'+
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
    '<circle cx="22.4" cy="7.8" r="1" fill="#1f2d24"/><path d="M25.5 8.6l3.6 1-3.6 1.2z" fill="#e0a33a"/><path d="M5 12l-5 -2 3 5z" fill="#55704a"/>'+
    '<path class="wing" d="M9 11c3-4 8-4 10 0" fill="none" stroke="#55704a" stroke-width="1.6"/><path d="M11 19v3M15 19v3" stroke="#8a6240" stroke-width="1.2"/></svg>';
  $$('.turn').forEach(function(t){
    var th=t.querySelector('.th'), btn=t.querySelector('.tbtn'); if(!th||!btn) return;
    var b=document.createElement('span'); b.className='fz-bird'; b.innerHTML=BIRD; th.appendChild(b);
    btn.addEventListener('click',function(){ if(!b.classList.contains('gone')) b.classList.add('gone'); });
    b.addEventListener('click',function(e){
      e.stopPropagation(); if(b.classList.contains('gone')) return;
      b.classList.remove('flut'); void b.offsetWidth; b.classList.add('flut');
    });
    b.addEventListener('animationend',function(e){ if(e.animationName==='fzflut') b.classList.remove('flut'); });
  });

  /* ---- 5 · the forest floor at the end of a lesson ----
     Grass bends away from the pointer. The hedgehog crosses once when you
     arrive; touch it and it curls up; touch the empty floor and it crosses
     back. Mushrooms puff when touched. At night, fireflies over the floor. */
  var nav=$('#p-lesson .pagenav');
  if(nav){
    var fl=document.createElement('div'); fl.className='fz-floor'; fl.setAttribute('aria-hidden','true');
    var HOG='<svg class="hb" viewBox="0 0 44 26"><path d="M4 20c0-10 8-16 18-16s16 6 18 14l-4 2H6z" fill="#8a6240"/><path d="M8 10l-3-4 6 2M14 6l-1-5 4 4M21 4l1-5 3 5M28 6l3-4 1 5M33 10l4-3-1 5" fill="none" stroke="#6b4a2c" stroke-width="1.6"/>'+
      '<path d="M34 14c4 0 8 2 9 5l-9 2z" fill="#d7b994"/><circle cx="37" cy="16" r="1" fill="#1f2d24"/><circle cx="43" cy="19" r="1.1" fill="#1f2d24"/><path d="M12 22v3M28 22v3" stroke="#5b4027" stroke-width="2"/></svg>'+
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
    var hog=fl.querySelector('.fz-hog'), walking=false, crossings=0;
    function cross(){
      if(walking||busy()) return;
      fl.classList.remove('walk','back'); void fl.offsetWidth;
      fl.classList.add(crossings%2?'back':'walk'); crossings++; walking=true;
    }
    hog.addEventListener('animationend',function(e){ if(e.animationName==='fzwalk'||e.animationName==='fzwalkb') walking=false; });
    new IntersectionObserver(function(es,ob){
      es.forEach(function(e){ if(e.isIntersecting && !busy()){ cross(); ob.disconnect(); } });
    },{threshold:.6}).observe(fl);
    hog.addEventListener('click',function(e){
      e.stopPropagation(); if(hog.classList.contains('curl')) return;
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
   ?fzvisit=doel|deer|star|rain.                                             */
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
    '<path class="bk" d="M9.8 -11.2l3.4 1-3.4 1.1z"/><circle class="ey" cx="7.6" cy="-11.6" r=".9"/><path d="M-6.5 -7.5l-6 -2.4 2.6 5z"/>'+
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
    '<circle cx="11" cy="13.5" r="3.6" fill="#f6ecd8"/><circle cx="19" cy="13.5" r="3.6" fill="#f6ecd8"/>'+
    '<g class="eyes"><circle cx="11" cy="13.5" r="2.4" fill="#e8b04a"/><circle cx="19" cy="13.5" r="2.4" fill="#e8b04a"/><circle cx="11" cy="13.5" r="1.1" fill="#1f2d24"/><circle cx="19" cy="13.5" r="1.1" fill="#1f2d24"/></g>'+
    '<path d="M14 16l1 2.4 1-2.4z" fill="#e0a33a"/></g></svg>';
  var arrivals=0, floorSeen=false, flowers=[], greens=[], owl=null;
  function bud(el){ el.classList.add('bud'); if(floorSeen) setTimeout(open,60); }
  function open(){
    if(!fl) return;
    $$('.bud',fl).forEach(function(el,k){ setTimeout(function(){ el.classList.remove('bud'); el.classList.add('opn'); },k*220); });
  }
  if(fl) new IntersectionObserver(function(es){ floorSeen=es[0].isIntersecting; if(floorSeen && !busy()) open(); },{threshold:.4}).observe(fl);

  function arrive(){
    var k=arrivals++;
    if(FZ.guts){
      var g=FZ.guts[k%2], p=PERCH[Math.floor(k/2)%PERCH.length], tr=$$('.fz-sway',g)[p[0]];
      if(tr){ var e=document.createElementNS(SVGNS,'g'); e.setAttribute('class','fz-perch'); e.setAttribute('transform','translate('+p[1]+','+p[2]+')');
        e.innerHTML=PB; tr.appendChild(e); }
    }
    if(fl){ var b=document.createElement('span'); b.className='fz-fbird fz-x'; b.innerHTML=BIRDSVG;
      b.style.left=FBSLOT[k%FBSLOT.length]+'%'; fl.appendChild(b); bud(b);
      b.addEventListener('click',function(e){ e.stopPropagation(); hop(b); }); }
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
      var k=flowers.length, f=document.createElement('span'); f.className='fz-flower fz-x'; f.innerHTML=FLOWER;
      f.style.left=FSLOT[k%FSLOT.length]+'%'; fl.appendChild(f); flowers.push(f); bud(f);
      f.addEventListener('click',function(e){ e.stopPropagation(); hop(this); });
      var l=onFloor('#6f9a48',false,true); bed.appendChild(l); greens.push(l);
    }
    while(flowers.length>s.r){ flowers.pop().remove(); greens.pop().remove(); }
    var perfect=s.n>0 && s.r===s.n;
    if(perfect && !owl){
      owl=document.createElement('span'); owl.className='fz-owlf fz-x'; owl.innerHTML=OWL; fl.appendChild(owl); bud(owl);
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
  function later(sec,fn){ setTimeout(function tick(){ if(busy()) return setTimeout(tick,4000); fn(); },sec*1000); }
  var DOEL='<svg viewBox="0 0 30 24"><path d="M9 13L3 3" stroke="#1d1f22" stroke-width="3" stroke-linecap="round"/><ellipse cx="13.5" cy="14" rx="7.5" ry="5.2" fill="#1d1f22"/>'+
    '<path d="M8 15.5c2.5 4 9.5 4.6 12.4.4-4.2 1-8.4.6-12.4-.4z" fill="#f4f2ec"/><path d="M10 12h6" stroke="#f4f2ec" stroke-width="1.7" stroke-linecap="round"/>'+
    '<circle cx="20.6" cy="9.4" r="3.9" fill="#1d1f22"/><path d="M24.2 9l3.6 1-3.6 1z" fill="#1d1f22"/><circle cx="21.8" cy="8.7" r=".75" fill="#f4f2ec"/>'+
    '<path d="M12.5 19v4.5M15.5 19v4.5" stroke="#55606a" stroke-width="1.1"/></svg>';
  var NOTE='<svg viewBox="0 0 10 14"><path d="M7 1.5v8.2" stroke="currentColor" stroke-width="1.3"/><ellipse cx="4.9" cy="10.2" rx="2.4" ry="1.8" fill="currentColor"/><path d="M7 1.5c1.6 1 2.5 2.2 2.5 4.3" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
  function sing(el,then){
    var n=0;
    (function note(){
      if(!el.isConnected) return;
      if(n++>=5){ if(then) then(); return; }
      var r=el.getBoundingClientRect(), s=document.createElement('span'); s.className='fz-note'; s.innerHTML=NOTE; s.setAttribute('aria-hidden','true');
      s.style.left=(r.left+r.width*.7)+'px'; s.style.top=(r.top-4)+'px'; document.body.appendChild(s);
      s.animate([{transform:'translate(0,0) rotate(-8deg)',opacity:0},{opacity:.85,offset:.2},{transform:'translate('+rnd(4,16)+'px,-34px) rotate(10deg)',opacity:0}],
        {duration:1700,easing:'ease-out'}).onfinish=function(){ s.remove(); };
      setTimeout(note,rnd(500,900));
    })();
  }
  var doelOn=false;
  function doel(){
    if(doelOn || (!day() && FORCE!=='doel')) return; doelOn=true;
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
    '<path class="st" d="M47 11.5l6 6"/><circle class="ey" cx="51" cy="12.8" r="1.1"/><circle class="ns" cx="62.6" cy="20.8" r="1"/></g></svg>';
  var deerOn=false;
  function deer(){
    if(deerOn || !WIDE.matches || !FZ.guts) return; deerOn=true;
    var d=document.createElement('span'); d.className='fz-deer'; d.setAttribute('aria-hidden','true'); d.innerHTML=DEER;
    FZ.guts[0].appendChild(d); void d.offsetWidth; d.classList.add('peek');
    var gone=false;
    function away(fast){ if(gone) return; gone=true; window.removeEventListener('pointermove',near);
      d.classList.add(fast?'duck':'leave'); setTimeout(function(){ d.remove(); },fast?600:1600); }
    function near(e){ var r=d.getBoundingClientRect(); if(Math.abs(e.clientX-(r.left+r.width/2))<170 && Math.abs(e.clientY-(r.top+r.height/2))<170) away(true); }
    setTimeout(function(){ window.addEventListener('pointermove',near,{passive:true}); },1200);
    setTimeout(function(){ away(false); },rnd(8000,12000));
  }
  if(FORCE==='doel' || Math.random()<1/8) later(FORCE==='doel'?2:rnd(25,80),doel);
  if(FORCE==='deer' || Math.random()<.5) later(FORCE==='deer'?2:rnd(40,140),deer);
  (function nextStar(first){
    later(first&&FORCE==='star'?2:first?rnd(40,120):rnd(140,220),function(){
      if(ft()==='night' || FORCE==='star') star();
      nextStar(false);
    });
  })(true);

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
      '<circle cx="8.5" cy="6" r="3.2" fill="#7aa352"/><circle cx="17.5" cy="6" r="3.2" fill="#7aa352"/><circle cx="8.5" cy="5.6" r="1.4" fill="#1f2d24"/><circle cx="17.5" cy="5.6" r="1.4" fill="#1f2d24"/>'+
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
    var rainAt=performance.now()/1000+(FORCE==='rain'?2:rnd(15,40)), rainFor=0;
    FZ.sky.push(function(S){
      var now=performance.now()/1000;
      if(!S.rain){ S.rain=[]; S.ring=[]; }
      if(now>rainAt && !rainFor){ rainFor=rnd(20,30); rainAt=now; }
      var on=rainFor && now-rainAt<rainFor, f=on?Math.min(1,(now-rainAt)/3,(rainAt+rainFor-now)/3):0;
      if(rainFor && !on){ rainFor=0; rainAt=now+rnd(150,260); }
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

  window.__forest={season:season, arrive:arrive, sync:sync, star:star, doel:doel, deer:deer,
    state:function(){ return {arrivals:arrivals, flowers:flowers.length, owl:!!owl, bed:bed?bed.children.length:0, gusts:gusts, tumbling:tumb.length,
      perched:$$('.fz-perch').length, doel:!!$('.fz-doel'), deer:!!$('.fz-deer'), shooting:!!shoot}; }};
})();

})();
