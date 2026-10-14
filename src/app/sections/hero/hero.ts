import {
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { Icon } from '../../shared/icon';
import { Logo } from '../../shared/logo/logo';
import { ScrollService } from '../../shared/scroll.service';
import { ViewportService } from '../../shared/viewport.service';

interface Phase {
  number: string;
  key: 'design' | 'develop' | 'deploy';
  label: string;
  caption: string;
}

const PHASE_MS = 3600;

@Component({
  selector: 'tt-hero',
  imports: [Icon, Logo],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly scroll = inject(ScrollService);

  protected readonly phases: readonly Phase[] = [
    { number: '01', key: 'design', label: 'Design', caption: 'Se diseña' },
    { number: '02', key: 'develop', label: 'Develop', caption: 'Se construye' },
    { number: '03', key: 'deploy', label: 'Deploy', caption: 'Se publica' },
  ];
  protected readonly phase = signal(0);
  protected readonly autoplay = signal(false);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const viewport = inject(ViewportService);
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);

    // Cycle the phases slowly, only while the hero is on screen and motion is allowed.
    afterNextRender(() => {
      if (viewport.reducedMotion) return;
      let timer: ReturnType<typeof setInterval> | undefined;

      const stopObserving = viewport.observe(
        host,
        (entry) => {
          clearInterval(timer);
          this.autoplay.set(entry.isIntersecting);
          if (!entry.isIntersecting) return;
          timer = setInterval(() => {
            if (!document.hidden) this.next();
          }, PHASE_MS);
        },
        '0px',
      );

      destroyRef.onDestroy(() => {
        clearInterval(timer);
        stopObserving();
      });
    });
  }

  protected select(index: number): void {
    this.autoplay.set(false);
    this.phase.set(index);
  }

  protected navigate(event: Event, id: string): void {
    event.preventDefault();
    this.scroll.scrollTo(id);
  }

  private next(): void {
    if (!this.autoplay()) return;
    this.phase.update((current) => (current + 1) % this.phases.length);
  }
}
