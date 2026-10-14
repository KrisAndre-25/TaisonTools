import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';

const STORAGE_KEY = 'tt-contrast';
const THEME_COLOR = { normal: '#fafafa', high: '#000000' } as const;

/**
 * Contrast mode: turns the white page black with white ink. Starts from the visitor's
 * saved choice, or from the OS "increase contrast" setting, and is applied as
 * data-contrast="high" on <html>.
 */
@Injectable({ providedIn: 'root' })
export class ContrastService {
  private readonly document = inject(DOCUMENT);
  private readonly window = this.document.defaultView;

  readonly high = signal(this.initial());

  constructor() {
    effect(() => this.apply(this.high()));
  }

  toggle(): void {
    const next = !this.high();
    const reduced = this.window?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const commit = () => {
      this.high.set(next);
      this.apply(next);
    };

    // Cross-fade the whole page where the View Transitions API exists.
    if (this.document.startViewTransition && !reduced) this.document.startViewTransition(commit);
    else commit();

    try {
      this.window?.localStorage.setItem(STORAGE_KEY, next ? 'high' : 'normal');
    } catch {
      // Storage can be unavailable (private mode, blocked site data); the toggle still works.
    }
  }

  private apply(high: boolean): void {
    const root = this.document.documentElement;
    if (high) root.setAttribute('data-contrast', 'high');
    else root.removeAttribute('data-contrast');
    this.document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', high ? THEME_COLOR.high : THEME_COLOR.normal);
  }

  private initial(): boolean {
    try {
      const saved = this.window?.localStorage.getItem(STORAGE_KEY);
      if (saved) return saved === 'high';
    } catch {
      // Fall through to the OS preference.
    }
    return this.window?.matchMedia?.('(prefers-contrast: more)').matches ?? false;
  }
}
