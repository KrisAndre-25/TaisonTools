import { Component, inject } from '@angular/core';
import { PROJECTS } from '../../core/content';
import { Icon } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';
import { ScrollService } from '../../shared/scroll.service';
import { SectionHead } from '../../shared/section-head/section-head';
import { ProjectVisual } from './project-visual';

@Component({
  selector: 'tt-projects',
  imports: [Icon, ProjectVisual, RevealDirective, SectionHead],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  private readonly scroll = inject(ScrollService);
  protected readonly projects = PROJECTS;

  protected navigate(event: Event, id: string): void {
    event.preventDefault();
    this.scroll.scrollTo(id);
  }
}
