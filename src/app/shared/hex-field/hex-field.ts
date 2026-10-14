import {
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { ViewportService } from '../viewport.service';

interface Palette {
  ground: string;
  /** Bevel: outer hexagon, lit top-left → shaded bottom-right. */
  edge: [string, string];
  /** Top face: inner hexagon, softer gradient. */
  face: [string, string];
  shadow: string;
}

const PALETTES: Record<'light' | 'dark', Palette> = {
  light: {
    ground: '#e6e6e6',
    edge: ['#ffffff', '#cfcfcf'],
    face: ['#fdfdfd', '#e2e2e2'],
    shadow: 'rgba(0, 0, 0, 0.6)',
  },
  dark: {
    ground: '#0d0d0d',
    edge: ['#2a2a2a', '#121212'],
    face: ['#1c1c1c', '#101010'],
    shadow: 'rgba(0, 0, 0, 0.9)',
  },
};

interface Cell {
  x: number;
  y: number;
  /** Pop animation progress 0→1, or -1 while idle. */
  pop: number;
  /** Proximity lift, eased towards its target each frame. */
  near: number;
}

/** Duration of one pop: lift, fade out, fade back in. */
const POP_MS = 1500;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * Interactive honeycomb drawn on a canvas — the coded replacement for the hero's background
 * video. White bevelled hexagons with soft shadows; a slow band of raised cells drifts across,
 * cells near the pointer rise, and the one under it lifts, fades out and fades back in.
 * Static (one frame, no interaction) when the visitor prefers reduced motion.
 */
@Component({
  selector: 'tt-hex-field',
  template: `<canvas #canvas></canvas>`,
  styles: `
    :host {
      display: block;
      position: absolute;
      inset: 0;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
  host: { 'aria-hidden': 'true' },
})
export class HexField {
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    const document = inject(DOCUMENT);
    const viewport = inject(ViewportService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const win = document.defaultView;
      const canvas = this.canvas().nativeElement;
      const ctx = canvas.getContext('2d');
      if (!win || !ctx) return;

      const still = viewport.reducedMotion;
      let width = 0;
      let height = 0;
      let dpr = 1;
      let radius = 40;
      let cells: Cell[] = [];
      let sprite: HTMLCanvasElement | null = null;
      let shadow: HTMLCanvasElement | null = null;
      let spriteSize = 0;
      let palette = PALETTES.light;
      let pointer: { x: number; y: number } | null = null;
      let hovered: Cell | null = null;
      let frame = 0;
      let visible = false;
      let last = 0;

      const hexPath = (c: CanvasRenderingContext2D, cx: number, cy: number, r: number) => {
        c.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i - Math.PI / 2; // pointy-top
          const px = cx + r * Math.cos(a);
          const py = cy + r * Math.sin(a);
          if (i === 0) c.moveTo(px, py);
          else c.lineTo(px, py);
        }
        c.closePath();
      };

      // One bevelled hexagon and one soft shadow, rendered once and stamped for every cell.
      const buildSprites = () => {
        // A thin gap keeps the seams between cells soft rather than drawn.
        const r = (radius - Math.max(1, radius * 0.025)) * dpr;
        const pad = radius * 0.6 * dpr;
        spriteSize = Math.ceil(r * 2 + pad * 2);
        const mid = spriteSize / 2;

        sprite = document.createElement('canvas');
        sprite.width = sprite.height = spriteSize;
        const s = sprite.getContext('2d')!;
        const edge = s.createLinearGradient(mid - r, mid - r, mid + r, mid + r);
        edge.addColorStop(0, palette.edge[0]);
        edge.addColorStop(1, palette.edge[1]);
        hexPath(s, mid, mid, r);
        s.fillStyle = edge;
        s.fill();
        const inner = r * 0.8;
        const face = s.createLinearGradient(mid - inner, mid - inner, mid + inner, mid + inner);
        face.addColorStop(0, palette.face[0]);
        face.addColorStop(1, palette.face[1]);
        hexPath(s, mid, mid, inner);
        s.fillStyle = face;
        s.fill();

        // Shadow only: the shape is drawn off-canvas and its blurred shadow offset back in.
        shadow = document.createElement('canvas');
        shadow.width = shadow.height = spriteSize;
        const sh = shadow.getContext('2d')!;
        sh.shadowColor = palette.shadow;
        sh.shadowBlur = radius * 0.35 * dpr;
        sh.shadowOffsetX = spriteSize * 2;
        hexPath(sh, mid - spriteSize * 2, mid, r);
        sh.fillStyle = '#000';
        sh.fill();
      };

      const layout = () => {
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        dpr = Math.min(2, win.devicePixelRatio || 1);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        radius = Math.min(56, Math.max(28, width / 26));

        const w = Math.sqrt(3) * radius;
        const h = radius * 1.5;
        cells = [];
        for (let row = -1, y = -radius; y < height + radius * 2; row++, y += h) {
          const offset = row % 2 ? w / 2 : 0;
          for (let x = -w + offset; x < width + w; x += w) {
            cells.push({ x, y, pop: -1, near: 0 });
          }
        }
        buildSprites();
      };

      // A slow diagonal band of raised cells, like the drifting relief in the original video.
      const ambient = (c: Cell, t: number) => {
        const wave = Math.sin(c.x * 0.0045 - c.y * 0.006 + t * 0.00035);
        const detail = Math.sin(c.x * 0.013 + c.y * 0.011 + t * 0.0006) * 0.25;
        return clamp01((wave + detail - 0.1) * 1.3);
      };

      const draw = (t: number) => {
        if (!sprite || !shadow) return;
        const dt = last ? Math.min(64, t - last) : 16;
        last = t;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = palette.ground;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const reach = radius * 3.2;
        const half = spriteSize / 2;
        let under: Cell | null = null;

        for (const c of cells) {
          // Proximity lift follows the pointer smoothly.
          let target = 0;
          if (pointer) {
            const d = Math.hypot(pointer.x - c.x, pointer.y - c.y);
            if (d < reach) target = (1 - d / reach) ** 2 * 0.7;
            if (d < radius * 0.9) under = c;
          }
          c.near += (target - c.near) * Math.min(1, dt / 120);

          let lift = still ? ambient(c, 0) : ambient(c, t) + c.near;
          let alpha = 1;
          let scale = 1;

          if (c.pop >= 0) {
            c.pop += dt / POP_MS;
            const p = c.pop;
            if (p < 0.3) {
              lift += easeOut(p / 0.3) * 0.9; // rise
            } else if (p < 0.6) {
              lift += 0.9;
              alpha = 1 - easeOut((p - 0.3) / 0.3); // fade out while lifted
            } else if (p < 1) {
              const q = easeOut((p - 0.6) / 0.4);
              alpha = q; // fade back in, settling from slightly smaller
              scale = 0.9 + 0.1 * q;
              lift *= q;
            } else {
              c.pop = -1;
            }
          }

          const x = c.x * dpr;
          const y = c.y * dpr;
          const k = radius * dpr;

          if (lift > 0.02 && alpha > 0) {
            ctx.globalAlpha = alpha * Math.min(0.7, 0.15 + lift * 0.45);
            ctx.drawImage(shadow, x - half + lift * k * 0.28, y - half + lift * k * 0.42);
          }

          if (alpha > 0) {
            const size = spriteSize * scale * (1 + lift * 0.07);
            ctx.globalAlpha = alpha;
            ctx.drawImage(
              sprite,
              x - size / 2 - lift * k * 0.12,
              y - size / 2 - lift * k * 0.2,
              size,
              size,
            );
          }
        }
        ctx.globalAlpha = 1;

        // A cell pops when the pointer enters it, not again while the pointer rests on it.
        if (under !== hovered) {
          if (under && under.pop < 0) under.pop = 0;
          hovered = under;
        }
      };

      const loop = (t: number) => {
        frame = 0;
        draw(t);
        if (visible && !document.hidden) frame = win.requestAnimationFrame(loop);
      };
      const start = () => {
        if (!frame && !still) frame = win.requestAnimationFrame(loop);
      };
      const stopLoop = () => {
        win.cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
      };

      const applyPalette = () => {
        const high = document.documentElement.getAttribute('data-contrast') === 'high';
        palette = high ? PALETTES.dark : PALETTES.light;
        buildSprites();
        draw(0);
      };

      layout();
      applyPalette();

      const resize = new ResizeObserver(() => {
        layout();
        draw(0);
      });
      resize.observe(canvas);

      // Repaint with the dark palette when contrast mode toggles.
      const contrastWatch = new MutationObserver(applyPalette);
      contrastWatch.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-contrast'],
      });

      const onMove = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        pointer = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height ? { x, y } : null;
      };
      const onLeave = () => (pointer = null);
      const onVisibility = () => (document.hidden ? stopLoop() : visible && start());

      if (!still) {
        win.addEventListener('pointermove', onMove, { passive: true });
        document.addEventListener('pointerleave', onLeave);
        document.addEventListener('visibilitychange', onVisibility);
      }

      // Animate only while the field is on screen.
      const stopObserving = viewport.observe(
        canvas,
        (entry) => {
          visible = entry.isIntersecting;
          if (visible) start();
          else stopLoop();
        },
        '0px',
      );

      destroyRef.onDestroy(() => {
        stopLoop();
        stopObserving();
        resize.disconnect();
        contrastWatch.disconnect();
        win.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerleave', onLeave);
        document.removeEventListener('visibilitychange', onVisibility);
      });
    });
  }
}
