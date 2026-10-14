import { Component, DOCUMENT, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { HexField } from '../../shared/hex-field/hex-field';
import { Icon } from '../../shared/icon';
import { Logo } from '../../shared/logo/logo';
import { RevealDirective } from '../../shared/reveal.directive';
import { ScrollService } from '../../shared/scroll.service';
import { StaggeredText } from '../../shared/staggered-text/staggered-text';

@Component({
  selector: 'tt-hero',
  imports: [HexField, Icon, Logo, RevealDirective, StaggeredText],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly scroll = inject(ScrollService);

  /** True once the page has scrolled past a third of the first screen. */
  protected readonly away = signal(false);

  constructor() {
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const win = document.defaultView;
      if (!win) return;
      const onScroll = () => this.away.set(win.scrollY > win.innerHeight / 3);
      onScroll();
      win.addEventListener('scroll', onScroll, { passive: true });
      destroyRef.onDestroy(() => win.removeEventListener('scroll', onScroll));
    });
  }

  protected navigate(event: Event, id: string): void {
    event.preventDefault();
    this.scroll.scrollTo(id);
  }
}
