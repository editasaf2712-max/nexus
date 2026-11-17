import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { modules,type ModuleKey } from '../../../lib/modules';
import { createClient } from '../../../lib/supabase/server';
import ModuleCreateForm from '../../../components/module-create-form';
import ModuleActions from '../../../components/module-actions';
import ModuleComments from '../../../components/module-comments';
import CourseContent from '../../../components/course-content';
const content:Record<ModuleKey,{intro:string;table:string;title:string;description:string;fields:string[]}>={
 debatehub:{intro:'Merak ettiğin konuları aç, farklı bakış açılarıyla birlikte düşün.',table:'debates',title:'tartışma',description:'Bir tartışma başlat',fields:['Kategori','Kaynak bağlantısı']},
 skillshare:{intro:'Bildiğini paylaş, yeni bir beceri edin. Öğrenme toplulukla güzelleşir.',table:'courses',title:'eğitim',description:'Bir eğitim oluştur',fields:['Seviye','Video veya kaynak bağlantısı']},
 ideamarket:{intro:'Ham fikirleri paylaş, oylarla geliştir ve doğru iş ortaklarını bul.',table:'ideas',title:'fikir',description:'Bir fikir paylaş',fields:['Aşama','Kategori']},
 devspace:{intro:'Projeni dünyaya tanıt, ekip arkadaşları bul ve birlikte inşa et.',table:'projects',title:'proje',description:'Bir proje sergile',fields:['Teknolojiler (virgülle ayır)','GitHub adresi','Demo adresi']},
};
export default async function ModulePage({params}:{params:{module:string}}){
 const mod=modules.find(m=>m.key===params.module);if(!mod)notFound();const c=content[mod.key];const supabase=await createClient();let records:any[]=[];let error='';
 if(supabase){const result=await supabase.from(c.table).select('*,profiles:profiles!author_id(display_name,username)').eq('visibility','public').order('created_at',{ascending:false}).limit(30);if(result.error)error='İçerikler şu anda yüklenemiyor.';else records=result.data||[]}
 const Icon=mod.icon;
 return <><div style={{margin:'5px 0 22px'}}><Link href="/" style={{color:'#8c91a0',textDecoration:'none',fontSize:11}}><ArrowLeft size={13} style={{verticalAlign:'middle',marginRight:5}}/>Ana akış</Link></div><div className="module-heading"><span className="module-icon" style={{background:mod.tint,color:mod.color}}><Icon size={22}/></span><div><h1>{mod.name}</h1><p>{c.intro}</p></div><a className="primary module-actions" href="#create" style={{textDecoration:'none'}}>+ Yeni {c.title}</a></div>
 {!supabase&&<div className="auth-note">İçerikleri kullanmak için Supabase URL, publishable key ve veritabanı şeması yapılandırılmalı.</div>}
 <div className="panel data-card" id="create"><h3>{c.description}</h3><p>Yayınladığın içerik toplulukla paylaşılır ve hesabına kaydedilir.</p><ModuleCreateForm table={c.table} noun={c.title} fields={c.fields}/></div>
 {error&&<div className="auth-note" role="status">{error}</div>}
 <div className="section-heading"><h2>{mod.key==='debatehub'?'Tartışmalar':mod.key==='skillshare'?'Eğitimler':mod.key==='ideamarket'?'Fikirler':'Projeler'}</h2><span>{records.length?records.length+' içerik':''}</span></div>
 {supabase&&!error&&records.length===0&&<div className="panel data-card">Henüz içerik yok. Bu alanda ilk paylaşımı sen yapabilirsin.</div>}
 {records.map((item:any)=><article className="panel data-card" key={item.id}><div className="data-meta">{item.profiles?.display_name||'Nexus üyesi'}{item.category?' · '+item.category:''}{item.level?' · '+item.level:''}{item.stage?' · '+item.stage:''}</div><h3 style={{marginTop:8}}>{item.title}</h3><p>{item.description}</p>{item.source_url&&<p><a href={item.source_url} target="_blank" rel="noopener noreferrer">Kaynağı aç</a></p>}{item.resource_url&&<p><a href={item.resource_url} target="_blank" rel="noopener noreferrer">Eğitim kaynağını aç</a></p>}{item.technologies?.length>0&&<div style={{display:'flex',gap:7,flexWrap:'wrap',margin:'10px 0'}}>{item.technologies.map((tag:string)=><span key={tag} className="post-tag">{tag}</span>)}</div>}{item.looking_for_team&&<div className="post-tag" style={{display:'inline-block',margin:0}}>Ekip arkadaşı arıyor</div>}{item.github_url&&<p><a href={item.github_url} target="_blank" rel="noopener noreferrer">GitHub</a>{item.demo_url&&<> · <a href={item.demo_url} target="_blank" rel="noopener noreferrer">Demo</a></>}</p>}<ModuleActions kind={mod.key} itemId={item.id} githubUrl={item.github_url} demoUrl={item.demo_url}/><ModuleComments moduleType={c.table as 'debates'|'courses'|'ideas'|'projects'} itemId={item.id}/>{mod.key==='skillshare'&&<CourseContent courseId={item.id} authorId={item.author_id}/>}</article>)}
 </>;
}
