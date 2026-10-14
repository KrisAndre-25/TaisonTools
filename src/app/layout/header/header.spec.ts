import { TestBed } from '@angular/core/testing';
import { Header } from './header';

describe('Header', () => {
  afterEach(() => document.body.classList.remove('is-locked'));

  it('opens the mobile menu, locks scroll and closes with Escape', async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const toggle = el.querySelector<HTMLButtonElement>('.toggle')!;

    toggle.click();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(document.body.classList.contains('is-locked')).toBe(true);
    expect(el.querySelector('#mobile-menu')?.getAttribute('aria-hidden')).toBe('false');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.classList.contains('is-locked')).toBe(false);
  });

  it('lists the six sections in order', async () => {
    const fixture = TestBed.createComponent(Header);
    await fixture.whenStable();
    const labels = [...(fixture.nativeElement as HTMLElement).querySelectorAll('.nav__link')].map(
      (a) => a.textContent?.trim(),
    );
    expect(labels).toEqual(['Inicio', 'Servicios', 'Proceso', 'Proyectos', 'Nosotros', 'Contacto']);
  });
});
