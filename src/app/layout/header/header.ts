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
import { ContrastService } from '../../shared/contrast.service';
import { Icon } from '../../shared/icon';
import { Logo } from '../../shared/logo/logo';
import { ScrollService } from '../../shared/scroll.service';

@Component({
  selector: 'tt-header',
  imports: [Icon, Logo],
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
  private readonly progress = viewChild<ElementRef<HTMLElement>>('progress');

  protected readonly contrast = inject(ContrastService);
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
          // Reading progress, written to the DOM directly to avoid change detection per frame.
          const max = this.document.documentElement.scrollHeight - win.innerHeight;
          const ratio = max > 0 ? Math.min(1, win.scrollY / max) : 0;
          this.progress()?.nativeElement.style.setProperty('transform', `scaleX(${ratio})`);
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

    // Lock page scroll while the mobile menu is open, and make the page behind it inert so
    // keyboard and screen reader focus stays inside the menu and the header bar.
    effect(() => {
      const open = this.menuOpen();
      this.document.body.classList.toggle('is-locked', open);
      this.document
        .querySelectorAll('main, tt-footer')
        .forEach((el) => el.toggleAttribute('inert', open));
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
