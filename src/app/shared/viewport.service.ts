import { Injectable, DOCUMENT, inject } from '@angular/core';

type Callback = (entry: IntersectionObserverEntry) => void;

/**
 * Shares IntersectionObservers between many elements instead of creating one per element.
 * Falls back to "always visible" where IntersectionObserver is unavailable (tests, old browsers).
 */
@Injectable({ providedIn: 'root' })
export class ViewportService {
  private readonly window = inject(DOCUMENT).defaultView;
  // One observer per rootMargin; each keeps its own element → callback map so the same
  // element can be watched with different margins.
  private readonly observers = new Map<
    string,
    { observer: IntersectionObserver; callbacks: WeakMap<Element, Callback> }
  >();

  readonly reducedMotion =
    this.window?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  observe(element: Element, callback: Callback, rootMargin = '0px 0px -12% 0px'): () => void {
    if (!this.window || typeof this.window.IntersectionObserver === 'undefined') {
      callback({ isIntersecting: true, target: element } as IntersectionObserverEntry);
      return () => undefined;
    }

    const { observer, callbacks } = this.getObserver(rootMargin);
    callbacks.set(element, callback);
    observer.observe(element);

    return () => {
      observer.unobserve(element);
      callbacks.delete(element);
    };
  }

  private getObserver(rootMargin: string) {
    let entry = this.observers.get(rootMargin);
    if (!entry) {
      const callbacks = new WeakMap<Element, Callback>();
      const observer = new IntersectionObserver(
        (entries) => entries.forEach((e) => callbacks.get(e.target)?.(e)),
        { rootMargin, threshold: 0 },
      );
      entry = { observer, callbacks };
      this.observers.set(rootMargin, entry);
    }
    return entry;
  }
}
