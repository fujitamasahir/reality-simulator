export const MAX_TURNS=4;
export function newSession(world){return {worldId:world.id,turn:0,skills:Object.fromEntries(world.skills.map(k=>[k,{good:0,total:0}])),history:[],seen:[],current:null,answer:null,opened:[],started:Date.now()};}
export function mastery(stat){return Math.round(100*(1+stat.good)/(2+stat.total));}
export function chooseMission(world,s){
 const unseen=world.missions.filter(m=>!s.seen.includes(m.id));
 if(!unseen.length)return null;
 if(!s.history.length)return unseen[0];
 const skillOrder=world.skills.slice().sort((a,b)=>mastery(s.skills[a])-mastery(s.skills[b])||s.skills[a].total-s.skills[b].total);
 const target=skillOrder.find(k=>unseen.some(m=>m.skill===k));
 const candidates=unseen.filter(m=>m.skill===target);
 const preferred=(s.skills[target]?.total||0)>0&&mastery(s.skills[target])<50?'guided':'challenge';
 return candidates.find(m=>m.level===preferred)||candidates[0]||unseen[0];
}
export function begin(world,s){const m=chooseMission(world,s);return {...s,current:m?.id||null,answer:null,opened:[]};}
export function record(world,s,choiceIndex){
 if(s.answer!==null||!s.current)return s;
 const m=world.missions.find(x=>x.id===s.current), c=m?.choices[choiceIndex];
 if(!c)return s;
 const stat=s.skills[m.skill];
 return {...s,skills:{...s.skills,[m.skill]:{good:stat.good+c.score,total:stat.total+1}},seen:[...s.seen,m.id],answer:choiceIndex,history:[...s.history,{id:m.id,title:m.title,skill:m.skill,score:c.score,choice:c.text,feedback:c.feedback,evidence:s.opened.length}]};
}
export function advance(world,s){if(s.answer===null)return s;const next={...s,turn:s.turn+1,current:null,answer:null,opened:[]};return next.turn>=Math.min(MAX_TURNS,world.missions.length)?next:begin(world,next);}
export function summary(s){return {decisions:s.history.length,score:s.history.length?Math.round(100*s.history.reduce((a,b)=>a+b.score,0)/s.history.length):0,minutes:Math.max(1,Math.round((Date.now()-s.started)/60000))};}
export function escapeText(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function buildWorld(name,text){
 const cleaned=text.replace(/\r/g,'').replace(/[^\S\n]+/g,' ').trim();
 if(cleaned.length<160)throw Error('Please provide at least 160 characters of readable learning material.');
 const chunks=cleaned.split(/\n\s*\n|(?<=[.!?。！？])\s+/u).map(x=>x.trim()).filter(x=>x.length>=35);
 const passages=[];for(const c of chunks){for(let i=0;i<c.length;i+=700)if(c.slice(i,i+700).trim().length>=35)passages.push(c.slice(i,i+700).trim());}
 if(passages.length<2)throw Error('Please provide at least two distinct sentences or paragraphs.');
 const skills=['Evidence interpretation','Source verification'];
 const missions=passages.slice(0,8).map((p,i)=>{
 const sourceLabel='Source excerpt '+(i+1);
 const prev=passages[(i+1)%passages.length];
 let choices=[
 {text:'Use the cited excerpt, document its limits, and verify assumptions before acting.',score:1,feedback:'This preserves traceability and avoids extending the material beyond its evidence.'},
 {text:'Apply the excerpt as a universal rule without checking its scope.',score:0,feedback:'The passage may be relevant, but its scope and assumptions still need verification.'},
 {text:'Use the other excerpt instead, without showing why it applies.',score:0,feedback:'A real decision needs relevant evidence and a justification.'}
 ];const offset=i%3;choices=choices.slice(offset).concat(choices.slice(0,offset));
 return {id:'import-'+i,skill:skills[i%2],level:i<2?'challenge':'guided',title:'Evidence review '+(i+1),brief:'Your team must make a recommendation based on the supplied material. Review the assigned excerpt and decide how to proceed without overclaiming.',evidence:[{title:sourceLabel,text:p},{title:'Additional context',text:prev}],choices};
 });
 return {id:'custom',name:name.slice(0,90)||'Your material',role:'Research associate',manager:'Morgan Lee',subtitle:'Source-grounded evidence review',description:'Practice using your own material responsibly.',skills,missions,custom:true};
}