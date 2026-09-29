import { JournalPost } from '../types/journal';

export const journalPosts: JournalPost[] = [
  {
    slug: 'el-cuidado-del-lino-puro',
    title: 'El cuidado del lino puro en el trópico',
    date: '2026-09-28',
    excerpt: 'Una guía de nuestro taller para preservar la nobleza, el color y la caída de las fibras naturales frente a la brisa y el sol del Caribe.',
    coverImage: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?auto=format&fit=crop&q=80',
    content: `
      <p>El lino es una fibra viva. A diferencia de los materiales sintéticos que intentan dominar el cuerpo, el lino puro respira con él, adaptándose a la temperatura y la humedad del trópico.</p>
      
      <h3>La arruga noble</h3>
      <p>Existe una profunda elegancia en la imperfección natural del lino. En BAUTO, creemos que la arruga no es un defecto que deba plancharse hasta el extremo, sino la firma de autenticidad de una fibra que no ha sido alterada químicamente.</p>
      
      <h3>Rituales de lavado y secado</h3>
      <p>Recomendamos lavar nuestras prendas a mano con jabón neutro, o en un ciclo muy delicado con agua fría. El calor artificial rompe las fibras y debilita la caída. Seca tus prendas a la sombra, permitiendo que la brisa haga el trabajo que las máquinas aceleran innecesariamente.</p>
      
      <h3>Almacenamiento</h3>
      <p>El lino necesita espacio para respirar. Evita el plástico y utiliza fundas de algodón si vas a guardar la prenda por temporadas largas. El trópico exige libertad, y nuestras prendas también.</p>
    `
  },
  {
    slug: 'siluetas-del-tropico',
    title: 'Siluetas para habitar el calor',
    date: '2026-09-15',
    excerpt: 'Cómo diseñamos prendas que otorgan libertad de movimiento y celebran el clima de Santa Marta sin sacrificar la elegancia.',
    coverImage: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80',
    content: `
      <p>La brisa en Santa Marta dicta la forma en que habitamos el espacio y transitamos las calles del centro histórico. En BAUTO, cada silueta se diseña pensando en la circulación del aire y la ligereza de la caída.</p>
      
      <h3>Espacio entre el cuerpo y la tela</h3>
      <p>El lujo silencioso en climas cálidos se traduce en confort. Evitamos las prendas restrictivas o las cinturas que castigan el cuerpo. Una caída fluida no solo es estéticamente superior en movimiento, sino funcionalmente necesaria cuando el sol está en el cenit.</p>
      
      <h3>Paleta inspirada en la tierra</h3>
      <p>Nuestros colores (terracota ancestral, arena pálida, musgo sereno y mar océano) son extraídos directamente del paisaje que rodea nuestro taller. No teñimos la tela para destacar artificialmente, teñimos para pertenecer al entorno.</p>
      
      <h3>La prueba de la brisa</h3>
      <p>Antes de aprobar una nueva silueta, la prenda debe someterse a la prueba de la brisa en el Camellón. Si la tela no baila con el viento o si la estructura limita el paso largo, el diseño vuelve a la mesa de corte.</p>
    `
  }
];

export function getAllPosts(): JournalPost[] {
  return journalPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): JournalPost | undefined {
  return journalPosts.find(p => p.slug === slug);
}
