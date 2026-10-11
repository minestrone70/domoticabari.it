(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const players=[...document.querySelectorAll('.topic-video')], states=new Map();
function send(s,action,extra={}){s.frame.contentWindow?.postMessage({type:'film-control',action,...extra},location.origin)}
function controls(s){s.button.textContent=s.playing?'Ⅱ Pausa':s.ended?'↺ Rivedi':'▶ Guarda';s.seek.value=s.time;s.status.textContent=s.ended?'Automazione completata.':s.playing?'Clip in riproduzione.':'Clip in pausa.'}
function pause(s){s.playing=false;if(s.ready)send(s,'pause');controls(s)}
function start(s){if(document.hidden)return;states.forEach(other=>{if(other!==s&&other.playing)pause(other)});s.manualPaused=false;s.playing=true;if(s.ended){s.time=0;s.ended=false}if(s.ready)send(s,'seek',{time:s.time,playing:true});else load(s);controls(s)}
function load(s){if(s.loaded)return;s.loaded=true;s.status.textContent='';s.frame.src=s.el.dataset.source+'?embedded=1&v=40'}
players.forEach(el=>{const s={el,frame:el.querySelector('iframe'),button:el.querySelector('.topic-play'),seek:el.querySelector('.topic-seek'),status:el.querySelector('.portrait-status'),caption:el.querySelector('.portrait-caption'),time:0,playing:false,ready:false,loaded:false,visible:false,manualPaused:false,ended:false};states.set(el,s);
 s.button.onclick=()=>{if(s.playing){s.manualPaused=true;pause(s)}else start(s)};
 s.seek.oninput=()=>{s.time=+s.seek.value;s.ended=s.time>=19;s.manualPaused=true;pause(s);if(s.ready)send(s,'seek',{time:s.time,playing:false});else load(s)};
});
addEventListener('message',e=>{if(e.origin!==location.origin)return;const s=[...states.values()].find(x=>x.frame.contentWindow===e.source);if(!s)return;const d=e.data;if(d?.type==='film-ready'){s.ready=true;s.el.classList.add('loaded');send(s,'seek',{time:s.time,playing:s.playing&&!document.hidden});}
 if(d?.type==='film-progress'){s.time=d.time;s.caption.textContent=d.caption||'';controls(s)}
 if(d?.type==='film-ended'){s.time=19;s.ended=true;pause(s)}
});
const observer=new IntersectionObserver(entries=>{for(const entry of entries){const s=states.get(entry.target),visible=entry.intersectionRatio>=.5;if(s.visible===visible)continue;s.visible=visible;if(visible){load(s);if(!reduced&&!s.manualPaused&&!s.ended&&!document.hidden)start(s)}else pause(s)}},{threshold:[0,.5,1]});players.forEach(p=>observer.observe(p));
document.addEventListener('visibilitychange',()=>{states.forEach(s=>{if(document.hidden)pause(s);else if(s.visible&&!s.manualPaused&&!s.ended&&!reduced)start(s)})});
document.querySelectorAll('.details-nav a').forEach(a=>a.onclick=e=>{const target=document.querySelector(a.getAttribute('href'));if(!target)return;e.preventDefault();target.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});history.replaceState(null,'',a.getAttribute('href'))});
})();
