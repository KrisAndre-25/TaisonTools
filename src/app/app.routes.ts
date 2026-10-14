import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

// Single-page site: every path renders Home (no redirect, so the URL is never rewritten).
export const routes: Routes = [
  { path: '**', component: Home, title: 'TaisonTools — Software, Web & UX/UI' },
];
