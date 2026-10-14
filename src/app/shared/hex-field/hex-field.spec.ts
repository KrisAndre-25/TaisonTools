import { TestBed } from '@angular/core/testing';
import { HexField } from './hex-field';

describe('HexField', () => {
  it('renders a decorative canvas hidden from assistive tech', async () => {
    const fixture = TestBed.createComponent(HexField);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.getAttribute('aria-hidden')).toBe('true');
    expect(host.querySelector('canvas')).toBeTruthy();
  });
});
