'use client';
import { useState } from 'react';
import { createClient } from '../lib/supabase/client';

export default function AuthPanel(){
 const [mode,setMode]=useState<'in'|'up'>('in');
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [name,setName]=useState('');
 const [msg,setMsg]=useState('');
 const [busy,setBusy]=useState(false);

 async function submit(){
  const supabase=createClient();
  if(!supabase){setMsg('Giriş servisi şu anda yapılandırılmamış.');return}
  if(!email.trim()||!password){setMsg('E-posta ve parola gerekli.');return}
  if(mode==='up'&&!name.trim()){setMsg('Adını yaz.');return}
  setBusy(true);
  try{
   const result=mode==='in'
    ?await supabase.auth.signInWithPassword({email:email.trim(),password})
    :await supabase.auth.signUp({email:email.trim(),password,options:{data:{display_name:name.trim()}}});
   if(result.error){setMsg(result.error.message);return}
   if(mode==='in'){
    setMsg('Giriş başarılı.');
    window.location.reload();
   }else if(result.data.session){
    setMsg('Hesap oluşturuldu.');
    window.location.reload();
   }else{
    setMsg('Hesabını doğrulamak için e-postandaki bağlantıya tıkla.');
   }
  }catch{
   setMsg('Giriş işlemi tamamlanamadı. Bağlantını kontrol edip tekrar dene.');
  }finally{setBusy(false)}
 }

 async function google(){
  const supabase=createClient();
  if(!supabase){setMsg('Google girişi şu anda yapılandırılmamış.');return}
  setBusy(true);
  try{
   const configuredUrl=process.env.NEXT_PUBLIC_SITE_URL;
   const origin=window.location.origin;
   const redirectOrigin=process.env.NODE_ENV==='production'&&configuredUrl?new URL(configuredUrl).origin:origin;
   const {data,error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:`${redirectOrigin}/auth/callback`,skipBrowserRedirect:true}});
   if(error){setMsg(error.message.toLowerCase().includes('provider is not enabled')?'Google ile giriş henüz etkin değil. Şimdilik e-posta ile kayıt olabilir veya Supabase sağlayıcı ayarlarında Google’ı etkinleştirebilirsin.':error.message);return}
   if(!data.url){setMsg('Google giriş bağlantısı oluşturulamadı. Supabase Google sağlayıcı ayarlarını kontrol edin.');return}
   window.location.assign(data.url);
  }catch{setMsg('Google ile giriş başlatılamadı. Supabase Google Client ID/Secret ve Google Cloud geri dönüş adresini kontrol edin.')}finally{setBusy(false)}
 }

 return <div style={{marginTop:16,display:'grid',gap:9,maxWidth:360}}>
  {mode==='up'&&<input value={name} onChange={e=>setName(e.target.value)} placeholder="Adın" aria-label="Adın" autoComplete="name" style={field}/>}
  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-posta" aria-label="E-posta" type="email" autoComplete="email" style={field}/>
  <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Parola" aria-label="Parola" type="password" autoComplete={mode==='in'?'current-password':'new-password'} style={field}/>
  <button className="primary" onClick={submit} disabled={busy}>{busy?'İşleniyor…':mode==='in'?'Giriş yap':'Hesap oluştur'}</button>
  <button className="icon-button" onClick={google} disabled={busy} style={{width:'100%',display:'flex',gap:8}}>G Google ile devam et</button>
  <button className="text-tool" onClick={()=>{setMode(mode==='in'?'up':'in');setMsg('')}}>{mode==='in'?'Hesabın yok mu? Kayıt ol':'Zaten hesabın var mı? Giriş yap'}</button>
  {msg&&<small role="status" style={{color:'#7657f6'}}>{msg}</small>}
 </div>
}

const field:React.CSSProperties={border:'1px solid #ececf2',borderRadius:9,padding:'11px 12px',fontSize:12,background:'transparent',color:'inherit'};
