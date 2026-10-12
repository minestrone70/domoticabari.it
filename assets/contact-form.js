(()=>{
'use strict';
const form=document.getElementById('message-form');if(!form)return;
const response=document.getElementById('response'),submit=document.getElementById('submit-button'),topic=document.getElementById('argomento');
const idleLabel=submit.textContent;
form.addEventListener('submit',async event=>{
 event.preventDefault();if(submit.disabled||!form.reportValidity())return;
 const data=new FormData(form),read=key=>String(data.get(key)||'').trim();
 const pagina=location.pathname.split('/').pop()||'index.html',argomento=read('argomento');
 const payload={name:read('name'),email:read('email'),telefono:read('telefono'),message:`[DomoticaBari · ${document.title}]\nArgomento: ${argomento}\nPagina: ${pagina}\n\n${read('message')}`};
 if(!payload.name||!payload.email||!payload.telefono||!read('message')){response.textContent='Compila i campi richiesti con informazioni valide.';return;}
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
 submit.disabled=true;submit.textContent='Invio in corso…';form.setAttribute('aria-busy','true');response.textContent='';
 try{
  const result=await fetch('https://maledizione.duckdns.org/api/webhook/form_domoticabari',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
  if(!result.ok)throw new Error('http');
  response.textContent='Grazie! La tua richiesta è stata inviata.';form.reset();
 }catch(error){response.textContent=error.name==='AbortError'?'Il servizio sta impiegando troppo tempo. Riprova tra poco.':'Non è stato possibile inviare la richiesta. Riprova tra poco.';}
 finally{clearTimeout(timer);submit.disabled=false;submit.textContent=idleLabel;form.removeAttribute('aria-busy');}
});
})();
