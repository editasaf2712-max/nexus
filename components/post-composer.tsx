'use client';
import { useState } from 'react';
import { Image, Link2, Smile, X } from 'lucide-react';
import { createClient } from '../lib/supabase/client';

const allowedTypes=['image/jpeg','image/png','image/webp','image/gif','video/mp4'];
const maxFileSize=50*1024*1024;

export default function PostComposer(){
 const [body,setBody]=useState('');
 const [state,setState]=useState('');
 const [busy,setBusy]=useState(false);
 const [file,setFile]=useState<File|null>(null);

 async function submit(){
  if(busy||(!body.trim()&&!file))return;
  const supabase=createClient();
  if(!supabase){setState('Paylaşım için Supabase bağlantısı gerekli.');return}
  if(file&&(!allowedTypes.includes(file.type)||file.size>maxFileSize)){
   setState('JPG, PNG, WebP, GIF veya MP4 seçin. Dosya boyutu en fazla 50 MB olabilir.');return;
  }
  setBusy(true);setState('');
  let uploadedPath:string|null=null;
  try{
   const {data:{user}}=await supabase.auth.getUser();
   if(!user){setState('Paylaşım yapmak için önce giriş yapın.');return}
   if(file){
    const ext=file.name.split('.').pop()?.toLowerCase()||'bin';
    uploadedPath=`${user.id}/${crypto.randomUUID()}.${ext}`;
    const {error}=await supabase.storage.from('nexus-media').upload(uploadedPath,file,{contentType:file.type,upsert:false});
    if(error){setState(error.message);uploadedPath=null;return}
   }
   const {error}=await supabase.from('posts').insert({author_id:user.id,body:body.trim()||' ',kind:'post',media_path:uploadedPath});
   if(error){if(uploadedPath)await supabase.storage.from('nexus-media').remove([uploadedPath]);setState(error.message);return}
   setBody('');setFile(null);setState('Paylaşım akışa eklendi.');window.location.reload();
  }catch{
   if(uploadedPath)await supabase.storage.from('nexus-media').remove([uploadedPath]).catch(()=>undefined);
   setState('Paylaşım tamamlanamadı. Bağlantını kontrol edip tekrar dene.');
  }finally{setBusy(false)}
 }

 return <div className="panel composer">
  <div className="composer-head"><div className="avatar">G</div><textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Bugün ne paylaşmak istersin?" aria-label="Yeni paylaşım" maxLength={5000}/></div>
  {file&&<div className="file-preview"><Image size={14}/>{file.name}<button type="button" className="text-tool" onClick={()=>setFile(null)} aria-label="Dosyayı kaldır"><X size={14}/></button></div>}
  <div className="composer-foot"><div className="composer-tools"><label className="text-tool" style={{cursor:'pointer'}}><Image size={15}/>Görsel/video<input type="file" accept={allowedTypes.join(',')} hidden onChange={e=>{setFile(e.target.files?.[0]||null);setState('')}}/></label><button type="button" className="text-tool" onClick={()=>setState('Bağlantını gönderi metnine ekleyebilirsin.')}><Link2 size={15}/>Bağlantı</button><button type="button" className="text-tool" aria-label="Emoji ekleme" onClick={()=>setState('Emoji klavyeni kullanarak gönderine emoji ekleyebilirsin.')}><Smile size={15}/></button></div><button className="primary" disabled={busy||(!body.trim()&&!file)} onClick={submit}>{busy?'Paylaşılıyor…':'Paylaş'}</button></div>
  {state&&<div role="status" style={{fontSize:10,color:'#7657f6',marginTop:10}}>{state}</div>}
 </div>
}
