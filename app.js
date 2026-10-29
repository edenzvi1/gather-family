const $ = s => document.querySelector(s);
const KEY = 'gather-family-v1';
const money = (cents, currency) => new Intl.NumberFormat('he-IL', {style:'currency',currency,maximumFractionDigits:2}).format(cents/100);
const escapeHTML = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = () => crypto.randomUUID();
const seeds = () => [
 {id:uid(),name:'ארוחת שישי ביחד',date:'2026-11-06',currency:'ILS',budget:120000,members:['אני','מאיה','דניאל','נועה'],expenses:[{id:uid(),description:'קניות מהשוק',amount:28500,payer:'מאיה',category:'אוכל ושתייה'},{id:uid(),description:'משהו מתוק',amount:9500,payer:'אני',category:'אוכל ושתייה'}],icon:'🍋'},
 {id:uid(),name:'יום הולדת בלתי נשכח',date:'2026-11-15',currency:'ILS',budget:250000,members:['אני','מאיה','דניאל'],expenses:[{id:uid(),description:'עוגת יום הולדת',amount:32000,payer:'דניאל',category:'אוכל ושתייה'},{id:uid(),description:'קישוטים למסיבה',amount:18000,payer:'אני',category:'קישוטים'}],icon:'🎂'},
 {id:uid(),name:'סוף שבוע משפחתי',date:'2026-12-04',currency:'ILS',budget:480000,members:['אני','מאיה','דניאל','נועה','בן'],expenses:[{id:uid(),description:'הזמנת צימר',amount:180000,payer:'מאיה',category:'מקום האירוע'}],icon:'🌿'}
];
let events;
try { const raw=localStorage.getItem(KEY); events=raw?JSON.parse(raw):seeds(); if(!Array.isArray(events)) throw Error(); } catch { events=seeds(); }
let selected=null;
function toast(message){$('#toast').textContent=message;$('#toast').style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').style.display='none',3500);}
function save(){try{localStorage.setItem(KEY,JSON.stringify(events));}catch{toast('השמירה בדפדפן אינה זמינה. כדאי לייצא גיבוי לפני היציאה.');}render();}
const spent = event => event.expenses.reduce((n,e)=>n+e.amount,0);
function totals(field){const groups={};events.forEach(e=>groups[e.currency]=(groups[e.currency]||0)+(field==='budget'?e.budget:spent(e)));return Object.entries(groups).map(([c,n])=>money(n,c)).join(' + ')||'—';}
function render(){
 $('#total-budget').textContent=totals('budget');$('#total-spent').textContent=totals('spent');$('#event-count').textContent=String(events.length).padStart(2,'0');$('#count-pill').textContent=events.length;
 const query=$('#search').value.trim().toLowerCase();
 $('#events').innerHTML=events.filter(e=>e.name.toLowerCase().includes(query)).map((e,i)=>{
 const total=spent(e);const percent=e.budget?Math.min(100,total/e.budget*100):total?100:0;
 return `<article class="event-card"><div class="card-art art-${i%3}"><span class="status">${total>e.budget?'חריגה מהתקציב':'מתכננים ביחד'}</span><span class="art-icon" aria-hidden="true">${e.icon||'🌿'}</span></div><div class="card-content"><div class="card-date">${escapeHTML(new Date(e.date+'T12:00:00').toLocaleDateString('he-IL',{month:'short',day:'numeric',year:'numeric'}))}</div><h3>${escapeHTML(e.name)}</h3><div class="members">${e.members.slice(0,4).map(m=>`<span class="avatar" title="${escapeHTML(m)}">${escapeHTML(m[0].toUpperCase())}</span>`).join('')}<small>${e.members.length} בני משפחה</small></div><div class="budget-line"><strong>${money(total,e.currency)} הוצאות</strong><span>מתוך ${money(e.budget,e.currency)}</span></div><div class="progress ${total>e.budget?'over':''}" role="meter" aria-label="ניצול התקציב" aria-valuenow="${Math.round(percent)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${percent}%"></span></div><div class="card-bottom"><span>${e.expenses.length} הוצאות</span><button class="open-event" data-open="${e.id}">פרטי האירוע ↖</button></div></div></article>`;
 }).join('')||'<div class="empty">אין עדיין אירועים. צרו אירוע כדי להתחיל.</div>';
 if(selected)renderDetail();
}
function settlement(event){
 const total=spent(event),base=Math.floor(total/event.members.length),remainder=total%event.members.length;
 const balances=event.members.map((name,i)=>({name,balance:event.expenses.filter(e=>e.payer===name).reduce((n,e)=>n+e.amount,0)-base-(i<remainder?1:0)}));
 const debtors=balances.filter(b=>b.balance<0).map(b=>({...b})),creditors=balances.filter(b=>b.balance>0).map(b=>({...b}));const transfers=[];
 for(const d of debtors)for(const c of creditors){const amount=Math.min(-d.balance,c.balance);if(amount>0){transfers.push({from:d.name,to:c.name,amount});d.balance+=amount;c.balance-=amount;}}
 return {balances,transfers};
}
function renderDetail(){
 const e=events.find(e=>e.id===selected);if(!e){showOverview();return;}const {balances,transfers}=settlement(e);
 $('#detail').innerHTML=`<div class="detail-header"><div><button class="open-event" id="back">כל האירועים →</button><h2>${escapeHTML(e.name)}</h2><p class="detail-budget">${money(spent(e),e.currency)} הוצאות · ${money(e.budget,e.currency)} תקציב<br>${escapeHTML(e.date)} · חלוקה שווה בין ${e.members.length} משתתפים</p></div><button class="button primary" id="add-expense">＋ הוספת הוצאה</button></div><div class="detail-layout"><section class="panel"><h3>כל ההוצאות</h3>${e.expenses.map(x=>`<div class="expense-row"><div>${escapeHTML(x.description)}<small>${escapeHTML(x.payer)} שילם/ה · ${escapeHTML(x.category)}</small></div><div class="expense-amount">${money(x.amount,e.currency)}<button class="delete-expense" data-delete="${x.id}" aria-label="מחיקת ${escapeHTML(x.description)}">×</button></div></div>`).join('')||'<p class="empty">מתחילים מחדש. הוסיפו את ההוצאה הראשונה.</p>'}</section><section class="panel"><h3>החלק של כל אחד</h3>${balances.map(b=>`<div class="balance-row"><span>${escapeHTML(b.name)}</span><span>${b.balance>0?'יקבל/תקבל':b.balance<0?'חייב/ת':'מאוזן'} ${b.balance?money(Math.abs(b.balance),e.currency):'✓'}</span></div>`).join('')}<h3 style="margin-top:25px">הצעות להחזר</h3>${transfers.map(t=>`<p class="settlement"><bdi>${escapeHTML(t.from)}</bdi> משלם/ת ל־<bdi>${escapeHTML(t.to)}</bdi> <strong>${money(t.amount,e.currency)}</strong></p>`).join('')||'<p class="form-note">הכול מאוזן. נהדר.</p>'}<p class="form-note">אלו הצעות בלבד. התשלומים מתבצעים מחוץ לאפליקציה.</p></section></div><button class="button danger" id="delete-event">מחיקת האירוע</button>`;
 $('#back').onclick=showOverview;$('#add-expense').onclick=()=>{$('#expense-form').reset();$('#expense-form [name=payer]').innerHTML=e.members.map(m=>`<option>${escapeHTML(m)}</option>`).join('');$('#expense-dialog').showModal();};
 $('#delete-event').onclick=()=>{if(confirm(`למחוק את האירוע ״${e.name}״ ואת כל ההוצאות שלו?`)){events=events.filter(x=>x.id!==e.id);selected=null;showOverview();save();toast('האירוע נמחק');}};
 $('#detail').querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{if(confirm('למחוק את ההוצאה?')){e.expenses=e.expenses.filter(x=>x.id!==b.dataset.delete);save();toast('ההוצאה נמחקה');}});
}
function showOverview(){selected=null;$('#detail').hidden=true;$('#events').parentElement.hidden=false;$('.page-heading').hidden=false;}
$('#events').onclick=e=>{const button=e.target.closest('[data-open]');if(!button)return;selected=button.dataset.open;$('#events').parentElement.hidden=true;$('.page-heading').hidden=true;$('#detail').hidden=false;renderDetail();$('#detail').scrollIntoView({block:'start'});};
$('#overview').onclick=showOverview;$('#search').oninput=render;
$('#new-event').onclick=()=>{$('#event-form').reset();$('#event-form [name=date]').value=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);$('#event-dialog').showModal();};
document.querySelectorAll('.close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
$('#event-form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const members=[...new Set(f.get('members').split(',').map(s=>s.trim()).filter(Boolean))];const name=f.get('name').trim();if(!members.length||!name){toast('יש להזין שם אירוע ולפחות משתתף אחד.');return;}events.push({id:uid(),name,date:f.get('date'),currency:f.get('currency'),budget:Math.round(Number(f.get('budget'))*100),members,expenses:[],icon:['🍋','🎂','🌿'][events.length%3]});$('#event-dialog').close();save();toast('האירוע שלכם מוכן');};
$('#expense-form').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target),event=events.find(x=>x.id===selected),description=f.get('description').trim(),amount=Math.round(Number(f.get('amount'))*100);if(!event||!description||amount<1)return;event.expenses.push({id:uid(),description,amount,payer:f.get('payer'),category:f.get('category')});$('#expense-dialog').close();save();toast('ההוצאה נשמרה והחלוקה עודכנה.');};
$('#export').onclick=()=>{const blob=new Blob([JSON.stringify({app:'Gather',version:1,exportedAt:new Date().toISOString(),events},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='gather-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('הגיבוי יוצא בהצלחה');};
render();

