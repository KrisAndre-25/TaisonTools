import { Component, input } from '@angular/core';

export type IconName = 'arrow-right' | 'arrow-up-right' | 'arrow-down' | 'arrow-up';

/** Minimal stroke icon set — inline SVG, inherits currentColor. */
@Component({
  selector: 'tt-icon',
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @switch (name()) {
        @case ('arrow-right') {
          <path d="M4 12h16M14 6l6 6-6 6" />
        }
        @case ('arrow-up-right') {
          <path d="M7 17 17 7M8 7h9v9" />
        }
        @case ('arrow-down') {
          <path d="M12 4v16M6 14l6 6 6-6" />
        }
        @case ('arrow-up') {
          <path d="M12 20V4M6 10l6-6 6 6" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
      width: 1em;
      height: 1em;
      flex: none;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
}
