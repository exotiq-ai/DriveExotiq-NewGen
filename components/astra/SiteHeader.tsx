'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Emblem from '@/components/ui/Emblem';
import Arrow from './Arrow';
const links = [{ label:'The drives',href:'/drives' },{ label:'The roadbook',href:'/tour' },{ label:'The garage',href:'/marketplace' },{ label:'The journal',href:'/blog' }];
export default function SiteHeader() {
  const pathname=usePathname();
  const dialog=useRef<HTMLDialogElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  const [open,setOpen]=useState(false);
  const [ready,setReady]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>setReady(true),[]);
  useEffect(()=>{ const onScroll=()=>setScrolled(window.scrollY>40); onScroll(); window.addEventListener('scroll',onScroll,{passive:true}); return()=>window.removeEventListener('scroll',onScroll); },[]);
  useEffect(()=>{ dialog.current?.close(); setOpen(false); },[pathname]);
  useEffect(()=>{ if(!open)return; const previous=document.body.style.overflow; document.body.style.overflow='hidden'; return()=>{document.body.style.overflow=previous;}; },[open]);
  function close(){ dialog.current?.close(); }
  return <>
    <a className="astra-skip" href="#main-content">Skip to content</a>
    <header className={`astra-header${scrolled?' is-scrolled':''}`} data-page={pathname==='/apply'?'apply':undefined}>
      <Link className="astra-brand" href="/" aria-label="driveexotiq home"><Emblem className="astra-emblem"/><span>drive<span className="astra-brand-light">exotiq</span></span></Link>
      <nav className="astra-desktop-nav" aria-label="Main navigation">{links.map(link=><Link key={link.href} href={link.href} aria-current={pathname===link.href?'page':undefined}>{link.label}</Link>)}</nav>
      <div className="astra-header-actions"><Link className="astra-header-cta" href="/apply?interest=drives">Get on the list <Arrow/></Link><button ref={trigger} disabled={!ready} className="astra-menu-trigger" aria-label="Open navigation" aria-expanded={open} aria-controls="astra-navigation" onClick={()=>{dialog.current?.showModal();setOpen(true);}}><span/><span/></button></div>
    </header>
    <dialog id="astra-navigation" ref={dialog} className="astra-menu" aria-label="Site navigation" onClose={()=>{setOpen(false);trigger.current?.focus();}} onClick={event=>{if(event.target===dialog.current)close();}}>
      <div className="astra-menu-top"><span className="astra-eyebrow">DRIVE EXOTIQ · EXPLORE</span><button className="astra-menu-close" onClick={close} aria-label="Close navigation">×</button></div>
      <nav aria-label="Mobile navigation">{links.map((link,index)=><Link href={link.href} onClick={close} key={link.href}><span className="astra-menu-number" aria-hidden="true">0{index+1}</span>{link.label}<Arrow/></Link>)}<Link href="/sponsor" onClick={close}><span className="astra-menu-number" aria-hidden="true">05</span>Partnerships<Arrow/></Link></nav>
      <div className="astra-menu-bottom"><p>Good cars.<br/><em>Better company.</em></p><Link className="astra-button" href="/apply?interest=drives" onClick={close}>Get on the list <Arrow/></Link></div>
    </dialog>
  </>;
}
