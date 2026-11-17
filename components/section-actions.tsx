'use client';
import { useState } from 'react';
import { createClient } from '../lib/supabase/client';

function slugify(value:string){
 return value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

export default function SectionActions({mode,initial}:{mode:string;initial?:any}){
 const [title,setTitle]=useState('');
 const [body,setBody]=useState('');
 const [msg,setMsg]=useState('');
 const [busy,setBusy]=useState(false);
 const [display,setDisplay]=useState(initial?.display_name||'');
 const [username,setUsername]=useState(initial?.username||'');
 const [bio,setBio]=useState(initial?.bio||'');

 async function save(){
  const supabase=createClient();
  if(!supabase){setMsg('Supabase bağlantısı gerekli.');return}
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){setMsg('Giriş yapmanız gerekiyor.');return}
  if(mode==='communities'&&!title.trim()){setMsg('Topluluk adı gerekli.');return}
  if(mode==='communities'&&!slugify(title)){setMsg('Topluluk adı geçerli bir bağlantı adına dönüşmüyor.');return}
  if((mode==='settings'||mode==='profile')&&!display.trim()){setMsg('Görünen ad gerekli.');return}

  setBusy(true);
  try{
   let result:any;
   if(mode==='communities'){
    result=await supabase.from('communities').insert({name:title.trim(),description:body.trim(),slug:slugify(title),created_by:user.id});
   }else if(mode==='messages'){
    const conversation=await supabase.from('conversations').insert({created_by:user.id,title:title.trim()||'Yeni sohbet'}).select('id').single();
    result=conversation;
    if(!conversation.error&&body.trim()){
     result=await supabase.from('messages').insert({conversation_id:conversation.data.id,sender_id:user.id,body:body.trim()});
    }
   }else if(mode==='settings'||mode==='profile'){
    result=await supabase.from('profiles').upsert({id:user.id,display_name:display.trim(),username:username.trim()||null,bio:bio.trim(),updated_at:new Date().toISOString()});
   }
   if(result?.error){setMsg(result.error.message);return}
   setMsg(mode==='messages'?'Sohbet oluşturuldu.':mode==='communities'?'Topluluk oluşturuldu.':'Profil kaydedildi.');
   if(mode==='communities'||mode==='messages'){setTitle('');setBody('')}
  }catch{
   setMsg('İşlem tamamlanamadı. Lütfen tekrar dene.');
  }finally{setBusy(false)}
 }

 return <div className="panel data-card" style={{display:'grid',gap:9}}>{mode==='admin'?<><h3>Yönetici işlemleri</h3><p>Kullanıcı yönetimi ve şikâyet incelemesi için admin rolü olan bir kullanıcıyla giriş yapın. Roller Supabase metadata üzerinden belirlenir.</p></>:mode==='notifications'?<><h3>Bildirimler</h3><p>Bildirimler yalnızca sana özel RLS politikasıyla okunur.</p></>:mode==='messages'?<><h3>Özel sohbet</h3><input style={field} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Sohbet başlığı"/><textarea style={field} value={body} onChange={e=>setBody(e.target.value)} placeholder="İlk mesajını yaz (isteğe bağlı)"/><p>Sohbeti sen başlatırsın; daha sonra katılımcı davet edebilirsin.</p><button className="primary" onClick={save} disabled={busy}>{busy?'Oluşturuluyor…':'Sohbet başlat'}</button></>:mode==='communities'?<><h3>Topluluk oluştur</h3><input style={field} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Topluluk adı"/><textarea style={field} value={body} onChange={e=>setBody(e.target.value)} placeholder="Topluluğu tanımla"/><button className="primary" onClick={save} disabled={busy}>{busy?'Oluşturuluyor…':'Oluştur'}</button></>:<><h3>Profil bilgileri</h3><input style={field} value={display} onChange={e=>setDisplay(e.target.value)} placeholder="Görünen ad"/><input style={field} value={username} onChange={e=>setUsername(e.target.value)} placeholder="Kullanıcı adı"/><textarea style={field} value={bio} onChange={e=>setBio(e.target.value)} placeholder="Kısa biyografi"/><button className="primary" onClick={save} disabled={busy}>{busy?'Kaydediliyor…':'Profili kaydet'}</button></>}{msg&&<small role="status" style={{color:'#7657f6'}}>{msg}</small>}</div>
}

const field:React.CSSProperties={border:'1px solid #ececf2',borderRadius:9,padding:'10px 12px',fontSize:12,background:'transparent',color:'inherit'};
