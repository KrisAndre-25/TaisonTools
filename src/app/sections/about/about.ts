import { Component } from '@angular/core';
import { TEAM } from '../../core/content';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHead } from '../../shared/section-head/section-head';

@Component({
  selector: 'tt-about',
  imports: [RevealDirective, SectionHead],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly team = TEAM;
}
