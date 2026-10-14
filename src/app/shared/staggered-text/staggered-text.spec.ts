import { TestBed } from '@angular/core/testing';
import { StaggeredText } from './staggered-text';

describe('StaggeredText', () => {
  async function render(by: 'letter' | 'word') {
    const fixture = TestBed.createComponent(StaggeredText);
    fixture.componentRef.setInput('text', 'Hola mundo');
    fixture.componentRef.setInput('accent', '.');
    fixture.componentRef.setInput('by', by);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('reads the sentence once and hides the split pieces from assistive tech', async () => {
    const el = await render('word');
    expect(el.querySelector('.visually-hidden')?.textContent).toBe('Hola mundo.');
    expect(el.querySelector('.st')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('splits by word or by letter, with the accent as its own piece', async () => {
    expect((await render('word')).querySelectorAll('.st__piece').length).toBe(3);
    expect((await render('letter')).querySelectorAll('.st__piece').length).toBe(10);
  });

  it('shows the pieces once in view (immediately without IntersectionObserver)', async () => {
    const el = await render('word');
    expect(el.classList.contains('is-in')).toBe(true);
  });
});
