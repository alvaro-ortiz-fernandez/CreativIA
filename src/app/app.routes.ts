import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Compose } from './pages/compose/compose';
import { Result } from './pages/result/result';
import { Library } from './pages/library/library';

export const routes: Routes = [
  // Página de inicio
  {
    path: '',
    component: Home,
    title: 'CreativIA · Inicio'
  },

  // Página para generar nuevas paletas de color
  {
    path: 'componer',
    component: Compose,
    title: 'CreativIA · Componer'
  },

  // Página de resultado con análisis de la paleta generada
  {
    path: 'resultado/:id',
    component: Result,
    title: 'CreativIA · Resultado'
  },

  // Página con el historial de paletas creadas
  {
    path: 'library',
    component: Library,
    title: 'CreativIA · Biblioteca'
  },

  // Ruta de fallback por si se accede a una URL inexistente
  {
    path: '**',
    redirectTo: ''
  }
];