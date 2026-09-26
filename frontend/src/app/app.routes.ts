import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  {
    path: 'jobs',
    loadComponent: () =>
      import('./jobs/job-list/job-list').then((m) => m.JobList),
  },
];
