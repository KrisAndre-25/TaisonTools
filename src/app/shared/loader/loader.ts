import {
  Component,
  DOCUMENT,
  DestroyRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { LOGO_CURSOR, LOGO_RING } from '../logo/logo-paths';

/** The loader never finishes sooner than this… */
export const LOADER_MIN_MS = 1000;
/** …and never takes longer than this, even if the page is still loading. */
export const LOADER_MAX_MS = 3000;
/** Once the page has loaded, the count still takes this long to reach 100%. */
const SETTLE_MS = 350;
const LEAVE_MS = 650;

/** On-screen size of the mark and the stroke it should have, in CSS px (see loader.scss). */
const MARK_PX = 112;
const STROKE_PX = 2;
/** viewBox side, in user units. */
const VIEW = 470;

/** When the count should reach 100%, given when the page finished loading (ms from start). */
export function loaderEnd(loadedAfter: number | null): number {
  if (loadedAfter === null) return LOADER_MAX_MS;
  return Math.min(LOADER_MAX_MS, Math.max(LOADER_MIN_MS, loadedAfter + SETTLE_MS));
}

/**
 * Advances progress (0–1) by one frame so that it reaches 1 exactly at `remaining` ms from now.
 * Never moves backwards, so a deadline that changes mid-way (the page loads) stays smooth.
 */
export function loaderStep(progress: number, dt: number, remaining: number): number {
  if (remaining <= 0) return 1;
  return Math.min(1, progress + (1 - progress) * Math.min(1, dt / remaining));
}

/**
 * Splash loader: the "O" of TOOLS with its cursor. The ring draws in from 1% to 100% while
 * the cursor makes one full turn, ending where it started. Takes between 1 and 3 seconds,
 * following the page's real load, then fades away.
 */
@Component({
  selector: 'tt-loader',
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {
  protected readonly ring = LOGO_RING;
  protected readonly cursor = LOGO_CURSOR;
  protected readonly viewBox = `${LOGO_RING.cx - VIEW / 2} ${LOGO_RING.cy - VIEW / 2} ${VIEW} ${VIEW}`;
  /** A 2px line on screen, converted to the units of the ring and of the (scaled) cursor path. */
  protected readonly ringStroke = (STROKE_PX * VIEW) / MARK_PX;
  protected readonly cursorStroke = this.ringStroke / LOGO_CURSOR.scale;

  protected readonly progress = signal(0);
  protected readonly leaving = signal(false);
  protected readonly done = signal(false);

  /** 1% to 100%. */
  protected readonly percent = computed(() => Math.max(1, Math.round(this.progress() * 100)));
  /** The tip starts at 12 o'clock (−90°) and makes one full clockwise turn. */
  protected readonly angle = computed(() => -90 - LOGO_CURSOR.tipAngle + this.progress() * 360);

  constructor() {
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);

    // Keep the page still underneath while the loader is up.
    effect(() => document.body.classList.toggle('is-loading', !this.done()));
    destroyRef.onDestroy(() => document.body.classList.remove('is-loading'));

    afterNextRender(() => {
      const win = document.defaultView;
      if (!win || typeof win.requestAnimationFrame !== 'function') {
        this.done.set(true);
        return;
      }

      const start = win.performance.now();
      let end = start + loaderEnd(null);
      const onLoad = () => (end = start + loaderEnd(win.performance.now() - start));
      if (document.readyState === 'complete') onLoad();
      else win.addEventListener('load', onLoad, { once: true });

      let frame = 0;
      let last = start;
      const timers: ReturnType<typeof setTimeout>[] = [];

      const tick = (now: number) => {
        const p = loaderStep(this.progress(), now - last, end - now);
        last = now;
        this.progress.set(p);

        if (p < 1) {
          frame = win.requestAnimationFrame(tick);
          return;
        }
        // Hold on 100% for a beat, fade out, then remove.
        timers.push(setTimeout(() => this.leaving.set(true), 200));
        timers.push(setTimeout(() => this.done.set(true), 200 + LEAVE_MS));
      };
      frame = win.requestAnimationFrame(tick);

      destroyRef.onDestroy(() => {
        win.cancelAnimationFrame(frame);
        win.removeEventListener('load', onLoad);
        timers.forEach(clearTimeout);
      });
    });
  }
}
