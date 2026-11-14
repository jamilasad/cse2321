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
    var px=null, py=0, pvx=0, pvy=0;
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
  window.addEventListener('scroll',function(){
    var dy=window.scrollY-lastY; lastY=window.scrollY;
    if(busy()||!WIDE.matches) return;
    gust=Math.max(-1,Math.min(1,gust+dy/700));
    if(!blowing){ blowing=true; requestAnimationFrame(blow); }
  },{passive:true});

  /* leaves and birds that leave a margin tree */
  var LEAFC={morning:'#7aa352',afternoon:'#8fae4f',evening:'#c98a3c',night:'#4f6f58'}, falling=0;
  function dropLeaf(tree){
    if(falling>16) return;
    var cr=tree.querySelector('.fz-crown').getBoundingClientRect();
    var x=rnd(cr.left+cr.width*.15,cr.right-cr.width*.15), y=rnd(cr.top+cr.height*.3,cr.bottom-cr.height*.15);
    var l=document.createElement('span'); l.className='fz-mleaf'; l.setAttribute('aria-hidden','true');
    l.innerHTML='<svg viewBox="0 0 16 12"><path d="M1 11C2 4 8 1 15 1c-1 6-5 10-14 10z" fill="'+(LEAFC[ft()]||LEAFC.morning)+'"/></svg>';
    l.style.left=x+'px'; l.style.top=y+'px'; document.body.appendChild(l); falling++;
    var fall=Math.max(20,window.innerHeight-y-rnd(8,22)), dx=rnd(-26,26), dur=rnd(2600,3800), rot=rnd(220,420)*(Math.random()<.5?-1:1);
    var a=l.animate([
      {transform:'translate(0,0) rotate(0deg)',opacity:0},
      {opacity:.9,offset:.08},
      {transform:'translate('+(dx*.6+12)+'px,'+(fall*.35)+'px) rotate('+(rot*.35)+'deg)',offset:.35},
      {transform:'translate('+(dx*.2-12)+'px,'+(fall*.7)+'px) rotate('+(rot*.7)+'deg)',offset:.7},
      {transform:'translate('+dx+'px,'+fall+'px) rotate('+rot+'deg)',opacity:.9,offset:.86},
      {transform:'translate('+dx+'px,'+fall+'px) rotate('+rot+'deg)',opacity:0}
    ],{duration:dur,easing:'ease-in'});
    a.onfinish=function(){ l.remove(); falling--; };
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
    fl.addEventListener('click',function(e){ if(!e.target.closest('.fz-mush,.fz-hog')) cross(); });
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

})();
