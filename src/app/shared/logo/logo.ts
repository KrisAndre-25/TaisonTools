import {
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ViewportService } from '../viewport.service';
import { LOGO_PATHS, LOGO_PATH_TRANSFORM, LOGO_RING, LOGO_VIEWBOX } from './logo-paths';

/** The wrench's jaw points up-right (−45°) in the artwork. */
const WRENCH_REST_ANGLE = -45;

/**
 * TaisonTools wordmark. With `interactive`, it draws itself in on load and the wrench
 * inside the "O" turns to follow the pointer; a click or tap gives it a full turn.
 */
@Component({
  selector: 'tt-logo',
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
  host: {
    '[class.is-interactive]': 'interactive()',
    '(click)': 'spin()',
  },
})
export class Logo {
  /** Accessible name; leave empty when a parent element already names the logo. */
  readonly label = input('TaisonTools');
  readonly interactive = input(false);

  protected readonly paths = LOGO_PATHS;
  protected readonly ring = LOGO_RING;
  protected readonly viewBox = LOGO_VIEWBOX;
  protected readonly pathTransform = LOGO_PATH_TRANSFORM;
  protected readonly angle = signal(0);

  private readonly svg = viewChild.required<ElementRef<SVGSVGElement>>('svg');
  private readonly viewport = inject(ViewportService);

  constructor() {
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const win = document.defaultView;
      if (!win || !this.interactive() || this.viewport.reducedMotion) return;
      if (!win.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return;

      let frame = 0;
      let pointer = { x: 0, y: 0 };
      const update = () => {
        frame = 0;
        const box = this.svg().nativeElement.getBoundingClientRect();
        const [vx, vy, vw, vh] = this.viewBox.split(' ').map(Number);
        const cx = box.left + ((this.ring.cx - vx) / vw) * box.width;
        const cy = box.top + ((this.ring.cy - vy) / vh) * box.height;
        const target =
          (Math.atan2(pointer.y - cy, pointer.x - cx) * 180) / Math.PI - WRENCH_REST_ANGLE;
        // Turn the shortest way round instead of jumping across ±180°.
        const current = this.angle();
        const delta = ((((target - current) % 360) + 540) % 360) - 180;
        this.angle.set(current + delta);
      };
      const onMove = (event: PointerEvent) => {
        pointer = { x: event.clientX, y: event.clientY };
        if (!frame) frame = win.requestAnimationFrame(update);
      };

      // Follow the pointer only while the logo is on screen.
      const stop = this.viewport.observe(
        this.svg().nativeElement,
        (entry) => {
          if (entry.isIntersecting) win.addEventListener('pointermove', onMove, { passive: true });
          else win.removeEventListener('pointermove', onMove);
        },
        '0px',
      );

      destroyRef.onDestroy(() => {
        stop();
        win.removeEventListener('pointermove', onMove);
        win.cancelAnimationFrame(frame);
      });
    });
  }

  protected spin(): void {
    if (this.interactive() && !this.viewport.reducedMotion) this.angle.update((a) => a + 360);
  }
}
