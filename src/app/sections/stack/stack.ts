import { Component, computed, signal } from '@angular/core';
import { TECH_CATEGORIES, TECHNOLOGIES } from '../../core/content';
import { TechCategory } from '../../core/models';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHead } from '../../shared/section-head/section-head';

@Component({
  selector: 'tt-stack',
  imports: [RevealDirective, SectionHead],
  templateUrl: './stack.html',
  styleUrl: './stack.scss',
})
export class Stack {
  protected readonly technologies = TECHNOLOGIES;
  protected readonly categories = TECH_CATEGORIES.map((name) => ({
    name,
    count: TECHNOLOGIES.filter((t) => t.category === name).length,
  }));
  protected readonly selected = signal<TechCategory | null>(null);
  protected readonly summary = computed(() => {
    const category = this.selected();
    const count = category
      ? this.technologies.filter((t) => t.category === category).length
      : this.technologies.length;
    return `${count} tecnologías${category ? ' en ' + category : ''}`;
  });

  protected select(category: TechCategory | null): void {
    this.selected.set(this.selected() === category ? null : category);
  }
}
