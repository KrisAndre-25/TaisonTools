import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'TaisonTools — Software, Web & UX/UI' },
  { path: '**', redirectTo: '' },
];
