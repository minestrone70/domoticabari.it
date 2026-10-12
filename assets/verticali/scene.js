(()=>{
'use strict';
const c=JSON.parse(document.getElementById('scene-config').textContent), scene=document.querySelector('.scene');
const embedded=parent!==window;document.documentElement.classList.toggle('embedded',embedded);
const el=(tag,cls,parent=scene)=>{const n=document.createElement(tag);n.className=cls;parent.append(n);return n};
const clamp=x=>Math.min(1,Math.max(0,x)), ease=x=>{x=clamp(x);return x*x*(3-2*x)}, ramp=(t,a,b)=>ease((t-a)/(b-a));
const base=el('img','plate'),after=c.after?el('img','plate after'):null;
base.src=(c.base||c.key)+'.webp';base.alt=c.title; if(after){after.src=c.after+'.webp';after.alt='';}
const fx=el('div','effects');
const top=el('div','hud');top.innerHTML='<div class="kicker"></div><strong></strong><small></small><div class="progress"><span></span></div>';
const caption=el('div','native-caption'),ownCaption=el('div','own-caption');
const watermark=el('img','own-watermark');watermark.src='../domoticabari-watermark.svg';watermark.alt='DomoticaBari.it';
const button=el('button','standalone-play');button.textContent='Ⅱ Pausa';button.type='button';
let time=0,playing=false,previous=0,raf=0,lastMessage=0,lastCaption='',ready=false;
let elementPlate,voice,scan,air,water,warmth,pin,map,netflix,shade,walker,shadow,shield,status,climate,doorReveal,lampReveal;
function absolute(n,box){n.style.left=box[0]+'%';n.style.top=box[1]+'%';n.style.width=box[2]+'%';n.style.height=box[3]+'%';return n}
function svg(markup,cls){const n=document.createElementNS('http://www.w3.org/2000/svg','svg');n.setAttribute('viewBox','0 0 100 100');n.setAttribute('preserveAspectRatio','none');n.innerHTML=markup;if(cls)n.classList.add(cls);fx.append(n);return n}
function bubbles(){voice=el('div','voice',fx);voice.innerHTML='<i></i><i></i><i></i>';voice.style.left=c.voice[0]+'%';voice.style.top=c.voice[1]+'%';}
if(c.voice)bubbles();
if(['about','voiceclima','welcome','absence','checkout'].includes(c.kind))top.classList.add('compact');
if(c.kind==='shutter'){top.classList.add('compact');if(c.key==='accessibile-1')shade=el('div','room-shade');}
if(c.kind==='shutter'||c.kind==='door'){
 elementPlate=el('img','element-plate');elementPlate.src=base.src;elementPlate.alt='';
 if(c.kind==='door'){elementPlate.style.clipPath='polygon('+c.door.map(p=>p.join('% ')+'%').join(',')+')';elementPlate.style.transformOrigin=(c.hinge?.[0]??c.door[1][0])+'% '+(c.hinge?.[1]??40)+'%';scene.style.perspective='900px';after.style.opacity=0;}
}
if(c.face){scan=absolute(el('div','scan',fx),c.face);}
if(c.air){const [x,y]=c.air;air=svg([0,3,6].map((d,i)=>`<path class="airline" d="M ${x+d} ${y-d*.1} C ${x+d-3} ${y+8},${x+d+7} ${y+13},${x+d+4} ${y+23}"/>`).join(''));}
if(c.kind==='garden'){
 const sprays=[[30,72,27,63,19,65],[30,72,30,61,26,60],[30,72,33,62,35,61],[30,72,36,65,42,67],[86,65,82,56,75,57],[86,65,87,54,82,52],[86,65,91,55,94,58],[86,65,94,60,100,63]];
 water=svg(sprays.map(([x,y,cx,cy,tx,ty])=>`<path class="waterline" d="M ${x} ${y} Q ${cx} ${cy} ${tx} ${ty}"/>`).join(''),'sprinkler-spray');
}
if(c.kind==='door'&&c.key==='casa-6'){warmth=absolute(el('div','warmth',fx),[60,19,30,60]);}
if(c.kind==='phone'){pin=absolute(el('div','pinpoint',fx),[77,54,14,9]);}
if(c.kind==='tablet'){pin=absolute(el('div','pinpoint',fx),[81,32,6,4]);}
if(c.kind==='film'){netflix=svg('<path d="M37.5 26.5h1.05v4h-1.05zM40.1 26.5h1.05v4H40.1z" fill="#ad1020"/><path d="M37.5 26.5h1.05l2.6 4H40.1z"/>','netflix');}
if(c.kind==='geoclima'){
 const room=el('img','plate room');room.src='clima-senza-termostato-v39.webp';room.alt='';room.style.display='none';
 const roomAfter=el('img','plate after room-after');roomAfter.src='clima-attivo-senza-termostato-v39.webp';roomAfter.alt='';roomAfter.style.display='none';
 c.room=room;c.roomAfter=roomAfter;
 air=svg([0,3.5,7].map((d,i)=>`<path class="airline" d="M ${69+d} ${23+d*.18} C ${64+d} ${22+d*.18},${59+d} ${25+d*.18},${54+d} ${24+d*.18} S ${45+d} ${22+d*.18},${40+d} ${24+d*.18}" style="opacity:${.26-i*.045}"/>`).join(''));

 map=el('div','map');map.innerHTML='<div class="map-title">Rientro rilevato</div><div class="map-sub">Avvio prima dell’arrivo.</div><svg viewBox="0 0 100 177.78"><rect width="100" height="178" fill="#e9ead9"/><g fill="#d6dcc4"><rect x="7" y="41" width="20" height="30" rx="3"/><rect x="38" y="26" width="18" height="26" rx="3"/><rect x="65" y="53" width="27" height="33" rx="3"/><rect x="12" y="96" width="20" height="36" rx="3"/><rect x="48" y="91" width="39" height="32" rx="3"/></g><path d="M-10 87Q48 67 108 104M35 0L43 178" fill="none" stroke="#faf9ed" stroke-width="6"/><path d="M17 125Q29 103 40 87T76 60" fill="none" stroke="#afbd9e" stroke-width="2" stroke-dasharray="2 2"/><path d="M17 125Q29 103 40 87T76 60" class="route" fill="none" stroke="#44765b" stroke-width="2" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/><g transform="translate(76 60)"><path d="M-5 0V-7L0-11L5-7V0Z" fill="#315c45"/><rect x="-1" y="-5" width="2" height="5" fill="#e9ead9"/></g><g class="map-marker"><circle r="6" fill="#44765b22"/><circle r="3" fill="#44765b" stroke="#fff" stroke-width="1"/></g></svg><div class="arrival"><b>Rientro rilevato</b><br>Posizione rilevata a metà percorso.<br>Azione: impostazione clima a 23 °C.</div>';
 map.querySelector('svg').style.zIndex='-1';
 // The map has its own fixed UI layer; artwork never pans or zooms.
 map.style.isolation='isolate';
}
if(c.walk){
 shadow=el('div','walk-shadow');walker=el('div','walk-sprite');walker.style.backgroundImage='url('+c.walk+'.webp)';if(c.walkFrames)walker.style.backgroundSize=(c.walkFrames*100)+'% 100%';
 elementPlate=el('img','element-plate walking-door');elementPlate.src=c.closed+'.webp';elementPlate.alt='';
 elementPlate.style.clipPath='polygon('+c.door.map(p=>p.join('% ')+'%').join(',')+')';
 elementPlate.style.transformOrigin=c.door[1][0]+'% 40%';scene.style.perspective='900px';
 if(c.kind==='arrival'){
  scan=el('div','scan',fx);after.style.opacity=0;
  doorReveal=el('img','door-reveal');doorReveal.src=c.open+'.webp';doorReveal.alt='';doorReveal.style.zIndex='1';
  lampReveal=el('img','lamp-reveal');lampReveal.src=c.lamp+'.webp';lampReveal.alt='';lampReveal.style.clipPath='polygon(66% 55%,79% 55%,79% 81%,66% 81%)';
 }
 if(c.kind==='security'){
  shield=svg('<path d="M65 50L73 52V55Q72 59 65 61Q58 59 57 55V52Z" fill="#173d2cd9" stroke="#dcecd0" stroke-width=".5"/><path d="M61 55l3 2 5-4" fill="none" stroke="#dcecd0" stroke-width=".8"/>','security-shield');
  status=el('div','security-status',fx);status.innerHTML='<div><span>Presenza</span><b>Nessuno in casa</b></div><div><span>Antifurto</span><b>Armato</b></div>';
 }
}
if(c.climate){climate=absolute(el('div','climate-setting',fx),c.climate.box);climate.innerHTML='<span>Temperatura impostata</span><strong></strong><small></small>';}
function walkFrame(t,points,start,end){
 const q=clamp((t-start)/(end-start)),v=q*(points.length-1),a=Math.min(points.length-2,Math.floor(v)),f=v-a;
 const pos=points[a].map((x,i)=>x+(points[a+1][i]-x)*f),h=pos[2],w=h*.75*16/9;
 walker.style.left=(pos[0]-w*.5)+'%';walker.style.top=(pos[1]-h*.965)+'%';walker.style.width=w+'%';walker.style.height=h+'%';
 const gait=c.walkFrames===2?[0,1]:[0,2,1,3,4,6,5,7];const cadence=c.walkFrames===2?2:6;const frame=t>start&&t<end?gait[Math.floor((t-start)*cadence)%gait.length]:0;
 const columns=c.walkFrames||4;walker.style.backgroundPosition=(columns===1?0:(frame%columns)*100/(columns-1))+'% '+(columns===2?0:Math.floor(frame/columns)*100)+'%';
 shadow.style.left=(pos[0]-w*.33)+'%';shadow.style.top=(pos[1]-.7)+'%';shadow.style.width=(w*.66)+'%';shadow.style.height=(h*.035)+'%';
 return {x:pos[0]-w*.5,y:pos[1]-h*.965,w,h};
}
if(c.kind==='night'){
 c.outside=el('img','plate outside');c.outside.src='casa-8-esterno.webp';c.outside.alt='';c.outside.style.display='none';
 c.outsideAfter=el('img','plate after outside-after');c.outsideAfter.src='casa-8-esterno-spento.webp';c.outsideAfter.alt='';c.outsideAfter.style.display='none';
}
if(c.kind==='about'){c.industry=el('img','plate');c.industry.src='chi-siamo-industria.webp';c.industry.alt='';c.home=el('img','plate');c.home.src='chi-siamo-home-assistant.webp';c.home.alt='';}
function hud(kicker,title,detail,opacity=1,progress=null){top.querySelector('.kicker').textContent=kicker;top.querySelector('strong').textContent=title;top.querySelector('small').textContent=detail;top.style.opacity=opacity;top.querySelector('.progress').style.display=progress===null?'none':'block';if(progress!==null)top.querySelector('.progress span').style.transform='scaleX('+progress+')';}
function speech(t){return c.captions.reduce((txt,[start,value])=>t>=start?value:txt,'');}
function render(){
 const t=Math.min(time,15);let p=0;
 if(after){p=ramp(t,c.change?.[0]??5,c.change?.[1]??8);after.style.opacity=p;}
 if(voice){const on=t>=1.5&&t<5.2;voice.style.opacity=on?ramp(t,1.5,2):0;[...voice.children].forEach((n,i)=>n.style.opacity=.3+.7*(.5+.5*Math.sin((t*5-i)*2)));}
 if(scan){scan.style.opacity=t>=2&&t<5.8?1:0;scan.style.setProperty('--scan',((t*25)%100)+'%');}
 if(air){air.style.opacity=ramp(t,c.airStart??7,c.airStart?c.airStart+1:8);air.querySelectorAll('path').forEach((n,i)=>n.style.strokeDashoffset=-t*8-i*3);}
 switch(c.kind){
 case 'shutter':{
   p=ramp(t,2.5,10);after.style.opacity=p;if(shade)shade.style.opacity=.38*(1-p);
   const q=c.window;const bottomLeft=q[0][1]+(q[3][1]-q[0][1])*(1-p),bottomRight=q[1][1]+(q[2][1]-q[1][1])*(1-p);
   elementPlate.style.clipPath=`polygon(${q[0][0]}% ${q[0][1]}%,${q[1][0]}% ${q[1][1]}%,${q[2][0]}% ${bottomRight}%,${q[3][0]}% ${bottomLeft}%)`;elementPlate.style.opacity=p>=1?0:1;
   hud(c.key==='casa-1'?'07:00 · Buongiorno':'Comando vocale',p<1?'Tapparella '+Math.round(p*100)+'%':'Tapparella aperta','La luce naturale entra gradualmente.',ramp(t,.4,1),p);break;}
 case 'door':{
   after.style.opacity=ramp(t,6,7.5);p=ramp(t,8,10);
   elementPlate.style.transform='rotateY('+((c.swing??-80)*p)+'deg)';elementPlate.style.opacity=1;
   if(warmth)warmth.style.opacity=ramp(t,10,12)*.6;
   hud('Accesso autorizzato',t<5.8?(c.face?'Verifica del volto':'Comando di apertura'):t<9?'Apertura in corso':c.key==='casa-6'?'Benvenuti. Luci accese.':'Porta aperta',t<5.8?(c.face?'Identità verificata dal lettore.':'Richiesta ricevuta dalla pagina ospite.'):c.key==='accessibile-3'?'Serratura sbloccata. Ingresso aperto.':'Apertura completata.',ramp(t,1,2));break;}
 case 'garden':{
   p=ramp(t,6,7);water.style.opacity=p;water.querySelectorAll('path').forEach((n,i)=>{n.style.strokeDashoffset=-t*3-i*2;n.style.opacity=(.42+.1*Math.sin(t*2+i))*(t>=6?1:0)});
   hud('Giardino · Previsioni meteo',t<5?'Sole previsto, terreno asciutto':'Irrigazione in corso','Durata adattata alle previsioni: 8 minuti.',ramp(t,1,2),ramp(t,5,12));break;}
 case 'security':{
 if(walker){walkFrame(t,[[65,67,32],[54,78,40],[28,96,54],[-55,118,66]],.8,8.7);walker.style.opacity=t<8.7?1:0;shadow.style.opacity=t<8.7?.35:0;const close=ramp(t,3.2,5.2);elementPlate.style.transform='rotateY('+(-80*(1-close))+'deg)';elementPlate.style.opacity=ramp(t,3.2,3.5);shield.style.opacity=ramp(t,11,12);status.style.opacity=ramp(t,11,12);}
 hud('Scenario uscita','Verifica delle condizioni','',ramp(t,.5,1));break;}
 case 'arrival':{
 const atDoor=t>=5,inside=t>=10.8;
 const pos=walkFrame(t,[[-30,108,66],[20,91,59],[37,79,50]],.5,6);
 walker.style.opacity=1;walker.style.clipPath='none';shadow.style.opacity=.28;
 // The visitors stop on the path. Only the doorway aperture crossfades to the open view.
 const reveal=ramp(t,7.2,8),open=ramp(t,8,10);doorReveal.style.opacity=reveal;elementPlate.style.transform='rotateY('+((c.swing??-80)*open)+'deg)';elementPlate.style.opacity=1;
 lampReveal.style.opacity=ramp(t,11.5,12.4);
 after.style.opacity=0;
 absolute(scan,[pos.x+pos.w*.65,pos.y+pos.h*.08,pos.w*.14,pos.h*.12]);scan.style.opacity=t>=5.2&&t<7.8?1:0;scan.style.setProperty('--scan',((t*24)%100)+'%');
 hud('Scenario rientro','Accesso autorizzato','',ramp(t,.5,1));break;}

 case 'twilight':hud('Orario del crepuscolo',t<5?'19:42 · Tra poco farà buio':'Luci del giardino accese','La casa conosce l’ora del crepuscolo.',ramp(t,1,2));break;
 case 'film':netflix.style.opacity=ramp(t,4,5);hud('Scenario cinema',t<6?'Un film insieme':'Luci al 18%','Il televisore accende il comfort giusto.',ramp(t,1,2));break;
 case 'geoclima':{
   const interior=t>=9,travel=t<4.5,mapShot=!travel&&!interior;
   base.style.display=travel?'block':'none';c.room.style.display=interior?'block':'none';c.roomAfter.style.display=interior?'block':'none';c.roomAfter.style.opacity=ramp(t,10,11.5);map.style.display=mapShot?'block':'none';
   // Marker covers exactly HALF the itinerary, never reaches the house.
   const q=clamp((t-4.8)/3.4)*.5,path=map.querySelector('.route'),point=path.getPointAtLength(path.getTotalLength()*q);
   map.querySelector('.map-marker').setAttribute('transform',`translate(${point.x} ${point.y})`);path.style.strokeDashoffset=100-q*100;
   air.style.opacity=interior?ramp(t,10.8,11.8):0;
   hud('Comfort prima del rientro',interior?'Climatizzatore acceso':'Stiamo tornando a casa.',interior?'Temperatura impostata a 23 °C.':'La casa vi aspetta.',travel||interior?ramp(t,.5,1):0);break;}
 case 'night':{
   const out=t>=7;base.style.display=out?'none':'block';after.style.display=out?'none':'block';c.outside.style.display=out?'block':'none';c.outsideAfter.style.display=out?'block':'none';c.outsideAfter.style.opacity=ramp(t,9,12);
   hud('Buonanotte',t<7?'Gli occhi si chiudono':t<12?'La casa va a riposo':'Luci interne spente','Le luci restano ai livelli configurati.',ramp(t,1,2));break;}
 case 'booking':hud('Il viaggio comincia',t<4?'Una camera a Bari':t<8?'Prenotazione inviata':'Prenotazione confermata','Due ospiti · Emma e Lukas',ramp(t,1,2),ramp(t,4,8));break;
 case 'concierge':{
   top.style.top=t<7?'3%':'44%';hud(t<7?'BNBReady · Host':'Pagina ospite',t<7?'Nuova prenotazione':'Il vostro web concierge',t<7?'Emma e Lukas · 2 ospiti':'Indicazioni, informazioni e apertura porta.',ramp(t,1,2));break;}
 case 'documents':{
   const names=['Nome e cognome: Emma Lind','Documento: ••••••342','Nome e cognome: Lukas Berg','Documento: ••••••857'];
   const count=Math.max(0,Math.min(4,Math.floor((t-2)/2)+1));hud('Check-in da casa',t<11?'I vostri dati, prima di partire':'Dati inviati a BNBReady',t<11?names.slice(0,count).join(' · '):'Tutto pronto per il vostro arrivo.',ramp(t,.5,1),ramp(t,2,11));break;}
 case 'welcome':hud('Benvenuti',t<5?'La camera vi aspetta':t<8?'Luci accese':'Climatizzatore acceso','Il soggiorno comincia con il giusto comfort.',ramp(t,1,2));break;
 case 'absence':{
   // A cut to the vacated room avoids sliding or floating walking sprites.
   after.style.opacity=t>=6?1:0;if(air)air.style.opacity=t<6?1:0;
   hud('Una passeggiata in città',t<6?'Usciamo, lasciamo tutto qui':t<10?'La camera è vuota':'Climatizzatore spento',t<6?'Le valigie restano in camera.':'La casa interrompe i consumi non necessari.',ramp(t,1,2));break;}
 case 'reminder':hud('BNBReady · Un promemoria gentile','Domani si riparte','Ricordati di lasciare l’importo della tassa di soggiorno sul comodino.',ramp(t,2,3));break;
 case 'checkout':hud('Checkout',t<6?'Grazie dell’ospitalità!':'Tassa lasciata sul comodino','Pronti per il viaggio di ritorno.',ramp(t,1,2));break;
 case 'cleaning':hud('BNBReady · Pulizie di oggi','La giornata è organizzata','09:30 · Camera 1     11:00 · Camera 2',ramp(t,3,4));break;
 case 'voiceclima':hud('Comando vocale',t<6?'Imposta il clima a 23 gradi':'Climatizzatore a 23 °C','Le alette si aprono e l’aria comincia a uscire.',ramp(t,.5,1));break;
 case 'tablet':{
   pin.style.opacity=t>=4&&t<6?.6:0;pin.style.transform='scale('+(1+.12*Math.sin(t*8))+')';
   hud('Pannello di controllo',t<5?'Comando selezionato':'Luci spente','Tocco sull’icona luce · comando eseguito.',ramp(t,1,2));break;}
 case 'phone':{
   pin.style.opacity=t<4?.6+.2*Math.sin(t*4):0;
   hud('Una voce per chiedere aiuto',t<4?'Il telefono è sotto il mobile':t<9?'Chiama il mio contatto di aiuto':'Contatto collegato',t<4?'Nessun problema: posso usare la voce.':'Una chiamata al contatto scelto.',ramp(t,.2,.8));break;}
 case 'about':{base.style.display=t<3?'block':'none';c.industry.style.display=t>=3&&t<9?'block':'none';c.home.style.display=t>=9?'block':'none';hud(t<9?'Le mie origini':'Oggi · DomoticaBari',t<3?'Dai robot alla tua casa':t<9?'Automazione industriale':'Home Assistant',t<9?'Programmare, coordinare, rendere semplice.':'Logiche costruite intorno alle tue abitudini.',t<3?0:ramp(t,3,3.5));break;}
 case 'sleep':hud('Scenario notte',t<6?'Riposo avviato':'Illuminazione disattivata','Sensore corridoio: nessuna presenza · luci spente.',ramp(t,1,2));break;
 }
 if(c.climate){const cfg=c.climate,on=c.kind==='geoclima'?t>=9:true;climate.style.opacity=on?ramp(t,cfg.start-.5,cfg.start):0;const q=ramp(t,cfg.start,cfg.end),value=cfg.from+(cfg.to-cfg.from)*q;climate.querySelector('strong').textContent=Math.round(value)+' °C';climate.querySelector('small').textContent=q<1?'Aggiornamento impostazione…':'Climatizzazione attiva';}
 if(c.huds){const state=c.huds.reduce((value,row)=>t>=row[0]?row:value,c.huds[0]);const opacity=c.kind==='geoclima'&&t>=4.5&&t<9?0:ramp(t,.3,.8);hud(state[1],state[2].replace('{percent}',Math.round(p*100)),state[3],opacity,c.kind==='shutter'?p:null);}
 lastCaption=speech(t);caption.textContent=lastCaption;ownCaption.textContent=lastCaption;
 button.textContent=playing?'Ⅱ Pausa':time>=19?'↺ Rivedi':'▶ Guarda';
}
function post(type){if(embedded)parent.postMessage({type,time,playing,caption:lastCaption},location.origin);}
function stop(){playing=false;cancelAnimationFrame(raf);raf=0;render();post('film-progress');}
function tick(now){if(!playing)return;const delta=previous?(now-previous)/1000:0;previous=now;time=Math.min(19,time+delta);render();if(now-lastMessage>100){post('film-progress');lastMessage=now;}if(time>=19){stop();post('film-ended');return;}raf=requestAnimationFrame(tick);}
function play(){if(!ready)return;if(time>=19)time=0;if(playing)return;playing=true;previous=0;render();raf=requestAnimationFrame(tick);}
addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||!ready)return;const d=e.data;if(d?.type!=='film-control')return;if(d.action==='pause')stop();else if(d.action==='play')play();else if(d.action==='restart'){time=0;play()}else if(d.action==='seek'){stop();time=Math.max(0,Math.min(19,+d.time||0));render();post('film-progress');if(d.playing)play()}else if(d.action==='init')post('film-ready');});
button.onclick=()=>playing?stop():play();
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
const assets=[...scene.querySelectorAll('img')];if(c.walk){const sprite=new Image();sprite.src=c.walk+'.webp';assets.push(sprite);}if(c.open){const open=new Image();open.src=c.open+'.webp';assets.push(open);}Promise.all(assets.map(img=>img.decode().catch(()=>{}))).then(()=>{ready=true;render();post('film-ready');if(!embedded&&!matchMedia('(prefers-reduced-motion: reduce)').matches)play();});
})();
