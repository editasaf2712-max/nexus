import {notFound} from 'next/navigation';
import {createClient} from '../../../lib/supabase/server';
import FollowButton from '../../../components/follow-button';
import PostActions from '../../../components/post-actions';
import PostMedia from '../../../components/post-media';
export default async function PublicProfile({params}:{params:{username:string}}){
 const client=await createClient();if(!client)notFound();const username=decodeURIComponent(params.username);
 const {data:profile,error}=await client.from('profiles').select('id,username,display_name,bio,avatar_url,website,created_at').eq('username',username).maybeSingle();
 if(error||!profile)notFound();const {data:{user}}=await client.auth.getUser();
 const {data:posts}=await client.from('posts').select('id,author_id,body,media_path,created_at,likes:post_likes!post_likes_post_id_fkey(count),comments:comments!comments_post_id_fkey(count)').eq('author_id',profile.id).eq('visibility','public').order('created_at',{ascending:false}).limit(30);
 return <><section className="hero"><div className="eyebrow">NEXUS PROFİLİ</div><h1>{profile.display_name}</h1><p>@{profile.username}{profile.bio?' · '+profile.bio:''}</p>{profile.website&&<a href={profile.website} target="_blank" rel="noopener noreferrer" style={{color:'white'}}>{profile.website}</a>}</section><div className="panel data-card"><div className="data-meta">Nexus’a katılma: {new Date(profile.created_at).toLocaleDateString('tr-TR')}</div>{user&&<FollowButton targetId={profile.id}/>}</div><div className="section-heading"><h2>Gönderiler</h2><span>{posts?.length||0}</span></div>{posts?.map(p=><article className="panel post" key={p.id}><p className="post-body">{p.body}</p>{p.media_path&&<PostMedia path={p.media_path}/>}<PostActions postId={p.id} authorId={profile.id} body={p.body} likes={p.likes?.[0]?.count||0} comments={p.comments?.[0]?.count||0}/></article>)}{!posts?.length&&<div className="panel data-card">Henüz herkese açık gönderi yok.</div>}</>
}
