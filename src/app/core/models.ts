export interface NavItem {
  id: string;
  label: string;
}

export interface Service {
  number: string;
  title: string;
  summary: string;
  detail: string;
  includes: readonly string[];
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  deliverables: readonly string[];
}

export type ProjectVisual = 'web' | 'mobile' | 'flow';

export interface Project {
  number: string;
  name: string;
  category: string;
  description: string;
  technologies: readonly string[];
  visual: ProjectVisual;
  /** Optional cover image (path under /public). Falls back to the coded visual. */
  image?: string;
  /** Optional link to a case study, rendered only when it exists. */
  url?: string;
}

export type TechCategory = 'Frontend' | 'Backend' | 'Database' | 'Cloud' | 'DevOps' | 'Design';

export interface Technology {
  name: string;
  short: string;
  category: TechCategory;
}

export interface TeamMember {
  initials: string;
  name: string;
  discipline: 'Engineering' | 'Design';
  roles: readonly string[];
  bio: string;
  focus: readonly string[];
}
