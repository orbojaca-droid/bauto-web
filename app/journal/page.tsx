/**
 * @BAUTO_REFACTOR 2026-09-29
 * @Modulo: WEB - Rama 12: Journal Editorial
 * @Capa: Frontend (Vercel)
 */

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '../../lib/journal';

export const metadata: Metadata = {
 title: 'Journal | BAUTO',
 description: 'Journal editorial sobre diseño, fibras nobles y el estilo de vida del Caribe colombiano.',
};

export default function JournalIndexPage() {
 const posts = getAllPosts();

 return (
 <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-24 md:py-32 animate-fade-in">
 <header className="text-center mb-16 sm:mb-24">
 <span className="text-[11px] tracking-[0.25em] uppercase text-bauto-piedra font-normal block mb-4">
 Nuestra visión
 </span>
 <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-bauto-carbon mb-6">
 Journal
 </h1>
 <p className="italic text-bauto-piedra text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
 Reflexiones desde Santa Marta sobre diseño consciente, fibras nobles y la elegancia del trópico.
 </p>
 </header>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 lg:gap-20">
 {posts.map(post => (
 <article key={post.slug} className="group cursor-pointer flex flex-col">
 <Link href={`/journal/${post.slug}`}>
 <div className="relative aspect-[4/3] w-full overflow-hidden bg-bauto-perla mb-6">
 <img 
 src={post.coverImage} 
 alt={post.title} 
 loading="lazy"
 className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-105"
 />
 </div>
 <time className="text-[11px] uppercase tracking-widest text-bauto-piedra mb-3 block">
 {new Date(post.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
 </time>
 <h2 className="text-2xl font-light text-bauto-carbon mb-3 group-hover:text-bauto-terracota transition-colors">
 {post.title}
 </h2>
 <p className="text-sm text-bauto-carbon/70 leading-relaxed font-light">
 {post.excerpt}
 </p>
 </Link>
 </article>
 ))}
 </div>
 </div>
 );
}
