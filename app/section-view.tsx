import Link from 'next/link';
import {createClient} from '../lib/supabase/server';
import AuthPanel from '../components/auth-panel';
import SectionActions from '../components/section-actions';
import ConversationThread from '../components/conversation-thread';
import CommunityBrowser from '../components/community-browser';
import PeopleSearch from '../components/people-search';
import AdminDashboard from '../components/admin-dashboard';

const config: Record<string, {title:string; intro:string; table?:string; icon:string}> = {
  login:{title:'Giriş yap',intro:'Nexus hesabına giriş yap veya yeni bir hesap oluştur.',icon:'↪'},
  explore:{title:'Keşfet',intro:'Nexus topluluğunda bugün konuşulanları, üretilenleri ve öğrenilenleri keşfet.',table:'posts',icon:'⌕'},
  saved:{title:'Kaydedilenler',intro:'Daha sonra dönmek istediğin içerikler burada.',table:'saved_posts',icon:'▣'},
  notifications:{title:'Bildirimler',intro:'Topluluğundaki gelişmelerden haberdar ol.',table:'notifications',icon:'◉'},
  messages:{title:'Mesajlar',intro:'Topluluğunla özel ve güvenli şekilde iletişim kur.',table:'messages',icon:'✉'},
  communities:{title:'Topluluklar',intro:'İlgi alanlarına göre topluluk bul veya kendi topluluğunu oluştur.',table:'communities',icon:'♧'},
  settings:{title:'Ayarlar',intro:'Hesabını ve profil bilgilerini yönet.',table:'profiles',icon:'⚙'},
  admin:{title:'Yönetim paneli',intro:'Yönetim yetkileri sunucu tarafında doğrulanır.',table:'profiles',icon:'⬡'},
  profile:{title:'Profilim',intro:'Profilini toplulukla paylaş ve çalışmalarını sergile.',table:'profiles',icon:'◉'}
};

export default async function SectionView({section,authError,searchQuery}:{section:string;authError?:string;searchQuery?:string}) {
  const c=config[section];
  if(!c) return null;
  const supabase=await createClient();
  let user:any=null;
  let rows:any[]=[];
  let denied='';
  if(supabase) {
    const {data}=await supabase.auth.getUser();
    user=data.user;
    if(section==='admin' && user?.app_metadata?.role!=='admin') denied='Bu panele erişim için yönetici rolü gerekiyor.';
    if(c.table && (user || section==='explore' || section==='communities') && !(section==='admin' && denied)) {
      let query:any;
      if(section==='saved') query=supabase.from('saved_posts').select('post_id,posts(id,body,created_at,profiles:profiles!posts_author_id_fkey(display_name,username))').eq('user_id',user.id).order('created_at',{ascending:false}).limit(30);
      else if(section==='settings'||section==='profile') query=supabase.from('profiles').select('*').eq('id',user.id).maybeSingle();
      else if(section==='messages') query=supabase.from('conversations').select('id,title,updated_at,created_at').order('updated_at',{ascending:false}).limit(30);
      else if(section==='admin') query=supabase.from('profiles').select('id').eq('id',user.id).limit(1);
      else if(section==='explore') query=supabase.from('posts').select('id,body,created_at,profiles:profiles!posts_author_id_fkey(display_name,username)').eq('visibility','public').order('created_at',{ascending:false}).limit(50);
      else if(section==='communities') query=supabase.from('communities').select('id').limit(1);
      else query=supabase.from(c.table).select('*').limit(30);
      if(section==='notifications') query=supabase.from('notifications').select('id,kind,message,entity_id,read_at,created_at,actor:profiles!notifications_actor_id_fkey(display_name,username)').eq('user_id',user.id).order('created_at',{ascending:false}).limit(50);
      if(section==='explore'&&searchQuery) query=query.ilike('body',`%${searchQuery.replace(/[%_,]/g,' ')}%`);
      const {data:result,error}=await query;
      if(error) denied=section==='admin'?'Bu panele erişim için yönetici rolü gerekiyor.':error.message;
      else rows=Array.isArray(result)?result:result?[result]:[];
    }
  }
  return <><section className="hero" style={{minHeight:140}}><div className="eyebrow">NEXUS COMMUNITY</div><h1>{c.icon} {c.title}</h1><p>{c.intro}</p></section>
    {section==='login'&&user?<div className="panel data-card"><div className="auth-note">Nexus hesabın açık. Topluluk akışına dönebilir veya AI sayfasını kullanabilirsin.</div><Link href="/ai" style={{color:'#7657f6',fontSize:12}}>Nexus AI →</Link></div>:(!user||section==='login')&&<div className="panel data-card"><div className="auth-note">{authError||(supabase?'E-posta ve parolanla giriş yap veya hesap oluştur.':'Giriş için Supabase ortam değişkenlerini yapılandır.')}</div><AuthPanel/></div>}
    {denied&&<div className="auth-note" style={{marginTop:14}}>{denied}</div>}
    {section==='messages'&&user&&<SectionActions mode="messages"/>}
    {section==='communities'&&<>{user&&<SectionActions mode="communities"/>}<CommunityBrowser/></>}
    {section==='settings'&&user&&<SectionActions mode="settings" initial={rows[0]}/>}
    {section==='profile'&&user&&<SectionActions mode="profile" initial={rows[0]}/>}
    {section==='admin'&&user&&!denied&&<AdminDashboard/>}
    {section==='notifications'&&user&&<SectionActions mode="notifications"/>}
    {section==='explore'&&searchQuery&&<PeopleSearch query={searchQuery}/>}
    {section!=='communities'&&section!=='admin'&&<><div className="section-heading"><h2>{section==='notifications'?'Son bildirimler':section==='messages'?'Sohbetlerin':section==='explore'?'Gönderiler':'Topluluktan içerikler'}</h2><span>{rows.length?rows.length+' kayıt':''}</span></div>
      {rows.map((r:any,i:number)=>{const data=r.posts||r;const actor=Array.isArray(data.actor)?data.actor[0]:data.actor;return <article className="panel data-card" key={r.id||r.post_id||i}><h3>{section==='messages'?(data.title||'Özel sohbet'):section==='notifications'?(data.message||`${actor?.display_name||'Nexus üyesi'} · ${data.kind}`):(data.title||data.display_name||data.body||data.type||'Nexus içeriği')}</h3>{section!=='messages'&&<p>{data.description||data.body||data.message||data.username||'Yeni içerik ve topluluk etkinliği.'}</p>}<div className="data-meta">{data.created_at?new Date(data.created_at).toLocaleString('tr-TR'):'Nexus'}</div>{section==='messages'&&<ConversationThread id={r.id}/>}</article>})}
      {(user||section==='explore')&&rows.length===0&&!denied&&<div className="panel data-card"><p>{searchQuery?'Aramanla eşleşen gönderi bulunamadı.':'Henüz burada gösterilecek bir içerik yok. Keşfet sayfasından topluluğa katılabilirsin.'}</p><Link href="/explore" style={{color:'#7657f6',fontSize:12}}>Keşfet →</Link></div>}
    </>}
  </>;
}
