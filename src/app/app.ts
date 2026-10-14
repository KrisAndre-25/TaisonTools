import { Component, DOCUMENT, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';
import { Loader } from './shared/loader/loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Loader],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly columns = [0, 1, 2, 3];

  constructor() {
    // Every load or reload starts at the top of "Inicio": the browser must not restore the
    // previous scroll position, and a section hash left in the URL (#servicios…) is dropped.
    const win = inject(DOCUMENT).defaultView;
    if (!win) return;
    try {
      win.history.scrollRestoration = 'manual';
      if (win.location.hash) {
        win.history.replaceState(null, '', win.location.pathname + win.location.search);
      }
    } catch {
      // Sandboxed frames can refuse history access; scrolling to the top still applies.
    }
    win.scrollTo(0, 0);
  }
}
