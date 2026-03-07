export interface Victim {
  id: string;
  name: string;
  photo: string;
  dateOfDisappearance: string;
  municipality: string;
  searchStatus: 'searching' | 'found' | 'identified';
  biography?: string;
  age?: number;
  location?: {
    lat: number;
    lng: number;
  };
  testimonies?: Testimony[];
  gallery?: string[];
}

export interface Testimony {
  id: string;
  author: string;
  role: string;
  content: string;
  type: 'video' | 'audio' | 'text';
  mediaUrl?: string;
  date: string;
}

export interface MemoryPlace {
  id: string;
  name: string;
  type: 'disappearance' | 'encounter' | 'memorial';
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  victims?: string[];
}

export interface Event {
  id: string;
  title: string;
  type: 'commemoration' | 'workshop' | 'dialogue';
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'historical' | 'search' | 'sanctuary';
}

export const mockVictims: Victim[] = [
  {
    id: '1',
    name: 'Carlos Alberto Ramírez',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    dateOfDisappearance: '2003-05-15',
    municipality: 'Samaná',
    searchStatus: 'searching',
    age: 42,
    biography: 'Líder comunitario y defensor de derechos humanos. Carlos dedicó su vida a trabajar por la paz y el desarrollo rural en Samaná. Era padre de tres hijos y esposo devoto.',
    location: { lat: 5.4161, lng: -75.0089 },
    gallery: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop'
    ]
  },
  {
    id: '2',
    name: 'María Elena Gómez',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    dateOfDisappearance: '2005-08-22',
    municipality: 'Samaná',
    searchStatus: 'found',
    age: 35,
    biography: 'Maestra de escuela rural y activista social. María Elena dedicó su vida a la educación de los niños en las veredas más alejadas del municipio.',
    location: { lat: 5.4200, lng: -75.0150 }
  },
  {
    id: '3',
    name: 'José Fernando Méndez',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    dateOfDisappearance: '2007-03-10',
    municipality: 'Samaná',
    searchStatus: 'searching',
    age: 28,
    biography: 'Joven campesino y líder juvenil. José Fernando trabajaba por mejorar las condiciones de vida de las comunidades rurales.',
    location: { lat: 5.4100, lng: -75.0200 }
  },
  {
    id: '4',
    name: 'Ana Lucía Torres',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    dateOfDisappearance: '2004-11-30',
    municipality: 'Samaná',
    searchStatus: 'identified',
    age: 38,
    biography: 'Enfermera comunitaria que brindó atención médica en zonas rurales durante años.',
    location: { lat: 5.4250, lng: -75.0100 }
  },
  {
    id: '5',
    name: 'Pedro Antonio Silva',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    dateOfDisappearance: '2006-07-18',
    municipality: 'Samaná',
    searchStatus: 'searching',
    age: 45,
    biography: 'Agricultor y padre de familia, reconocido por su trabajo comunitario.',
    location: { lat: 5.4180, lng: -75.0120 }
  },
  {
    id: '6',
    name: 'Luz Marina Cardona',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    dateOfDisappearance: '2008-01-25',
    municipality: 'Samaná',
    searchStatus: 'searching',
    age: 32,
    biography: 'Comerciante y madre de dos hijos, conocida por su alegría y solidaridad.',
    location: { lat: 5.4220, lng: -75.0180 }
  }
];

export const mockTestimonies: Testimony[] = [
  {
    id: '1',
    author: 'Rosa María Ramírez',
    role: 'Esposa de víctima',
    content: 'Carlos era un hombre bueno, siempre pensando en ayudar a los demás. Llevamos 20 años buscándolo y no perderemos la esperanza de encontrarlo. Sus hijos merecen saber qué pasó con su padre.',
    type: 'text',
    date: '2024-03-15'
  },
  {
    id: '2',
    author: 'Juan Carlos Pérez',
    role: 'Líder comunitario',
    content: 'La desaparición de María Elena dejó un vacío enorme en nuestra comunidad. Era una maestra extraordinaria que inspiraba a todos los niños. Su memoria vive en cada uno de ellos.',
    type: 'text',
    date: '2024-02-10'
  },
  {
    id: '3',
    author: 'Gloria Méndez',
    role: 'Madre de víctima',
    content: 'Mi hijo José era un joven lleno de vida y esperanza. Trabajaba por un futuro mejor para todos. No descansaré hasta saber la verdad sobre lo que le sucedió.',
    type: 'text',
    date: '2024-01-20'
  }
];

export const mockMemoryPlaces: MemoryPlace[] = [
  {
    id: '1',
    name: 'Puente del Recuerdo',
    type: 'disappearance',
    location: { lat: 5.4161, lng: -75.0089 },
    description: 'Último lugar donde fue visto Carlos Alberto Ramírez',
    victims: ['1']
  },
  {
    id: '2',
    name: 'Escuela Rural La Esperanza',
    type: 'memorial',
    location: { lat: 5.4200, lng: -75.0150 },
    description: 'Memorial en honor a María Elena Gómez',
    victims: ['2']
  },
  {
    id: '3',
    name: 'Plaza de la Memoria',
    type: 'memorial',
    location: { lat: 5.4150, lng: -75.0100 },
    description: 'Lugar de encuentro y conmemoración',
    victims: ['1', '2', '3', '4', '5', '6']
  },
  {
    id: '4',
    name: 'Camino de la Verdad',
    type: 'encounter',
    location: { lat: 5.4180, lng: -75.0120 },
    description: 'Punto de encuentro para diálogos comunitarios',
    victims: []
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Ceremonia de Conmemoración Anual',
    type: 'commemoration',
    date: '2026-05-15',
    time: '10:00 AM',
    location: 'Plaza de la Memoria, Samaná',
    description: 'Encuentro para honrar la memoria de las víctimas de desaparición forzada'
  },
  {
    id: '2',
    title: 'Taller: Diálogos para la Verdad',
    type: 'workshop',
    date: '2026-04-20',
    time: '2:00 PM',
    location: 'Casa de la Cultura, Samaná',
    description: 'Espacio de encuentro y diálogo entre familias y comunidad'
  },
  {
    id: '3',
    title: 'Plantación de Árboles de la Memoria',
    type: 'commemoration',
    date: '2026-06-10',
    time: '9:00 AM',
    location: 'Parque Central, Samaná',
    description: 'Actividad simbólica de siembra en memoria de las víctimas'
  },
  {
    id: '4',
    title: 'Círculo de Testimonios',
    type: 'dialogue',
    date: '2026-04-05',
    time: '4:00 PM',
    location: 'Santuario de la Memoria',
    description: 'Espacio seguro para compartir historias y testimonios'
  }
];

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '1990-2010',
    title: 'Período del Conflicto Armado',
    description: 'Años más álgidos del conflicto en la región del Magdalena Caldense',
    category: 'historical'
  },
  {
    id: '2',
    date: '2016',
    title: 'Acuerdo de Paz',
    description: 'Firma del Acuerdo Final para la Terminación del Conflicto en Colombia',
    category: 'historical'
  },
  {
    id: '3',
    date: '2023',
    title: 'Inicio Proyecto PRY-335',
    description: 'La Universidad de Caldas inicia el proyecto de memoria histórica',
    category: 'sanctuary'
  },
  {
    id: '4',
    date: '2024',
    title: 'Primera Fase de Búsqueda',
    description: 'Inicio de la búsqueda sistemática de víctimas en Samaná',
    category: 'search'
  },
  {
    id: '5',
    date: '2025',
    title: 'Creación del Santuario Digital',
    description: 'Lanzamiento de la plataforma digital de memoria',
    category: 'sanctuary'
  },
  {
    id: '6',
    date: '2026',
    title: 'Primer Encuentro de Familias',
    description: 'Reunión de familias de víctimas para diálogo y sanación',
    category: 'search'
  }
];

export const memoryStats = {
  victimsRegistered: 47,
  testimonies: 32,
  memoryPlaces: 12,
  events: 8
};
