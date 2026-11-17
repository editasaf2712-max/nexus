'use client';
import { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ThemeToggle from './theme-toggle';
export default function Header(){
 const [query,setQuery]=useState('');const router=useRouter();
 function search(e:React.FormEvent){e.preventDefault();const q=query.trim();if(q)router.push(`/explore?q=${encodeURIComponent(q)}`)}
 return <header className="topbar"><form className="search" onSubmit={search}><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nexus'ta ara..." aria-label="Nexus'ta ara"/><button type="submit" style={{border:0,background:'transparent',color:'#b1b4bf',fontSize:10,cursor:'pointer'}}>Ara</button></form><div style={{display:'flex',gap:10,alignItems:'center'}}><ThemeToggle/><Link className="icon-button" href="/notifications" aria-label="Bildirimler"><Bell size={16}/></Link><Link href="/login" className="avatar" style={{textDecoration:'none'}}>G</Link></div></header>
}
