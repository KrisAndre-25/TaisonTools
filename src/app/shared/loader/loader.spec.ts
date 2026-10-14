import { TestBed } from '@angular/core/testing';
import { LOADER_MAX_MS, LOADER_MIN_MS, Loader, loaderEnd, loaderStep } from './loader';

describe('Loader timing', () => {
  it('finishes between 1 and 3 seconds, following the real page load', () => {
    expect(loaderEnd(0)).toBe(LOADER_MIN_MS); // already loaded → never shorter than 1s
    expect(loaderEnd(1500)).toBe(1850); // loaded at 1.5s → settles shortly after
    expect(loaderEnd(5000)).toBe(LOADER_MAX_MS); // slow page → capped at 3s
    expect(loaderEnd(null)).toBe(LOADER_MAX_MS); // not loaded yet → 3s deadline
  });

  it('reaches 100% exactly at the deadline and never goes backwards', () => {
    let p = 0;
    let now = 0;
    const end = 1000;
    while (now < end) {
      const next = loaderStep(p, 16, end - now);
      expect(next).toBeGreaterThanOrEqual(p);
      p = next;
      now += 16;
    }
    expect(loaderStep(p, 16, 0)).toBe(1);
  });
});

describe('Loader', () => {
  afterEach(() => document.body.classList.remove('is-loading'));

  it('exposes its progress to assistive tech, starting at 1%', () => {
    const fixture = TestBed.createComponent(Loader);
    fixture.detectChanges();
    const bar = (fixture.nativeElement as HTMLElement).querySelector('[role="progressbar"]');

    expect(bar?.getAttribute('aria-valuenow')).toBe('1');
    expect(bar?.textContent).toContain('1%');
  });
});
