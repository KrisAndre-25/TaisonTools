import { Component, signal } from '@angular/core';
import { SERVICES } from '../../core/content';
import { Icon } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHead } from '../../shared/section-head/section-head';

@Component({
  selector: 'tt-services',
  imports: [Icon, RevealDirective, SectionHead],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  protected readonly services = SERVICES;
  protected readonly open = signal(0);

  protected toggle(index: number): void {
    this.open.set(this.open() === index ? -1 : index);
  }

  /** On pointer devices, hovering a row previews it. */
  protected preview(event: PointerEvent, index: number): void {
    if (event.pointerType === 'mouse') this.open.set(index);
  }
}
