import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BRAND } from '../../core/content';
import { Icon } from '../../shared/icon';
import { RevealDirective } from '../../shared/reveal.directive';

export type ContactStatus = 'idle' | 'invalid' | 'ready';

@Component({
  selector: 'tt-contact',
  imports: [Icon, ReactiveFormsModule, RevealDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly brand = BRAND;
  protected readonly projectTypes = ['Software', 'Web', 'UX/UI', 'Automatización', 'Otro'] as const;
  protected readonly status = signal<ContactStatus>('idle');

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    type: ['Software'],
    message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(2000)]],
  });

  protected showError(control: 'name' | 'email' | 'message'): boolean {
    const c = this.form.controls[control];
    return c.invalid && (c.touched || this.status() === 'invalid');
  }

  /**
   * There is no backend yet: the form validates and confirms locally.
   * Integration point — send `this.form.getRawValue()` to the future endpoint here.
   */
  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.status.set('invalid');
      return;
    }
    this.status.set('ready');
  }

  protected reset(): void {
    this.form.reset();
    this.status.set('idle');
  }
}
