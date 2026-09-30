/**
 * @BAUTO_REFACTOR 2026-09-29
 * @Modulo: WEB - Rama 12: Journal Editorial (Lectura)
 * @Capa: Frontend (Vercel)
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '../../../lib/journal';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
 const posts = getAllPosts();
 return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
 const post = getPostBySlug(params.slug);
 if (!post) return { title: 'Lectura no encontrada | BAUTO' };
 return { title: `${post.title} | Journal`, description: post.excerpt };
}

export default function JournalPostPage({ params }: { params: { slug: string } }) {
 const post = getPostBySlug(params.slug);
 if (!post) notFound();

 return (
 <article className="animate-fade-in pb-24">
 {/* Cabecera del artículo */}
 <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 pt-12 pb-10">
 <Link href="/journal" className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-bauto-piedra hover:text-bauto-carbon transition-colors mb-16">
 <ArrowLeft className="w-3.5 h-3.5 mr-3" />
 Volver al Journal
 </Link>
 <header className="text-center mb-10">
 <time className="font-editorial italic text-bauto-piedra text-sm sm:text-base mb-6 block">
 {new Date(post.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
 </time>
 <h1 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-bauto-carbon mb-8 leading-[1.15]">
 {post.title}
 </h1>
 <p className="text-sm sm:text-base text-bauto-carbon/70 font-light max-w-xl mx-auto leading-relaxed">
 {post.excerpt}
 </p>
 </header>
 </div>

 {/* Imagen Hero */}
 <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 mb-16 sm:mb-24">
 <div className="relative aspect-[4/3] sm:aspect-[21/9] w-full overflow-hidden bg-bauto-perla">
 <img 
 src={post.coverImage} 
 alt={post.title} 
 className="object-cover w-full h-full"
 />
 </div>
 </div>

 {/* Cuerpo del Artículo */}
 <div className="max-w-2xl mx-auto px-6 sm:px-8 lg:px-12">
 <div 
 className="prose prose-bauto prose-p:font-light prose-p:leading-[1.8] prose-p:text-bauto-carbon/80 prose-headings:font-title prose-headings:font-light prose-headings:text-bauto-carbon prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-a:text-bauto-terracota hover:prose-a:text-bauto-carbon transition-colors"
 dangerouslySetInnerHTML={{ __html: post.content }} 
 />
 
 {/* Separador final de firma */}
 <div className="mt-20 pt-10 flex justify-center">
 <span className="font-editorial italic text-bauto-piedra text-lg">BAUTO Studio, Santa Marta.</span>
 </div>
 </div>
 </article>
 );
}
