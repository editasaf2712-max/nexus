import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
export async function POST(req:Request){
 const supabase=await createClient();
 if(!supabase)return NextResponse.json({error:'Supabase yapılandırılmamış.'},{status:503});
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:'Giriş gerekli.'},{status:401});

 const nvidiaKey=process.env.NVIDIA_API_KEY;
 const openAiKey=process.env.OPENAI_API_KEY;
 const apiKey=nvidiaKey||openAiKey;
 if(!apiKey)return NextResponse.json({error:'AI anahtarı bağlı değil. Yayın ortamına NVIDIA_API_KEY ekleyin.'},{status:503});

 let input:{prompt?:unknown;mode?:unknown};
 try{input=await req.json()}catch{return NextResponse.json({error:'İstek gövdesi geçersiz.'},{status:400})}
 const {prompt,mode}=input;
 if(typeof prompt!=='string'||!prompt.trim()||prompt.length>6000)return NextResponse.json({error:'İstek metni geçersiz veya çok uzun.'},{status:400});

 const useNvidia=Boolean(nvidiaKey);
 const endpoint=useNvidia?'https://integrate.api.nvidia.com/v1/chat/completions':'https://api.openai.com/v1/chat/completions';
 const model=useNvidia?(process.env.NVIDIA_MODEL||'openai/gpt-oss-20b'):(process.env.OPENAI_MODEL||'gpt-4o-mini');
 let response:Response;
 try{
  response=await fetch(endpoint,{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages:[{role:'system',content:`Sen Nexus platformunun düşünme ve öğrenme asistanısın. Türkçe cevap ver. İstenen görev: ${String(mode||'analiz').slice(0,60)}. Zararlı istekleri destekleme.`},{role:'user',content:prompt.trim()}],temperature:0.6,max_tokens:2048,stream:false})});
 }catch{return NextResponse.json({error:'AI sağlayıcısına bağlanılamadı.'},{status:502})}
 if(!response.ok)return NextResponse.json({error:'AI sağlayıcısı isteği reddetti. NVIDIA API anahtarını ve model erişimini kontrol edin.'},{status:502});
 const data=await response.json();
 return NextResponse.json({result:data.choices?.[0]?.message?.content||''});
}
