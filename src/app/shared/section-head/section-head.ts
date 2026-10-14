import { Component, input } from '@angular/core';
import { RevealDirective } from '../reveal.directive';

/**
 * Shared section heading — index + label on the left, title (projected) and lead on the right.
 * Keeps numbering and rhythm consistent across the page.
 */
@Component({
  selector: 'tt-section-head',
  imports: [RevealDirective],
  template: `
    <div class="section-head">
      <p class="section-head__meta t-label" ttReveal="fade">
        <span class="section-head__index">{{ index() }}</span>
        <span class="section-head__rule"></span>
        {{ label() }}
      </p>
      <div class="section-head__body">
        <h2 class="t-h2" [id]="titleId()" ttReveal="clip"><ng-content /></h2>
        @if (lead()) {
          <p class="t-lead" ttReveal [revealDelay]="120">{{ lead() }}</p>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class SectionHead {
  readonly index = input.required<string>();
  readonly label = input.required<string>();
  readonly titleId = input.required<string>();
  readonly lead = input('');
}
