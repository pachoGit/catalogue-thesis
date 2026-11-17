import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/welcome/welcome.component').then((m) => m.WelcomeComponent),
    title: 'Catalogo | Inicio & Consentimiento de Tesis',
  },
  {
    path: 'catalogo-2d',
    loadComponent: () =>
      import('./features/catalog-2d/catalog-2d.component').then((m) => m.Catalog2dComponent),
    title: 'Catálogo 2D (Tradicional) | Tesis 3D',
  },
  {
    path: 'catalogo-3d',
    loadComponent: () =>
      import('./features/catalog-3d/catalog-3d.component').then((m) => m.Catalog3dComponent),
    title: 'Catálogo 3D (Interactivo) | Tesis 3D',
  },
  {
    path: 'comparacion',
    loadComponent: () =>
      import('./features/comparison/comparison.component').then((m) => m.ComparisonComponent),
    title: 'Comparador Dual 2D vs 3D | Tesis 3D',
  },
  {
    path: 'encuesta',
    loadComponent: () =>
      import('./features/survey/survey.component').then((m) => m.SurveyComponent),
    title: 'Encuesta Psicométrica TAM | Tesis 3D',
  },
  {
    path: 'completado',
    loadComponent: () =>
      import('./features/complete/complete.component').then((m) => m.CompleteComponent),
    title: 'Evaluación Completada | Tesis 3D',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    title: 'Panel de Sustentación & Resultados | Tesis 3D',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
