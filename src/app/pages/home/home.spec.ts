import { TestBed } from '@angular/core/testing';
import { NAV_ITEMS } from '../../core/content';
import { Home } from './home';

describe('Home', () => {
  it('renders one h1 and a section for every navigation item', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    expect(el.querySelector('h1')?.textContent).toContain('trabajan juntos');
    for (const item of NAV_ITEMS) {
      expect(el.querySelector(`#${item.id}`), item.id).toBeTruthy();
    }
  });

  it('reveals animated elements immediately when IntersectionObserver is unavailable', async () => {
    const fixture = TestBed.createComponent(Home);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const pending = el.querySelectorAll('[data-reveal]:not(.is-revealed)');
    expect(pending.length).toBe(0);
  });
});
