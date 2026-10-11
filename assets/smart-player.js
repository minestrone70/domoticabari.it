
(()=>{
const files=window.PAGE_FILM.files,names=window.PAGE_FILM.names,q=s=>document.querySelector(s),cards=[...document.querySelectorAll('.scene-card')],stage=q('.stage'),veil=q('#fade');
let frame=q('#film'),queued=null,queuedIndex=-1,queuedReady=false,index=0,ready=false,wantPlay=false,pendingTime=0,finished=false,loadTimer,sceneTime=0,scenePlaying=false,reportedAt=performance.now(),enterFade=false,waitingFade=false;
let playerVisible=true,autoPaused=false,browsedGallery=false,completionOffered=false,lastScrollY=window.scrollY;
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function canPlay(){return playerVisible&&!document.hidden}
function syncVisibility(){
 if(finished||!wantPlay){autoPaused=false;return}
 if(!canPlay()){
  if(!autoPaused){autoPaused=true;scenePlaying=false;ui(sceneTime,false);if(ready)command('pause')}
 }else if(autoPaused){autoPaused=false;reportedAt=performance.now();if(ready){scenePlaying=true;command('play');ui(sceneTime,true)}}
}
const viewObserver=new IntersectionObserver(entries=>{
 const entry=entries[0];if(!entry)return;
 if(entry.intersectionRatio<.3)playerVisible=false;
 else if(entry.intersectionRatio>=.55)playerVisible=true;
 syncVisibility();
},{threshold:[0,.3,.55,1]});
viewObserver.observe(stage);
document.addEventListener('visibilitychange',syncVisibility);
window.addEventListener('scroll',()=>{
 const y=window.scrollY;
 if(!finished&&y>lastScrollY+1&&stage.getBoundingClientRect().bottom<window.innerHeight*.3&&cards[0].getBoundingClientRect().top<window.innerHeight*.75)browsedGallery=true;
 lastScrollY=y;
},{passive:true});
async function offerDetails(){
 if(completionOffered||browsedGallery||!canPlay())return;
 completionOffered=true;
 if(document.fullscreenElement){try{await document.exitFullscreen()}catch{completionOffered=false;return}}
 const card=cards[0],more=card.querySelector('.scene-more');
 card.setAttribute('tabindex','-1');card.focus({preventScroll:true});
 more.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'center'});
 setTimeout(()=>{more.classList.remove('details-pulse');void more.offsetWidth;more.classList.add('details-pulse');setTimeout(()=>more.classList.remove('details-pulse'),5000)},reducedMotion?0:850);
}
function finishFilm(){finished=true;wantPlay=false;scenePlaying=false;ui(durations[index],false);offerDetails()}

const durations=window.PAGE_FILM.durations,offset=i=>durations.slice(0,i).reduce((a,b)=>a+b,0);
const fadeLength=.65,clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x)},stamp=x=>String(Math.floor(x/60)).padStart(2,'0')+':'+String(Math.floor(x%60)).padStart(2,'0');
function command(action,extra={},target=frame){target.contentWindow.postMessage({type:'film-control',action,...extra},'*')}
function ui(t,playing){q('#elapsed').textContent=stamp(offset(index)+t);q('#seek').value=offset(index)+t;q('#play').textContent=playing?'Ⅱ Pausa':finished?'▶ Rivedi':'▶ Riproduci';q('#play').setAttribute('aria-label',playing?'Metti in pausa il film':'Riproduci il film')}
function discardQueued(){if(queued)queued.remove();queued=null;queuedReady=false;queuedIndex=-1}
function preloadNext(){if(index>=files.length-1||queuedIndex===index+1)return;discardQueued();queuedIndex=index+1;queued=document.createElement('iframe');const warm=queued;warm.className='preloaded';warm.title='Scena successiva in preparazione';warm.setAttribute('aria-hidden','true');warm.setAttribute('tabindex','-1');warm.allow='fullscreen';warm.addEventListener('load',()=>{if(warm===queued)command('init',{},warm)});warm.src=files[queuedIndex]+'?embedded=1&v=smart-soggiorni-36';stage.append(warm)}
function onReady(){ready=true;waitingFade=false;clearTimeout(loadTimer);q('#loading').classList.add('hidden');reportedAt=performance.now();autoPaused=wantPlay&&!canPlay();command('seek',{time:pendingTime,playing:wantPlay&&!autoPaused});preloadNext()}
function select(i,play=false,time=0,transition=false){
 const next=Math.max(0,Math.min(files.length-1,i)),promote=queued&&queuedIndex===next&&queuedReady;
 index=next;ready=false;wantPlay=play;autoPaused=play&&!canPlay();pendingTime=time;finished=false;sceneTime=time;scenePlaying=false;reportedAt=performance.now();enterFade=transition;waitingFade=transition;
 veil.style.opacity=transition?'1':'0';q('#loading').classList.toggle('hidden',transition);q('#loadtext').textContent='Preparo la scena…';q('#direct').classList.add('hidden');q('#direct').href=files[index];stage.classList.toggle('credits',index===0||index===files.length-1);q('#current').innerHTML=index===0||index===files.length-1?'<strong>'+names[index]+'</strong>':'<strong>'+String(index).padStart(2,'0')+' / '+(files.length-2)+'</strong> · '+names[index];cards.forEach((c,k)=>c.setAttribute('aria-current',String(k+1===index)));ui(time,play);clearTimeout(loadTimer);
 if(promote){const previous=frame;frame=queued;queued=null;queuedIndex=-1;queuedReady=false;previous.remove();frame.id='film';frame.title=names[index];frame.classList.remove('preloaded');frame.removeAttribute('aria-hidden');frame.removeAttribute('tabindex');onReady()}
 else{discardQueued();frame.src=files[index]+'?embedded=1&v=smart-soggiorni-36'}
 if(!ready)loadTimer=setTimeout(()=>{if(!ready){q('#loading').classList.remove('hidden');q('#loadtext').textContent='La scena sta ancora caricando.';q('#direct').classList.remove('hidden')}},20000);
}
// The next iframe is loaded and paused before the current clip ends.
frame.addEventListener('load',()=>{if(!ready)command('init')});
window.addEventListener('message',e=>{
 if(!e.data||location.protocol!=='file:'&&e.origin!==location.origin)return;const d=e.data;
 if(queued&&e.source===queued.contentWindow){if(d.type==='film-ready')queuedReady=true;return}
 if(e.source!==frame.contentWindow)return;
 if(d.type==='film-ready'){if(!ready)onReady();return}if(!ready)return;
 if(d.type==='film-progress'){sceneTime=d.time;scenePlaying=!!d.playing&&wantPlay&&!autoPaused;reportedAt=performance.now();ui(d.time,scenePlaying);if(index===files.length-1&&d.time>=durations[index])finishFilm()}
 if(d.type==='film-ended'){if(wantPlay&&!autoPaused&&q('#auto').checked&&index<files.length-1)select(index+1,true,0,true);else{finished=index===files.length-1;wantPlay=false;scenePlaying=false;ui(durations[index],false);if(finished)finishFilm()}}
});
function paintFade(now){const t=Math.min(durations[index],sceneTime+(scenePlaying&&ready?(now-reportedAt)/1000:0));if(enterFade&&t>=fadeLength)enterFade=false;const incoming=enterFade?1-ease(t/fadeLength):0,outgoing=q('#auto').checked&&index<files.length-1?ease((t-(durations[index]-fadeLength))/fadeLength):0;veil.style.opacity=waitingFade?'1':Math.max(incoming,outgoing);requestAnimationFrame(paintFade)}
q('#play').onclick=()=>{if(finished){completionOffered=false;select(0,true,0,true);return}if(autoPaused){wantPlay=true;stage.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'center'});syncVisibility();return}wantPlay=!wantPlay;scenePlaying=wantPlay&&ready&&canPlay();reportedAt=performance.now();if(ready)command(scenePlaying?'play':'pause');else q('#play').textContent=wantPlay?'Ⅱ Pausa':'▶ Riproduci';syncVisibility()};
q('#all').onclick=()=>{q('#auto').checked=true;completionOffered=false;select(0,true,0,true);if(!playerVisible)stage.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'center'})};
q('#seek').oninput=()=>{autoPaused=false;const v=Number(q('#seek').value);let i=0;while(i<files.length-1&&v>=offset(i+1))i++;const t=v-offset(i);wantPlay=false;scenePlaying=false;enterFade=false;if(i!==index)select(i,false,t);else if(ready){sceneTime=t;command('seek',{time:t,playing:false});ui(t,false)}else pendingTime=t};
cards.forEach((c,i)=>c.querySelector('.scene-preview').onclick=()=>{select(i+1,true);if(!playerVisible)stage.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'center'})});
q('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await q('#player').requestFullscreen()}catch{q('#fullscreen').title='Schermo intero non disponibile in questo browser'}};
document.addEventListener('keydown',e=>{if(e.code==='Space'&&e.target===document.body){e.preventDefault();q('#play').click()}});

document.querySelectorAll('[data-detail]').forEach(button=>button.onclick=()=>{browsedGallery=true;const section=document.getElementById(button.dataset.detail);section.querySelector('h2').focus({preventScroll:true});section.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'start'});history.replaceState(null,'','#'+section.id)});
document.querySelectorAll('.details-nav a,.back-clips').forEach(link=>link.onclick=e=>{e.preventDefault();browsedGallery=true;const target=document.querySelector(link.getAttribute('href'));target.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'start'});history.replaceState(null,'',link.getAttribute('href'))});
document.querySelectorAll('[data-replay]').forEach(button=>button.onclick=()=>{cards[Number(button.dataset.replay)].querySelector('.scene-preview').click();stage.scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'center'});q('#play').focus({preventScroll:true})});

select(0,true,0,true);requestAnimationFrame(paintFade);
})();
