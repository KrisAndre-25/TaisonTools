import { Component, input } from '@angular/core';
import { ProjectVisual as Variant } from '../../core/models';

/** Coded, asset-free cover for a project: a stylised web, mobile or automation-flow mock. */
@Component({
  selector: 'tt-project-visual',
  templateUrl: './project-visual.html',
  styleUrl: './project-visual.scss',
  host: { 'aria-hidden': 'true', '[attr.data-variant]': 'variant()' },
})
export class ProjectVisual {
  readonly variant = input.required<Variant>();

  protected readonly calendar = Array.from({ length: 21 }, (_, i) => i);
  protected readonly booked = new Set([3, 4, 9, 12, 13, 17]);
}
