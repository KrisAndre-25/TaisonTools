import {
  NavItem,
  ProcessStep,
  Project,
  Service,
  TeamMember,
  TechCategory,
  Technology,
} from './models';

export const BRAND = {
  name: 'TaisonTools',
  tagline: 'Engineering × Design',
  location: 'Santiago, Chile',
  email: 'contacto@taisontools.com',
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'proceso', label: 'Proceso' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'contacto', label: 'Contacto' },
];

export const SERVICES: readonly Service[] = [
  {
    number: '01',
    title: 'Software',
    summary: 'Aplicaciones y plataformas a medida.',
    detail:
      'Sistemas construidos alrededor de cómo trabaja tu equipo, no al revés. Arquitectura pensada para crecer sin reescribirse.',
    includes: ['Arquitectura', 'Frontend', 'Backend', 'Bases de datos'],
  },
  {
    number: '02',
    title: 'Web',
    summary: 'Sitios y experiencias digitales modernas.',
    detail:
      'Sitios rápidos, accesibles y fáciles de mantener. Desde una landing page hasta un sitio con contenido administrable.',
    includes: ['Landing pages', 'Sitios corporativos', 'SEO técnico', 'Performance'],
  },
  {
    number: '03',
    title: 'UX/UI',
    summary: 'Interfaces centradas en las personas que las usan.',
    detail:
      'Investigamos, prototipamos y probamos antes de escribir código. El diseño llega al desarrollo listo para construirse.',
    includes: ['Investigación', 'Wireframes', 'Prototipos', 'Design systems'],
  },
  {
    number: '04',
    title: 'Soluciones digitales',
    summary: 'Herramientas para necesidades concretas.',
    detail:
      'Cuando una planilla ya no alcanza: herramientas internas, paneles y utilidades que resuelven un problema específico.',
    includes: ['Herramientas internas', 'Integraciones', 'Paneles de gestión'],
  },
  {
    number: '05',
    title: 'Automatización',
    summary: 'Procesos digitalizados y optimizados.',
    detail:
      'Identificamos tareas repetitivas y las convertimos en flujos automáticos: reportes, notificaciones, sincronización de datos.',
    includes: ['Flujos automáticos', 'Reportes', 'APIs', 'Scripts'],
  },
  {
    number: '06',
    title: 'Productos digitales',
    summary: 'De la idea inicial a una solución funcional.',
    detail:
      'Acompañamos todo el recorrido: definir el problema, diseñar la experiencia, construir una primera versión y mejorarla.',
    includes: ['Descubrimiento', 'MVP', 'Branding digital', 'Iteración'],
  },
];

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    number: '01',
    title: 'Descubrimos',
    description:
      'Entendemos el problema antes de proponer una solución. Conversamos sobre objetivos, usuarios y restricciones técnicas.',
    deliverables: ['Objetivos', 'Alcance', 'Requisitos'],
  },
  {
    number: '02',
    title: 'Diseñamos',
    description:
      'Definimos flujos, estructura e interfaz. Cada decisión visual se revisa también desde su viabilidad técnica.',
    deliverables: ['Wireframes', 'UI', 'Prototipo'],
  },
  {
    number: '03',
    title: 'Desarrollamos',
    description:
      'Construimos sobre el diseño aprobado, con entregas parciales para que veas el avance real y no solo un informe.',
    deliverables: ['Frontend', 'Backend', 'Pruebas'],
  },
  {
    number: '04',
    title: 'Implementamos',
    description:
      'Publicamos, medimos y ajustamos. Dejamos documentación para que el producto pueda seguir creciendo.',
    deliverables: ['Despliegue', 'Documentación', 'Soporte'],
  },
];

export const PROJECTS: readonly Project[] = [
  {
    number: '01',
    name: 'Agenda',
    category: 'Aplicación web · Concepto',
    description:
      'Plataforma para que negocios de servicios gestionen reservas, clientes y disponibilidad desde un solo lugar.',
    technologies: ['Angular', 'Spring Boot', 'PostgreSQL'],
    visual: 'web',
  },
  {
    number: '02',
    name: 'Ruta',
    category: 'Producto mobile-first · Concepto',
    description:
      'Seguimiento de pedidos pensado primero para el teléfono: estados claros, pocas pantallas y notificaciones útiles.',
    technologies: ['React', 'Node.js', 'Figma'],
    visual: 'mobile',
  },
  {
    number: '03',
    name: 'Flujo',
    category: 'Automatización · Concepto',
    description:
      'Generación automática de reportes a partir de distintas fuentes de datos, sin copiar y pegar entre planillas.',
    technologies: ['Node.js', 'Docker', 'AWS'],
    visual: 'flow',
  },
];

export const TECH_CATEGORIES: readonly TechCategory[] = [
  'Frontend',
  'Backend',
  'Database',
  'Cloud',
  'DevOps',
  'Design',
];

export const TECHNOLOGIES: readonly Technology[] = [
  { name: 'Angular', short: 'Ng', category: 'Frontend' },
  { name: 'React', short: 'Re', category: 'Frontend' },
  { name: 'TypeScript', short: 'Ts', category: 'Frontend' },
  { name: 'Java', short: 'Jv', category: 'Backend' },
  { name: 'Spring Boot', short: 'Sb', category: 'Backend' },
  { name: 'Node.js', short: 'Nd', category: 'Backend' },
  { name: 'PostgreSQL', short: 'Pg', category: 'Database' },
  { name: 'AWS', short: 'Aw', category: 'Cloud' },
  { name: 'Docker', short: 'Dk', category: 'DevOps' },
  { name: 'Git', short: 'Gt', category: 'DevOps' },
  { name: 'Figma', short: 'Fg', category: 'Design' },
];

export const TEAM: readonly TeamMember[] = [
  {
    initials: 'KA',
    name: 'Kristopher Astudillo',
    discipline: 'Engineering',
    roles: [
      'Full-Stack Developer',
      'Analista Programador',
      'Estudiante de Ingeniería en Informática',
    ],
    bio: 'Se encarga de que las ideas funcionen: arquitectura, frontend, backend y la automatización de lo que se repite.',
    focus: ['Frontend', 'Backend', 'Arquitectura', 'Automatización'],
  },
  {
    initials: 'RC',
    name: 'Rodrigo Contador',
    discipline: 'Design',
    roles: ['Diseñador Gráfico', 'UX/UI Designer'],
    bio: 'Se encarga de que las ideas se entiendan: interfaces, experiencia de usuario, identidad visual y comunicación.',
    focus: ['UX/UI', 'Interfaces', 'Branding', 'Comunicación digital'],
  },
];
