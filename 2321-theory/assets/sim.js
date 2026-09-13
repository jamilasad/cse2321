/* ==========================================================================
   CSE-2321 · the simulator shell
   --------------------------------------------------------------------------
   One driver for every simulator on the site. A page describes its steps and
   draws its own picture; this file supplies the frame, the step rail, the
   watch strip, the narration, the buttons, Focus, and the keyboard.

   Two shapes:
     stepped  — pass `steps`; you get a rail, a counter, Next/Back/Reset, and
                buttons that disable at both ends.
     free     — omit `steps`; the student drives it. You still get the frame,
                Focus, watches and narration.

   Two options a stepped simulator may add:
     play     — put a <button data-k="play"> in the control row and the shell
                owns the auto-advance: label, interval, stopping at the end,
                stopping the moment anyone touches Next, Back, Reset or the
                rail, and the `p` key. `play:1100` sets the pause in ms.
     lines    — nominate the nodes that are the listing: `lines:'#x .st'`.
                The shell then marks the live one `cur` every step, scrolls it
                into view only when it is off-screen, and — where a step
                carries `cond:{ln,ok}` — marks that line `simtrue` or
                `simfalse`, tints its rail segment green or red, and prints
                TRUE or FALSE beside the narration. The nodes can be anything:
                on the flowchart page they are the SVG shapes, so the decision
                diamond itself goes green on Yes and red on No.

                A widget may show the SAME step in two listings at once — the
                numbered procedure and the C++ beside it — at different line
                numbers. Pass a list, each with its own index, and switching
                tabs never loses your place:

                  lines:[{sel:'#x [data-pane=\"a\"] .st', of:function(s){return s.la;}},
                         {sel:'#x [data-pane=\"c\"] .cl', of:function(s){return s.lc;}}]

   ES5 on purpose: it has to match the rest of the site, and it has to run
   from file:// on a classroom laptop with no build step.

   VERSION. Every page links this file as `sim.js?v=N`. GitHub Pages lets a
   browser cache it, so a laptop that has already opened the site can keep
   serving an old copy after a change. BUMP THE ?v= ON EVERY PAGE whenever
   this file or sim.css changes, or the change will not reach the room.
   ========================================================================== */
window.Sim = (function(){
"use strict";

var $  = function(s,r){ return (r||document).querySelector(s); };
var $$ = function(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

var REG = [];          /* every mounted simulator, for the keyboard */
var ov=null, fsBody=null, fsName=null, holder=null, openSim=null;
var THEME_KEY='cse2321-focus-skin';

/* ---------- the Focus overlay: built once, shared by every simulator ------
   Focus MOVES the block into the overlay and puts it back on close, so there
   is only ever one copy of the DOM and no state to keep in sync.          */
function buildOverlay(){
  if(ov) return;
  ov=document.createElement('div');
  ov.className='fsov';
  ov.innerHTML='<div class="fsbar"><span class="fsnm" id="fs-nm"></span>'+
               '<button class="fslt" type="button" id="fs-lt" title="Light or dark bench"></button>'+
               '<button class="fsx" type="button" id="fs-x">Esc &#10005;</button></div>'+
               '<div class="fsbody" id="fs-body"></div>';
  document.body.appendChild(ov);
  fsBody=$('#fs-body',ov); fsName=$('#fs-nm',ov);
  $('#fs-x',ov).addEventListener('click',function(){ close(); });

  /* Dark is the default: highest contrast in a lit room. Some projectors
     cannot draw a convincing black, so the skin is a choice and it sticks. */
  var lt=$('#fs-lt',ov);
  function paintSkin(){
    var light=ov.classList.contains('lit');
    lt.innerHTML = light ? '\u263E Dark' : '\u2600 Light';
    lt.setAttribute('aria-pressed', light?'true':'false');
  }
  var saved=null; try{ saved=localStorage.getItem(THEME_KEY); }catch(e){}
  if(saved==='light') ov.classList.add('lit');
  paintSkin();
  lt.addEventListener('click',function(){
    ov.classList.toggle('lit');
    try{ localStorage.setItem(THEME_KEY, ov.classList.contains('lit')?'light':'dark'); }catch(e){}
    paintSkin();
    if(openSim) openSim.refit();
  });
  ov.addEventListener('click',function(e){ if(e.target===ov) close(); });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape' && ov.classList.contains('on')) close();
  });
}

function open(sim){
  buildOverlay();
  if(openSim) close();
  holder=document.createComment('sim-focus-placeholder');
  sim.el.parentNode.insertBefore(holder, sim.el);
  fsBody.appendChild(sim.el);
  fsName.textContent = sim.name || '';
  ov.classList.add('on');
  document.body.classList.add('fsopen');
  openSim=sim;
  mark();
  /* refit after the overlay has actually laid out, not on one frame */
  sim.refit();
  void ov.offsetWidth;
  requestAnimationFrame(function(){ sim.refit(); });
  setTimeout(function(){ sim.refit(); },150);
  $('#fs-x',ov).focus({preventScroll:true});
}

function close(){
  if(!openSim) return;
  var sim=openSim;
  if(holder && holder.parentNode) holder.parentNode.replaceChild(sim.el, holder);
  holder=null; openSim=null;
  mark();
  ov.classList.remove('on');
  document.body.classList.remove('fsopen');
  sim.refit();
  var b=$('.focusb',sim.el); if(b) b.focus({preventScroll:true});
}

/* ---------- one simulator ---------- */
function make(cfg){
  var el = typeof cfg.el==='string' ? $(cfg.el) : cfg.el;
  if(!el) return null;

  var steps  = cfg.steps || null;
  var railEl = $('.simrail',el);
  var msgEl  = $('.simmsg p',el);
  var numEl  = $('.simmsg .smn',el);
  var watEl  = $('.simwatch',el);
  var cntEl  = $('.simcnt',el);
  var metEl  = $('.simmeter b',el);
  var bNext  = $('[data-k="next"]',el);
  var bBack  = $('[data-k="back"]',el);
  var bReset = $('[data-k="reset"]',el);
  var bPlay  = $('[data-k="play"]',el);
  var focusB = $('.focusb',el);

  var i=0, lastWatch={};
  var timer=null;                         /* the Play interval, if one is running */
  var PLAY_MS = (typeof cfg.play==='number' && cfg.play>0) ? cfg.play : 1000;
  var lineEls=null, verdEl=null;

  var api={
    el:el,
    /* Bring something into view ONLY if it is actually outside the box it
       lives in, and then by the smallest amount that works. Re-centring the
       view on every press makes a walk impossible to follow — the thing that
       changed stays still and the whole picture slides underneath it. */
    reveal:function(target,container){
      if(!target||!container) return;
      var t=target.getBoundingClientRect(), c=container.getBoundingClientRect();
      var pad=12;
      if(t.top < c.top+pad)            container.scrollTop -= (c.top+pad) - t.top;
      else if(t.bottom > c.bottom-pad) container.scrollTop += t.bottom - (c.bottom-pad);
    },
    name: cfg.name || (($('.simnm',el)||{}).textContent||'').trim(),
    index:function(){ return i; },
    count:function(){ return steps?steps.length:0; },
    msg:function(html){ if(msgEl) msgEl.innerHTML=html; },
    /* A watch chip flashes on the step where its value changed, so nothing
       moves silently. Pass [['LOC',4],['C',2]] — order is kept. */
    watch:function(list,opt){
      if(!watEl) return;
      var h='',seen={};
      for(var k=0;k<list.length;k++){
        var n=list[k][0], v=String(list[k][1]);
        var extra=(list[k][2]||'');
        seen[n]=v;
        var chg = (lastWatch.hasOwnProperty(n) && lastWatch[n]!==v);
        h+='<span class="wch'+(chg?' chg':'')+(extra?' '+extra:'')+'">'+
           '<span class="wn">'+n+'</span><span class="wv">'+v+'</span></span>';
      }
      watEl.innerHTML=h;
      if(!opt||!opt.keep) lastWatch=seen;
    },
    resetWatch:function(){ lastWatch={}; },
    meter:function(v){ if(metEl) metEl.textContent=v; },
    focus:function(){ open(api); },
    refit:function(){ if(cfg.onFit) cfg.onFit(api); },
    hasPlay:function(){ return !!(bPlay && steps); },
    playing:function(){ return !!timer; },
    toggle:function(){ if(timer) pause(); else play(); },
    go:go, next:next, back:back, reset:reset, play:play, pause:pause
  };

/* ---------- Play: the shell owns the clock -------------------------------
   A lecturer starts the run, then talks over it. So Play must stop itself at
   the last step, stop the instant anyone reaches for Next or Back — the
   press means "I want to drive now" — and start over if pressed at the end,
   because nobody presses Play to watch nothing happen.                    */
  function playLabel(){
    if(!bPlay) return;
    bPlay.innerHTML = timer ? (bPlay.getAttribute('data-on')  || '\u23F8 Pause')
                            : (bPlay.getAttribute('data-off') || '\u25B6 Play');
    bPlay.setAttribute('aria-pressed', timer?'true':'false');
  }
  function pause(){ if(timer){ clearInterval(timer); timer=null; playLabel(); } }
  function play(){
    if(!steps || !bPlay || timer) return;
    if(i>=steps.length-1){ i=0; lastWatch={}; paint(); }
    timer=setInterval(function(){
      if(i<steps.length-1){ i++; paint(); }
      else pause();
    },PLAY_MS);
    playLabel();
  }

/* ---------- the listing: one live line, and the answer to its condition ---
   Every stepper on the site was doing this by hand, and every one of them
   was doing it slightly differently. The page says which nodes are lines;
   the shell says which one is live and what a condition on it evaluated to. */
  /* one listing, or several shown side by side — each with its own index */
  function listings(){
    if(lineEls) return lineEls;
    var L=cfg.lines;
    if(!L){ lineEls=[]; return lineEls; }
    var dflt = cfg.lineOf || function(st){ return st.l; };
    if(typeof L==='string')      lineEls=[{nodes:$$(L), of:dflt, first:true}];
    else if(L.length===undefined) lineEls=[{nodes:[L], of:dflt, first:true}];
    else if(typeof L[0]==='string' || (L[0] && L[0].nodeType))
                                 lineEls=[{nodes:(typeof L[0]==='string'?$$(L[0]):L), of:dflt, first:true}];
    else lineEls=L.map(function(x,i){
      return {nodes: typeof x.sel==='string' ? $$(x.sel) : x.sel,
              of: x.of || dflt, first:i===0};
    });
    return lineEls;
  }
  /* the box the listing scrolls inside, if it scrolls at all */
  function scroller(node){
    if(cfg.pane) return $(cfg.pane);
    var p=node.parentNode;
    while(p && p.nodeType===1){
      var ov=window.getComputedStyle(p).overflowY;
      if((ov==='auto'||ov==='scroll') && p.scrollHeight>p.clientHeight+1) return p;
      p=p.parentNode;
    }
    return null;
  }
  function indexIn(set, st){
    if(!st) return null;
    /* cond.ln names a line in the FIRST listing only — with several listings
       each one already carries its own index function */
    if(set.first && st.cond && typeof st.cond.ln==='number') return st.cond.ln;
    var n=set.of(st);
    return typeof n==='number' ? n : null;
  }
  function paintLines(st){
    var sets=listings(); if(!sets.length) return;
    var c=st&&st.cond;
    for(var q=0;q<sets.length;q++){
      var nodes=sets[q].nodes, idx=indexIn(sets[q],st);
      for(var k=0;k<nodes.length;k++){
        var on=(k===idx);
        nodes[k].classList.toggle('cur',on);
        nodes[k].classList.toggle('simtrue',  on && !!c && c.ok===true);
        nodes[k].classList.toggle('simfalse', on && !!c && c.ok===false);
      }
      /* looked up fresh every step: Focus moves the block, so the box a line
         scrolls inside is not the same box it was a moment ago. A listing that
         is not on screen (the hidden half of a tab pair) has no scroller. */
      if(idx!==null && nodes[idx] && nodes[idx].offsetParent!==null){
        var pane=scroller(nodes[idx]);
        if(pane) api.reveal(nodes[idx], pane);
      }
    }
  }
  /* TRUE or FALSE, beside the step number, in the shell's own words */
  function verdict(st){
    var c = st && st.cond;
    if(!verdEl){
      if(!c || !msgEl) return;
      verdEl=document.createElement('span');
      verdEl.className='smv';
      msgEl.parentNode.insertBefore(verdEl,msgEl);
    }
    verdEl.className = c ? ('smv on '+(c.ok?'tr':'fl')) : 'smv';
    if(c) verdEl.textContent = c.ok ? 'TRUE' : 'FALSE';
  }

  function railPaint(){
    if(!railEl||!steps) return;
    var groups=[], cur=null;
    for(var k=0;k<steps.length;k++){
      var g = cfg.group ? cfg.group(steps[k],k) : '';
      if(cur===null || g!==cur){ cur=g; groups.push({l:g,items:[]}); }
      groups[groups.length-1].items.push(k);
    }
    var h='';
    for(var q=0;q<groups.length;q++){
      h+='<div class="grp" data-l="'+groups[q].l+'" style="--f:'+groups[q].items.length+'">';
      for(var j=0;j<groups[q].items.length;j++){
        var n=groups[q].items[j], c='sg';
        if(n<i) c+=' done';
        if(n===i) c+=' now';
        else {
          /* a step that tested something colours its own segment */
          var t = cfg.tone ? cfg.tone(steps[n],n)
                : (steps[n].cond ? (steps[n].cond.ok?'tr':'fl') : null);
          if(t) c+=' '+t;
        }
        h+='<button class="'+c+'" type="button" data-i="'+n+'" '+
           'aria-label="Step '+(n+1)+(groups[q].l?', '+groups[q].l:'')+'"></button>';
      }
      h+='</div>';
    }
    railEl.innerHTML=h;
  }

  function paint(){
    if(steps){
      if(cfg.render) cfg.render(steps[i], i, api);
      paintLines(steps[i]);
      verdict(steps[i]);
      if(numEl) numEl.textContent=i+1;
      if(cntEl) cntEl.textContent=(i+1)+' / '+steps.length;
      if(bNext)  bNext.disabled  = i>=steps.length-1;
      if(bBack)  bBack.disabled  = i<=0;
      railPaint();
    } else {
      if(cfg.render) cfg.render(null, 0, api);
    }
  }

  function go(n){
    pause();
    if(!steps) return;
    n=Math.max(0,Math.min(steps.length-1,n));
    if(n===i) { paint(); return; }
    /* jumping backwards must not leave stale "changed" flags behind */
    if(n<i) lastWatch={};
    i=n; paint();
  }
  function next(){ pause(); if(steps && i<steps.length-1){ i++; paint(); } }
  function back(){ pause(); if(steps && i>0){ lastWatch={}; i--; paint(); } }
  function reset(){
    pause(); lastWatch={};
    if(steps){ i=0; paint(); }
    else if(cfg.onReset){ cfg.onReset(api); }
  }

  if(bNext)  bNext.addEventListener('click',next);
  if(bBack)  bBack.addEventListener('click',back);
  if(bReset) bReset.addEventListener('click',reset);
  if(bPlay){ bPlay.addEventListener('click',function(){ api.toggle(); }); playLabel(); }
  if(focusB) focusB.addEventListener('click',function(){ open(api); });
  if(railEl) railEl.addEventListener('click',function(e){
    var b=e.target.closest ? e.target.closest('.sg') : null;
    if(b) go(+b.getAttribute('data-i'));
  });

  REG.push(api);
  paint();
  return api;
}

/* ---------- n / b / r drive the simulator you are looking at --------------
   A lecture is run from the keyboard: the mouse is for pointing at the wall,
   not for hunting a Next button. The keys always mean the simulator in Focus,
   or failing that the one covering most of the view. `p` plays and pauses,
   but only where the simulator actually has a Play button.                */
function keyTarget(){
  if(openSim) return openSim;
  var H=window.innerHeight, mid=H/2, bestVis=0, bestD=1e9, target=null;
  for(var j=0;j<REG.length;j++){
    var r=REG[j].el.getBoundingClientRect();
    var vis=Math.min(r.bottom,H)-Math.max(r.top,0);
    if(vis<=0) continue;
    var d=Math.abs((r.top+r.bottom)/2-mid);
    /* most screen wins; a tie goes to the one nearer the middle */
    if(vis>bestVis+1 || (Math.abs(vis-bestVis)<=1 && d<bestD)){
      bestVis=vis; bestD=d; target=REG[j];
    }
  }
  return target;
}

/* ---------- say which block the keys are pointing at ----------------------
   Pressing n when you thought you were driving the other simulator is a
   confusing half-second in front of a class. The block the keys currently
   own carries a quiet ring, kept in step with the page as it scrolls. It
   uses keyTarget(), so the ring and the keys cannot disagree. */
var marked=null, markTick=null;
function mark(){
  markTick=null;
  var t=keyTarget();
  var el=(t && !openSim) ? t.el : null;
  if(el===marked) return;
  if(marked) marked.classList.remove('simon');
  marked=el;
  if(marked) marked.classList.add('simon');
}
function markSoon(){ if(!markTick) markTick=setTimeout(mark,120); }
window.addEventListener('scroll',markSoon,{passive:true});
window.addEventListener('resize',markSoon);

document.addEventListener('keydown',function(e){
  var t=document.activeElement;
  if(t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
  if(t && t.isContentEditable) return;
  if(e.metaKey||e.ctrlKey||e.altKey) return;
  var k=e.key.toLowerCase();
  if(k!=='n'&&k!=='b'&&k!=='r'&&k!=='p') return;

  var target=keyTarget();
  if(!target) return;
  /* p only belongs to a simulator that has a Play button; everywhere else it
     stays a free key for the page to use. */
  if(k==='p'){ if(!target.hasPlay()) return; target.toggle(); }
  else if(k==='n') target.next();
  else if(k==='b') target.back();
  else target.reset();
  e.preventDefault();
});

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mark);
else setTimeout(mark,0);

return { make:make, open:open, close:close, all:function(){ return REG.slice(); },
         keyTarget:keyTarget };
})();
