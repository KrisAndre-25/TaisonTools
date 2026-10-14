import { TestBed } from '@angular/core/testing';
import { Logo } from './logo';

describe('Logo', () => {
  it('renders an accessible wordmark with the wrench as its own group', async () => {
    const fixture = TestBed.createComponent(Logo);
    await fixture.whenStable();
    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg')!;

    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('TaisonTools');
    expect(svg.querySelector('.logo__ring')).toBeTruthy();
    expect(svg.querySelector('.logo__wrench path')).toBeTruthy();
  });

  it('is hidden from assistive tech when the parent already names it', async () => {
    const fixture = TestBed.createComponent(Logo);
    fixture.componentRef.setInput('label', '');
    await fixture.whenStable();
    const svg = (fixture.nativeElement as HTMLElement).querySelector('svg')!;

    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.hasAttribute('aria-label')).toBe(false);
  });
});
