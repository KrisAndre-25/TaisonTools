import { Component, DestroyRef, afterNextRender, inject } from '@angular/core';
import { NAV_ITEMS } from '../../core/content';
import { About } from '../../sections/about/about';
import { Contact } from '../../sections/contact/contact';
import { Duo } from '../../sections/duo/duo';
import { Hero } from '../../sections/hero/hero';
import { Process } from '../../sections/process/process';
import { Projects } from '../../sections/projects/projects';
import { Services } from '../../sections/services/services';
import { Stack } from '../../sections/stack/stack';
import { ScrollService } from '../../shared/scroll.service';

/** Narrative order: who we are → what we do → how → what we build → who → let's talk. */
@Component({
  selector: 'tt-home',
  imports: [Hero, Services, Duo, Process, Projects, Stack, About, Contact],
  template: `
    <tt-hero />
    <tt-services />
    <tt-duo />
    <tt-process />
    <tt-projects />
    <tt-stack />
    <tt-about />
    <tt-contact />
  `,
  styles: `
    :host {
      display: block;
      position: relative;
      z-index: 1;
    }
  `,
})
export class Home {
  constructor() {
    const scroll = inject(ScrollService);
    const destroyRef = inject(DestroyRef);

    // Sections exist only once this page has rendered, so the header's scroll-spy starts here.
    afterNextRender(() => {
      const stop = scroll.trackSections(NAV_ITEMS.map((item) => item.id));
      destroyRef.onDestroy(stop);
    });
  }
}
