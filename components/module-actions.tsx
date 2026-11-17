'use client';
import { useEffect, useState } from 'react';
import { ExternalLink, Github, Heart, GraduationCap, ThumbsDown, ThumbsUp, Star } from 'lucide-react';
import { createClient } from '../lib/supabase/client';

type Kind='debatehub'|'skillshare'|'ideamarket'|'devspace';
function safeExternalUrl(value?:string|null){
 if(!value)return undefined;
 try{const url=new URL(value);return url.protocol==='https:'||url.protocol==='http:'?url.toString():undefined}catch{return undefined}
}
export default function ModuleActions({kind,itemId,githubUrl,demoUrl}:{kind:Kind;itemId:string;githubUrl?:string|null;demoUrl?:string|null}){
 const [vote,setVote]=useState<'agree'|'disagree'|null>(null);
 const [active,setActive]=useState(false);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState('');

 useEffect(()=>{
  let activeRequest=true;
  const supabase=createClient();
  if(!supabase)return;
  void (async()=>{
   const {data:{user}}=await supabase.auth.getUser();
   if(!user||!activeRequest)return;
   if(kind==='debatehub'){
    const {data}=await supabase.from('debate_votes').select('vote').eq('debate_id',itemId).eq('user_id',user.id).maybeSingle();
    if(activeRequest&&data)setVote(data.vote as 'agree'|'disagree');
   }else{
    const table=kind==='skillshare'?'course_enrollments':kind==='ideamarket'?'idea_votes':'project_stars';
    const key=kind==='skillshare'?'course_id':kind==='ideamarket'?'idea_id':'project_id';
    const {data}=await supabase.from(table).select(key).eq(key,itemId).eq('user_id',user.id).maybeSingle();
    if(activeRequest)setActive(Boolean(data));
   }
  })();
  return ()=>{activeRequest=false};
 },[itemId,kind]);

 async function toggle(value?:'agree'|'disagree'){
  if(busy)return;
  const supabase=createClient();
  if(!supabase){setMessage('Bu işlem için Supabase bağlantısı gerekli.');return}
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){setMessage('Bu işlem için önce giriş yapın.');return}
  setBusy(true);setMessage('');
  try{
   if(kind==='debatehub'){
    if(!value)return;
    if(vote===value){
     const {error}=await supabase.from('debate_votes').delete().eq('debate_id',itemId).eq('user_id',user.id);
     if(error)throw error;
     setVote(null);
    }else{
     const {error}=await supabase.from('debate_votes').upsert({debate_id:itemId,user_id:user.id,vote:value},{onConflict:'debate_id,user_id'});
     if(error)throw error;
     setVote(value);
    }
   }else{
    const table=kind==='skillshare'?'course_enrollments':kind==='ideamarket'?'idea_votes':'project_stars';
    const key=kind==='skillshare'?'course_id':kind==='ideamarket'?'idea_id':'project_id';
    const query=supabase.from(table);
    const nextActive=!active;
    if(active){const {error}=await query.delete().eq(key,itemId).eq('user_id',user.id);if(error)throw error;setActive(false)}
    else{const {error}=await query.insert({[key]:itemId,user_id:user.id});if(error)throw error;setActive(true)}
    setMessage(kind==='skillshare'?(nextActive?'Eğitime kaydoldun.':'Eğitim kaydın kaldırıldı.'):kind==='ideamarket'?(nextActive?'Fikre destek verdin.':'Desteğin kaldırıldı.'):(nextActive?'Projeyi yıldızladın.':'Yıldız kaldırıldı.'));
   }
   if(kind==='debatehub')setMessage('Oy tercihin kaydedildi.');
  }catch{
   setMessage('İşlem tamamlanamadı. Tekrar deneyin.');
  }finally{setBusy(false)}
 }

 const safeGithub=safeExternalUrl(githubUrl);const safeDemo=safeExternalUrl(demoUrl);
 return <div className="module-record-actions">
  {kind==='debatehub'?<><button className={`text-tool ${vote==='agree'?'liked':''}`} disabled={busy} onClick={()=>toggle('agree')}><ThumbsUp size={14}/>Katılıyorum</button><button className={`text-tool ${vote==='disagree'?'liked':''}`} disabled={busy} onClick={()=>toggle('disagree')}><ThumbsDown size={14}/>Katılmıyorum</button></>:kind==='skillshare'?<button className={`text-tool ${active?'liked':''}`} disabled={busy} onClick={()=>toggle()}><GraduationCap size={14}/>{active?'Eğitime kayıtlısın':'Eğitime katıl'}</button>:kind==='ideamarket'?<button className={`text-tool ${active?'liked':''}`} disabled={busy} onClick={()=>toggle()}><Heart size={14} fill={active?'currentColor':'none'}/>{active?'Destekledin':'Fikri destekle'}</button>:<><button className={`text-tool ${active?'liked':''}`} disabled={busy} onClick={()=>toggle()}><Star size={14} fill={active?'currentColor':'none'}/>{active?'Yıldızlandı':'Yıldızla'}</button>{safeGithub&&<a className="text-tool" href={safeGithub} target="_blank" rel="noopener noreferrer"><Github size={14}/>GitHub</a>}{safeDemo&&<a className="text-tool" href={safeDemo} target="_blank" rel="noopener noreferrer"><ExternalLink size={14}/>Demo</a>}</>}
  {message&&<span role="status" className="module-action-message">{message}</span>}
 </div>
}
