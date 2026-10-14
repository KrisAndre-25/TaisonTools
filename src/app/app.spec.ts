import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('renders the shell: skip link, header, main and footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.skip-link')?.getAttribute('href')).toBe('#contenido');
    expect(el.querySelector('tt-header')).toBeTruthy();
    expect(el.querySelector('main#contenido')).toBeTruthy();
    expect(el.querySelector('tt-footer')?.textContent).toContain('Santiago, Chile');
  });
});
