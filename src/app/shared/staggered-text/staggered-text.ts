import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ViewportService } from '../viewport.service';

export type StaggerBy = 'letter' | 'word' | 'line';

interface Word {
  text: string;
  letters: readonly string[];
}

/**
 * Text that staggers in by letter, word or line when it scrolls into view — each piece rises
 * out of its own mask, the same motion the rest of the site uses.
 *
 * Screen readers get the sentence once, as plain text; the split pieces are hidden from them.
 * Usage: <h1><tt-staggered-text text="Donde el código…" accent="." by="word" /></h1>
 */
@Component({
  selector: 'tt-staggered-text',
  template: `
    <span class="visually-hidden">{{ text() }}{{ accent() }}</span>
    <span class="st" aria-hidden="true">
      @for (word of words(); track $index; let w = $index; let last = $last) {
        <span class="st__word" [style.--i]="by() === 'word' ? w : null">
          @if (by() === 'letter') {
            @for (letter of word.letters; track $index; let l = $index) {
              <span class="st__mask"
                ><span class="st__piece" [style.--i]="letterOffset()[w] + l">{{ letter }}</span></span
              >
            }
          } @else {
            <span class="st__mask"><span class="st__piece">{{ word.text }}</span></span>
          }
          @if (last && accent()) {
            <span class="st__mask"
              ><span class="st__piece st__accent" [style.--i]="accentIndex()">{{
                accent()
              }}</span></span
            >
          }
        </span>
        @if (!last) {
          {{ ' ' }}
        }
      }
    </span>
  `,
  styleUrl: './staggered-text.scss',
  host: {
    '[class.is-in]': 'shown()',
    '[style.--stagger]': 'stagger() + "ms"',
    '[style.--delay]': 'delay() + "ms"',
  },
})
export class StaggeredText {
  readonly text = input.required<string>();
  /** Trailing mark drawn in the accent colour (e.g. the closing period). */
  readonly accent = input('');
  readonly by = input<StaggerBy>('word');
  /** Time between consecutive pieces, in ms. */
  readonly stagger = input(70);
  /** Wait before the first piece, in ms. */
  readonly delay = input(0);

  protected readonly shown = signal(false);

  protected readonly words = computed<Word[]>(() =>
    this.text()
      .trim()
      .split(/\s+/)
      .map((text) => ({ text, letters: [...text] })),
  );

  /** Index of the first letter of each word, so letters count on across the sentence. */
  protected readonly letterOffset = computed(() => {
    let count = 0;
    return this.words().map((word) => {
      const start = count;
      count += word.letters.length;
      return start;
    });
  });

  protected readonly accentIndex = computed(() => {
    if (this.by() === 'letter') return this.words().reduce((n, w) => n + w.letters.length, 0);
    return this.words().length;
  });

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const viewport = inject(ViewportService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      // Line mode: number each word by the visual line it landed on.
      let resize: ResizeObserver | undefined;
      if (this.by() === 'line') {
        const numberLines = () => {
          const words = [...host.querySelectorAll<HTMLElement>('.st__word')];
          const tops = [...new Set(words.map((w) => w.offsetTop))].sort((a, b) => a - b);
          words.forEach((w) => w.style.setProperty('--i', String(tops.indexOf(w.offsetTop))));
        };
        numberLines();
        if (typeof ResizeObserver !== 'undefined') {
          resize = new ResizeObserver(numberLines);
          resize.observe(host);
        }
      }

      const stop = viewport.observe(host, (entry) => {
        if (entry.isIntersecting) {
          this.shown.set(true);
          stop();
        }
      });

      destroyRef.onDestroy(() => {
        stop();
        resize?.disconnect();
      });
    });
  }
}
