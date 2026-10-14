import {
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { PROCESS_STEPS } from '../../core/content';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHead } from '../../shared/section-head/section-head';
import { ViewportService } from '../../shared/viewport.service';

@Component({
  selector: 'tt-process',
  imports: [RevealDirective, SectionHead],
  templateUrl: './process.html',
  styleUrl: './process.scss',
})
export class Process {
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly fill = viewChild.required<ElementRef<HTMLElement>>('fill');
  private readonly stepEls = viewChildren<ElementRef<HTMLElement>>('step');

  protected readonly steps = PROCESS_STEPS;
  protected readonly active = signal(0);

  constructor() {
    const document = inject(DOCUMENT);
    const viewport = inject(ViewportService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const win = document.defaultView;
      if (!win) return;
      let frame = 0;

      // Progress is written straight to the DOM; only the active step goes through a signal.
      const update = () => {
        frame = 0;
        const focusLine = win.innerHeight * 0.55;
        const rect = this.track().nativeElement.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (focusLine - rect.top) / rect.height));
        this.fill().nativeElement.style.transform = `scaleY(${progress})`;

        let current = 0;
        this.stepEls().forEach((el, i) => {
          if (el.nativeElement.getBoundingClientRect().top < focusLine) current = i;
        });
        if (current !== this.active()) this.active.set(current);
      };
      const onScroll = () => {
        if (!frame) frame = win.requestAnimationFrame(update);
      };

      // Only listen to scroll while the section is near the viewport.
      const stop = viewport.observe(
        this.track().nativeElement,
        (entry) => {
          if (entry.isIntersecting) {
            win.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
          } else {
            win.removeEventListener('scroll', onScroll);
          }
        },
        '20% 0px 20% 0px',
      );

      destroyRef.onDestroy(() => {
        stop();
        win.removeEventListener('scroll', onScroll);
        win.cancelAnimationFrame(frame);
      });
    });
  }
}
