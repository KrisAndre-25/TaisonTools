import { Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';

interface Discipline {
  key: 'engineering' | 'design';
  label: string;
  statement: string;
  person: string;
  role: string;
  practices: readonly string[];
  note: string;
}

@Component({
  selector: 'tt-duo',
  imports: [RevealDirective],
  templateUrl: './duo.html',
  styleUrl: './duo.scss',
})
export class Duo {
  protected readonly disciplines: readonly Discipline[] = [
    {
      key: 'engineering',
      label: 'Engineering',
      statement: 'Que funcione, escale y se pueda mantener.',
      person: 'Kristopher',
      role: 'Full-Stack Developer',
      practices: ['Arquitectura', 'Frontend', 'Backend', 'Automatización'],
      note: 'build(design) → producto',
    },
    {
      key: 'design',
      label: 'Design',
      statement: 'Que se entienda, se vea bien y sea fácil de usar.',
      person: 'Rodrigo',
      role: 'Diseñador Gráfico · UX/UI',
      practices: ['Interfaces', 'Experiencia de usuario', 'Branding', 'Comunicación'],
      note: 'design(idea) → interfaz',
    },
  ];

  protected readonly overlap: readonly string[] = [
    'Prototipos que ya consideran cómo se van a programar.',
    'Código que respeta cada decisión de diseño.',
    'Una sola conversación en lugar de dos proveedores.',
  ];
}
