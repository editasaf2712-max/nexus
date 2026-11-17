'use client';
import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Repeat2, Bookmark, Flag, Send } from 'lucide-react';
import { createClient } from '../lib/supabase/client';

type Comment = { id:string; body:string; created_at:string; profiles?:{display_name?:string;username?:string}|null };

export default function PostActions({postId,authorId,body,likes,comments}:{postId:string;authorId:string;body:string;likes:number;comments:number}){
 const [likeCount,setLikeCount]=useState(likes||0);
 const [commentCount,setCommentCount]=useState(comments||0);
 const [liked,setLiked]=useState(false);
 const [saved,setSaved]=useState(false);
 const [open,setOpen]=useState(false);
 const [reply,setReply]=useState('');
 const [items,setItems]=useState<Comment[]>([]);
 const [message,setMessage]=useState('');
 const [busy,setBusy]=useState(false);

 useEffect(()=>{
  let active=true;
  const supabase=createClient();
  if(!supabase)return;
  void (async()=>{
   const {data:{user}}=await supabase.auth.getUser();
   if(!active||!user)return;
   const [likeResult,saveResult]=await Promise.all([
    supabase.from('post_likes').select('post_id').eq('post_id',postId).eq('user_id',user.id).maybeSingle(),
    supabase.from('saved_posts').select('post_id').eq('post_id',postId).eq('user_id',user.id).maybeSingle(),
   ]);
   if(active){setLiked(Boolean(likeResult.data));setSaved(Boolean(saveResult.data))}
  })();
  return ()=>{active=false};
 },[postId]);

 async function requireUser(){
  const supabase=createClient();
  if(!supabase){setMessage('Supabase bağlantısı yok.');return null}
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){setMessage('Bu işlem için önce giriş yapın.');return null}
  return {supabase,user};
 }

 async function toggleLike(){
  if(busy)return;
  const ctx=await requireUser();if(!ctx)return;
  setBusy(true);
  try{
   const {data,error:lookupError}=await ctx.supabase.from('post_likes').select('post_id').eq('post_id',postId).eq('user_id',ctx.user.id).maybeSingle();
   if(lookupError){setMessage('Beğeni durumu alınamadı.');return}
   if(data){const {error}=await ctx.supabase.from('post_likes').delete().eq('post_id',postId).eq('user_id',ctx.user.id);if(error)setMessage(error.message);else{setLiked(false);setLikeCount(x=>Math.max(0,x-1));setMessage('Beğeni kaldırıldı.')}}
   else{const {error}=await ctx.supabase.from('post_likes').insert({post_id:postId,user_id:ctx.user.id});if(error)setMessage(error.message);else{setLiked(true);setLikeCount(x=>x+1);setMessage('Gönderi beğenildi.')}}
  }catch{setMessage('Beğeni işlemi tamamlanamadı.')}finally{setBusy(false)}
 }

 async function toggleSave(){
  if(busy)return;
  const ctx=await requireUser();if(!ctx)return;
  setBusy(true);
  try{
   const {data,error:lookupError}=await ctx.supabase.from('saved_posts').select('post_id').eq('post_id',postId).eq('user_id',ctx.user.id).maybeSingle();
   if(lookupError){setMessage('Kaydetme durumu alınamadı.');return}
   if(data){const {error}=await ctx.supabase.from('saved_posts').delete().eq('post_id',postId).eq('user_id',ctx.user.id);if(error)setMessage(error.message);else{setSaved(false);setMessage('Kaydedilenlerden çıkarıldı.')}}
   else{const {error}=await ctx.supabase.from('saved_posts').insert({post_id:postId,user_id:ctx.user.id});if(error)setMessage(error.message);else{setSaved(true);setMessage('Gönderi kaydedildi.')}}
  }catch{setMessage('Kaydetme işlemi tamamlanamadı.')}finally{setBusy(false)}
 }

 async function loadComments(){
  const supabase=createClient();
  if(!supabase){setMessage('Yorumlar şu anda yüklenemiyor.');return}
  try{
   const {data,error}=await supabase.from('comments').select('id,body,created_at,profiles(display_name,username)').eq('post_id',postId).order('created_at',{ascending:true}).limit(40);
   if(error)setMessage('Yorumlar yüklenemedi.');else setItems((data||[]) as unknown as Comment[]);
  }catch{setMessage('Yorumlar yüklenemedi.')}
 }

 async function toggleComments(){const next=!open;setOpen(next);if(next)await loadComments()}

 async function sendComment(){
  if(!reply.trim()||busy)return;
  const ctx=await requireUser();if(!ctx)return;
  setBusy(true);
  try{
   const {data,error}=await ctx.supabase.from('comments').insert({post_id:postId,author_id:ctx.user.id,body:reply.trim()}).select('id,body,created_at,profiles(display_name,username)').single();
   if(error)setMessage(error.message);else{setItems(x=>[...x,data as unknown as Comment]);setReply('');setCommentCount(x=>x+1);setMessage('Yorum eklendi.')}
  }catch{setMessage('Yorum gönderilemedi.')}finally{setBusy(false)}
 }

 async function repost(){
  const ctx=await requireUser();if(!ctx)return;
  setBusy(true);
  try{const {error}=await ctx.supabase.from('posts').insert({author_id:ctx.user.id,body:`↻ ${body}`,kind:'repost'});setMessage(error?error.message:'Yeniden paylaşım akışa eklendi.')}
  catch{setMessage('Yeniden paylaşım başarısız oldu.')}finally{setBusy(false)}
 }

 async function report(){
  const ctx=await requireUser();if(!ctx)return;
  setBusy(true);
  try{const {error}=await ctx.supabase.from('reports').insert({reporter_id:ctx.user.id,target_type:'post',target_id:postId,reason:'user_report'});setMessage(error?error.message:'Gönderi moderasyon ekibine bildirildi.')}
  catch{setMessage('Bildirim gönderilemedi.')}finally{setBusy(false)}
 }

 return <><div className="post-actions"><button className={`text-tool ${liked?'liked':''}`} disabled={busy} onClick={toggleLike} aria-pressed={liked}><Heart size={14} fill={liked?'currentColor':'none'}/>{likeCount}</button><button className="text-tool" onClick={toggleComments} aria-expanded={open}><MessageCircle size={14}/>{commentCount}</button><button className="text-tool" disabled={busy} onClick={repost}><Repeat2 size={14}/>Yeniden paylaş</button><button className={`text-tool ${saved?'liked':''}`} disabled={busy} onClick={toggleSave} aria-pressed={saved}><Bookmark size={14} fill={saved?'currentColor':'none'}/>Kaydet</button><button className="text-tool" disabled={busy} aria-label="Bildir" onClick={report}><Flag size={14}/></button></div>{message&&<div role="status" style={{fontSize:10,color:'#7657f6',marginTop:9}}>{message}</div>}{open&&<div className="comment-panel"><div className="comment-list">{items.length?items.map(c=><div className="comment-item" key={c.id}><b>{c.profiles?.display_name||'Nexus üyesi'}</b><span>{c.body}</span></div>):<small style={{color:'#989dab'}}>Henüz yorum yok. İlk yorumu sen yaz.</small>}</div><div className="comment-entry"><input value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')void sendComment()}} placeholder="Bir yanıt yaz..." aria-label="Yorum yaz"/><button className="icon-button" onClick={sendComment} disabled={busy||!reply.trim()} aria-label="Yorumu gönder"><Send size={14}/></button></div></div>}</>
}
