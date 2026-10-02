/**
 * @BAUTO_REFACTOR 2026-10-02
 * @Modulo: WEB (Vercel Headless) - Bloque 4: Filosofía de Marca
 * @Propósito: Manifiesto editorial sobre Cuerpo consciente, Movimiento del trópico y Tejido de reciprocidad bajo estética Quiet Luxury y Sentence case.
 * @Capa: Estética / Funcional
 * @Riesgo_Evaluado: Controlado
 */

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
 title: 'Filosofía y manifiesto | BAUTO Resort Wear',
 description:
 'Cuerpo consciente, movimiento del trópico y tejido de reciprocidad. Nuestra filosofía de confección en Santa Marta con fibras nobles.',
};

export default function FilosofiaPage() {
 const pillars = [
 {
 num: '01',
 eyebrow: 'Ergonomía y sensación',
 title: 'Cuerpo consciente',
 desc: 'Diseñamos prendas para habitar sin rigidez ni artificio. Cada patrón nace con una holgura generosa que respeta el reposo y la respiración de la piel. En un mundo saturado de fibras sintéticas y siluetas opresivas, BAUTO reivindica el contacto directo con fibras vivas: lino puro, algodones nobles y rayones fluidos que se adaptan con gracia al calor costero.',
 },
 {
 num: '02',
 eyebrow: 'El elogio de la arruga noble',
 title: 'Movimiento del trópico',
 desc: 'La arruga en las fibras nobles no es un descuido, sino la firma inequívoca de su pureza orgánica. El tejido dialoga con el viento, acompaña el paso sereno y guarda la memoria de un día vivido frente al mar. Nuestras siluetas son térmicamente inteligentes: conservan el frescor bajo el sol caribeño y acogen el cuerpo con templanza cuando arrecia la brisa nocturna.',
 },
 {
 num: '03',
 eyebrow: 'Taller propio y tirajes ínfimos',
 title: 'Tejido de reciprocidad',
 desc: 'Rechazamos de raíz la sobreproducción masiva. Cortamos y confeccionamos piezas en lotes diminutos de una a tres unidades por talla en nuestro atelier de Santa Marta. Cada acabado es inspeccionado con manos artesanas y cada prenda se perfuma antes de su viaje, creando un pacto silencioso de durabilidad y respeto entre quien confecciona y quien viste.',
 },
 ];

 return (
 <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24 sm:py-32 animate-fade-in">
 
 {/* Encabezado editorial */}
 <div className="text-center max-w-2xl mx-auto mb-20">
 <span className="text-[10px] tracking-[0.3em] uppercase text-bauto-piedra font-normal block mb-3">
 Manifiesto BAUTO
 </span>
 <h1 className="font-light text-3xl sm:text-5xl text-bauto-carbon mb-6 tracking-wide leading-tight">
 Cuerpo consciente y el movimiento del trópico
 </h1>
 <p className="italic text-base sm:text-lg text-bauto-piedra leading-relaxed">
 Prendas creadas para habitar el Caribe sin prisas, con holgura serena y en íntima sintonía con la brisa.
 </p>
 </div>

 {/* Los tres pilares canónicos */}
 <div className=" border-t ">
 {pillars.map((pillar) => (
 <article key={pillar.num} className="py-12 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-start">
 <div className="md:col-span-3">
 <span className="font-light text-4xl sm:text-5xl text-bauto-piedra/40 block mb-2">
 {pillar.num}
 </span>
 <span className="text-[10px] uppercase tracking-[0.2em] text-bauto-piedra block font-normal">
 {pillar.eyebrow}
 </span>
 </div>

 <div className="md:col-span-9">
 <h2 className="font-light text-2xl sm:text-3xl text-bauto-carbon mb-4 tracking-wide">
 {pillar.title}
 </h2>
 <p className="text-sm text-bauto-piedra leading-relaxed">
 {pillar.desc}
 </p>
 </div>
 </article>
 ))}
 </div>

 {/* Llamado a la acción */}
 <div className="mt-20 text-center">
 <Link
 href="/catalogo"
 className="inline-flex items-center gap-3 px-8 py-4 bg-bauto-carbon text-bauto-nube hover:bg-bauto-carbon-soft transition-opacity hover:opacity-80 active:scale-[0.97] text-xs font-sans font-medium"
 >
 <span>Explorar siluetas de autor</span>
 <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
 </Link>
 </div>

 </div>
 );
}
