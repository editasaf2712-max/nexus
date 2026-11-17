'use client';
import { Search, Bell } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from './theme-toggle';
export default function Header(){return <header className="topbar"><label className="search"><Search size={16}/><input placeholder="Nexus'ta ara..." aria-label="Nexus'ta ara"/><span style={{fontSize:10,color:'#b1b4bf'}}>⌘ K</span></label><div style={{display:'flex',gap:10,alignItems:'center'}}><ThemeToggle/><Link className="icon-button" href="/notifications" aria-label="Bildirimler"><Bell size={16}/></Link><Link href="/login" className="avatar" style={{textDecoration:'none'}}>G</Link></div></header>}
