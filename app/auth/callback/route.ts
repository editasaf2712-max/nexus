import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
export async function GET(request:Request){
 const url=new URL(request.url);
 const code=url.searchParams.get('code');
 const authError=url.searchParams.get('error_description')||url.searchParams.get('error');
 const configuredOrigin=process.env.NEXT_PUBLIC_SITE_URL?new URL(process.env.NEXT_PUBLIC_SITE_URL).origin:url.origin;
 if(authError){const target=new URL('/login',configuredOrigin);target.searchParams.set('auth_error',authError);return NextResponse.redirect(target)}
 if(code){
  const supabase=await createClient();
  if(supabase){
   const {error}=await supabase.auth.exchangeCodeForSession(code);
   if(!error)return NextResponse.redirect(new URL('/',configuredOrigin));
   const target=new URL('/login',configuredOrigin);target.searchParams.set('auth_error','Google hesabı doğrulandı ancak oturum açılamadı. Yeniden deneyin.');return NextResponse.redirect(target);
  }
 }
 const target=new URL('/login',configuredOrigin);target.searchParams.set('auth_error','Giriş doğrulanamadı. Google ve Supabase yönlendirme ayarlarını kontrol edin.');return NextResponse.redirect(target);
}
