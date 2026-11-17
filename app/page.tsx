import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { modules } from '../lib/modules';
import PostComposer from '../components/post-composer';
import { createClient } from '../lib/supabase/server';
import PostActions from '../components/post-actions';
import PostMedia from '../components/post-media';

const starterPosts=[
 {name:'Elif Yılmaz',handle:'@elifbuilds',tag:'PRODUCT',body:'Bir ürünü gerçekten iyi yapan şey daha çok özellik değil, doğru problemi çözmesidir. Son 3 aydır ekibimizle sadeleştirme üzerine çalışıyoruz. Siz ürününüzde hangi özelliği kaldırdınız ve sonuç ne oldu?',likes:128,comments:24,avatar:'EY',tone:'linear-gradient(145deg,#ffbd8d,#f26ca2)'},
 {name:'Mert Kaya',handle:'@mertcodes',tag:'DEVSPACE',body:'Yeni açık kaynak projemiz Nexus UI kit yayında! Next.js ve Tailwind ile erişilebilir, kopyala-yapıştır bileşenler. İlk geri bildirimlerinizi bekliyoruz. ✨',likes:86,comments:17,avatar:'MK',tone:'linear-gradient(145deg,#8ec5fc,#6e78ff)'},
];
export default async function Home(){
 const supabase=await createClient();let posts:any[]=[];let feedError='';
 if(supabase){const {data,error}=await supabase.from('posts').select('id,author_id,body,media_path,created_at,profiles(id,display_name,username,avatar_url),likes:post_likes(count),comments(count)').eq('visibility','public').order('created_at',{ascending:false}).limit(10);posts=data||[];if(error)feedError='Akış yüklenemedi. Biraz sonra yeniden dene.'}
 return <>
  <section className="hero"><div className="eyebrow">FİKİRLERİN BULUŞMA NOKTASI</div><h1>Merhaba, düşünmeye hazır mısın?</h1><p>Öğren, paylaş, üret. Fikirlerin değer bulduğu topluluğa katıl ve birlikte daha iyisini inşa et.</p><Link href="/explore"><button>Topluluğu keşfet <ArrowRight size={13} style={{verticalAlign:'middle',marginLeft:5}}/></button></Link><Sparkles size={25} style={{position:'absolute',right:65,top:65,color:'#afa1ff'}}/></section>
  <div className="section-heading"><h2>Nexus Spaces</h2><span>Hepsini keşfet →</span></div>
  <div className="module-grid">{modules.map(m=>{const Icon=m.icon;return <Link className="module-card" href={m.path} key={m.key}><span className="module-icon" style={{background:m.tint,color:m.color}}><Icon size={19}/></span><b>{m.name}</b><small>{m.description}</small></Link>})}</div>
  <div className="section-heading"><h2>Topluluk akışı</h2><span>Senin için · Takip edilenler</span></div>
  <div className="feed-layout"><div><PostComposer/>{supabase&&posts.length===0?<div className="panel data-card">{feedError||'Henüz gönderi yok. Topluluk akışındaki ilk paylaşımı sen yap.'}</div>:(supabase?posts:starterPosts).map((p:any,i:number)=>{const profile=Array.isArray(p.profiles)?p.profiles[0]:p.profiles;const name=profile?.display_name||p.name;const handle=profile?.username?`@${profile.username}`:p.handle;const likeCount=p.likes?.[0]?.count??p.likes??0;const commentCount=p.comments?.[0]?.count??p.comments??0;return <article className="panel post" key={p.id||i}><div className="post-head"><div className="avatar" style={{background:p.tone||undefined}}>{profile?.avatar_url?<img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',borderRadius:'50%',objectFit:'cover'}}/>:name?.split(' ').map((x:string)=>x[0]).join('').slice(0,2)}</div><div><div className="person">{name}</div><div className="handle">{handle} · {p.created_at?'az önce':'2 saat önce'}</div></div><span className="post-tag">{p.tag||'TOPLULUK'}</span></div><p className="post-body">{p.body}</p>{p.media_path&&<PostMedia path={p.media_path}/>}{i===0&&!p.id&&<div className="post-art"><Sparkles size={30}/><div style={{fontSize:12,fontWeight:700}}>Daha az, ama daha anlamlı.</div><ArrowRight size={18}/></div>}{p.id?<PostActions postId={p.id} authorId={p.author_id||profile?.id||''} body={p.body} likes={likeCount} comments={commentCount}/>:<div className="post-actions"><span>♡ {likeCount}</span><span>◯ {commentCount}</span><span>Yeniden paylaş</span><span>Kaydet</span></div>}</article>})}</div>
   <div><div className="panel data-card" style={{marginTop:0}}><div className="eyebrow" style={{color:'#7657f6'}}>NEXUS AI</div><h3 style={{marginTop:10}}>Birlikte daha iyisini düşün.</h3><p>Fikirlerini analiz et, yeni bakış açıları kazan ve öğrenme yolculuğunu kişiselleştir.</p><Link href="/ai" className="primary" style={{display:'inline-block',textDecoration:'none'}}>AI ile keşfet</Link></div><div className="panel data-card"><h3>Toplulukta yeni misin?</h3><p>Bir tartışmaya katılarak ilk adımını at.</p><Link href="/modules/debatehub" style={{color:'#7657f6',fontSize:11,fontWeight:700,textDecoration:'none'}}>Tartışmalara göz at →</Link></div></div>
  </div>
 </>
}
