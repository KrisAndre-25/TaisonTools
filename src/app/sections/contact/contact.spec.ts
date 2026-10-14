import { TestBed } from '@angular/core/testing';
import { Contact } from './contact';

function type(el: HTMLElement, selector: string, value: string): void {
  const input = el.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)!;
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

describe('Contact', () => {
  it('shows validation errors when submitted empty', async () => {
    const fixture = TestBed.createComponent(Contact);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    el.querySelector<HTMLButtonElement>('.form__submit')!.click();
    await fixture.whenStable();

    expect(el.querySelectorAll('.field__error').length).toBe(3);
    expect(el.querySelector('#contact-email')?.getAttribute('aria-invalid')).toBe('true');
  });

  it('confirms locally once the form is valid (no backend yet)', async () => {
    const fixture = TestBed.createComponent(Contact);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    type(el, '#contact-name', 'Ana');
    type(el, '#contact-email', 'ana@example.com');
    type(el, '#contact-message', 'Necesitamos digitalizar el registro de pedidos.');
    el.querySelector<HTMLButtonElement>('.form__submit')!.click();
    await fixture.whenStable();

    expect(el.querySelector('form')).toBeNull();
    expect(el.querySelector('[role="status"]')?.textContent).toContain('Gracias, Ana');
  });

  it('moves focus to the confirmation after sending', async () => {
    const fixture = TestBed.createComponent(Contact);
    document.body.appendChild(fixture.nativeElement);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    type(el, '#contact-name', 'Ana');
    type(el, '#contact-email', 'ana@example.com');
    type(el, '#contact-message', 'Necesitamos digitalizar el registro de pedidos.');
    el.querySelector<HTMLButtonElement>('.form__submit')!.click();
    await fixture.whenStable();

    expect(document.activeElement).toBe(el.querySelector('.sent'));
    el.remove();
  });
});
