import { Injectable, DOCUMENT, inject, signal } from '@angular/core';
import { ViewportService } from './viewport.service';

/** Smooth in-page navigation and the "current section" signal used by the header. */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly document = inject(DOCUMENT);
  private readonly viewport = inject(ViewportService);

  readonly activeSection = signal('inicio');

  scrollTo(id: string): void {
    const target = this.document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({
      behavior: this.viewport.reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
    this.document.defaultView?.history.replaceState(null, '', `#${id}`);

    // Move focus for keyboard and screen reader users without a second scroll jump.
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  /** Tracks which section crosses the middle of the viewport. Returns a cleanup function. */
  trackSections(ids: readonly string[]): () => void {
    const stops = ids
      .map((id) => this.document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
      .map((el) =>
        this.viewport.observe(
          el,
          (entry) => {
            if (entry.isIntersecting) this.activeSection.set(el.id);
          },
          '-45% 0px -54% 0px',
        ),
      );

    return () => stops.forEach((stop) => stop());
  }
}
