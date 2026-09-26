import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  {
    path: 'vocab',
    loadComponent: () =>
      import('./vocab-page/vocab-page').then((m) => m.VocabPage),
  },
  {
    path: 'jobs',
    loadComponent: () =>
      import('./jobs/job-list/job-list').then((m) => m.JobList),
  },
  {
    path: 'jobs/add',
    loadComponent: () =>
      import('./jobs/job-form/job-form').then((m) => m.JobForm),
  },
  {
    path: 'jobs/:id/edit',
    loadComponent: () =>
      import('./jobs/job-form/job-form').then((m) => m.JobForm),
  },
];
