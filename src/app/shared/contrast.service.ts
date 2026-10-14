import { DOCUMENT, Injectable, effect, inject, signal } from '@angular/core';

const STORAGE_KEY = 'tt-contrast';

/**
 * High-contrast black & white mode. Starts from the visitor's saved choice, or from the
 * OS "increase contrast" setting, and is applied as data-contrast="high" on <html>.
 */
@Injectable({ providedIn: 'root' })
export class ContrastService {
  private readonly document = inject(DOCUMENT);
  private readonly window = this.document.defaultView;

  readonly high = signal(this.initial());

  constructor() {
    effect(() => {
      const root = this.document.documentElement;
      if (this.high()) root.setAttribute('data-contrast', 'high');
      else root.removeAttribute('data-contrast');
    });
  }

  toggle(): void {
    const next = !this.high();
    this.high.set(next);
    try {
      this.window?.localStorage.setItem(STORAGE_KEY, next ? 'high' : 'normal');
    } catch {
      // Storage can be unavailable (private mode, blocked site data); the toggle still works.
    }
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
