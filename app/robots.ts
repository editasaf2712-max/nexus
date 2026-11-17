import type { MetadataRoute } from 'next';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/',disallow:['/admin','/messages','/settings']},sitemap:`${process.env.NEXT_PUBLIC_SITE_URL||'https://nexus.example'}/sitemap.xml`}}
