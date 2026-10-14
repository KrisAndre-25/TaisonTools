import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { ViewportService } from './viewport.service';

export type RevealVariant = 'up' | 'left' | 'right' | 'scale' | 'fade' | 'clip';

/**
 * Scroll reveal. Styles live in styles/_motion.scss.
 * Usage: <div ttReveal="left" [revealDelay]="i * 80">
 */
@Directive({
  selector: '[ttReveal]',
  host: {
    '[attr.data-reveal]': 'ttReveal() || "up"',
    '[style.--reveal-delay]': 'revealDelay() + "ms"',
  },
})
export class RevealDirective {
  readonly ttReveal = input<RevealVariant | ''>('up');
  readonly revealDelay = input(0);

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const viewport = inject(ViewportService);
    let stop: () => void = () => undefined;

    afterNextRender(() => {
      stop = viewport.observe(element, (entry) => {
        if (entry.isIntersecting) {
          element.classList.add('is-revealed');
          stop();
        }
      });
    });

    inject(DestroyRef).onDestroy(() => stop());
  }
}
