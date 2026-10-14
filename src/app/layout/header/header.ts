import {
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { BRAND, NAV_ITEMS } from '../../core/content';
import { ScrollService } from '../../shared/scroll.service';

@Component({
  selector: 'tt-header',
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    '[class.is-scrolled]': 'scrolled()',
    '[class.is-open]': 'menuOpen()',
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class Header {
  private readonly document = inject(DOCUMENT);
  private readonly scroll = inject(ScrollService);
  private readonly toggleButton = viewChild<ElementRef<HTMLButtonElement>>('toggle');
  private readonly mobileNav = viewChild<ElementRef<HTMLElement>>('mobileNav');

  protected readonly brand = BRAND;
  protected readonly items = NAV_ITEMS;
  protected readonly active = this.scroll.activeSection;
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const win = this.document.defaultView;
      if (!win) return;

      let frame = 0;
      const onScroll = () => {
        if (frame) return;
        frame = win.requestAnimationFrame(() => {
          frame = 0;
          this.scrolled.set(win.scrollY > 24);
        });
      };
      onScroll();
      win.addEventListener('scroll', onScroll, { passive: true });

      // Close the mobile menu if the viewport grows to desktop.
      const desktop = win.matchMedia?.('(min-width: 1024px)');
      const onBreakpoint = (e: MediaQueryListEvent) => e.matches && this.closeMenu();
      desktop?.addEventListener('change', onBreakpoint);

      destroyRef.onDestroy(() => {
        win.removeEventListener('scroll', onScroll);
        desktop?.removeEventListener('change', onBreakpoint);
        win.cancelAnimationFrame(frame);
      });
    });

    // Lock page scroll while the mobile menu is open.
    effect(() => {
      this.document.body.classList.toggle('is-locked', this.menuOpen());
    });
  }

  protected toggleMenu(): void {
    if (this.menuOpen()) {
      this.closeMenu();
      return;
    }
    this.menuOpen.set(true);
    // Focus the first link once the overlay is rendered visible.
    setTimeout(() => this.mobileNav()?.nativeElement.querySelector('a')?.focus(), 50);
  }

  protected closeMenu(restoreFocus = true): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    if (restoreFocus) this.toggleButton()?.nativeElement.focus();
  }

  protected navigate(event: Event, id: string): void {
    event.preventDefault();
    this.closeMenu(false);
    this.scroll.scrollTo(id);
  }
}
