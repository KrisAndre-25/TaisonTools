import { TestBed } from '@angular/core/testing';
import { TECHNOLOGIES } from '../../core/content';
import { Stack } from './stack';

describe('Stack', () => {
  it('dims technologies outside the selected category', async () => {
    const fixture = TestBed.createComponent(Stack);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const backend = [...el.querySelectorAll<HTMLButtonElement>('.filter')].find((b) =>
      b.textContent?.includes('Backend'),
    )!;

    expect(el.querySelectorAll('.tile.is-dim').length).toBe(0);

    backend.click();
    await fixture.whenStable();
    const backendCount = TECHNOLOGIES.filter((t) => t.category === 'Backend').length;
    expect(el.querySelectorAll('.tile:not(.is-dim)').length).toBe(backendCount);
    expect(backend.getAttribute('aria-pressed')).toBe('true');
  });
});
