import { TestBed } from '@angular/core/testing';
import { Services } from './services';

describe('Services', () => {
  it('opens the first service by default and toggles others on click', async () => {
    const fixture = TestBed.createComponent(Services);
    await fixture.whenStable();
    const triggers = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      '.service__trigger',
    );

    expect(triggers.length).toBe(6);
    expect(triggers[0].getAttribute('aria-expanded')).toBe('true');

    triggers[2].click();
    await fixture.whenStable();
    expect(triggers[0].getAttribute('aria-expanded')).toBe('false');
    expect(triggers[2].getAttribute('aria-expanded')).toBe('true');

    triggers[2].click();
    await fixture.whenStable();
    expect(triggers[2].getAttribute('aria-expanded')).toBe('false');
  });
});
