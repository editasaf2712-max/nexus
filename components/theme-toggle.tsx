'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
export default function ThemeToggle(){
 const [dark,setDark]=useState(false);
 useEffect(()=>{const v=localStorage.getItem('nexus-theme')==='dark';setDark(v);document.documentElement.classList.toggle('dark',v)},[]);
 function toggle(){const v=!dark;setDark(v);localStorage.setItem('nexus-theme',v?'dark':'light');document.documentElement.classList.toggle('dark',v)}
 return <button className="icon-button" aria-label="Temayı değiştir" onClick={toggle}>{dark?<Sun size={16}/>:<Moon size={16}/>}</button>
}
