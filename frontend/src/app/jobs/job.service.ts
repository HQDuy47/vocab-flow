import { Injectable, computed, effect, signal } from '@angular/core';
import { JobApplication, JobStatus } from './job.model';

const STORAGE_KEY = 'job-tracker.jobs';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly jobs = signal<JobApplication[]>(this.loadJobs());

  readonly allJobs = this.jobs.asReadonly();

  readonly statusCounts = computed(() => {
    const counts: Record<JobStatus, number> = {
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };
    for (const job of this.jobs()) {
      counts[job.status]++;
    }
    return counts;
  });

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.jobs()));
    });
  }

  getJob(id: string): JobApplication | undefined {
    return this.jobs().find((j) => j.id === id);
  }

  addJob(job: Omit<JobApplication, 'id'>): void {
    const newJob: JobApplication = { ...job, id: crypto.randomUUID() };
    this.jobs.update((jobs) => [...jobs, newJob]);
  }

  updateJob(id: string, changes: Omit<JobApplication, 'id'>): void {
    this.jobs.update((jobs) =>
      jobs.map((j) => (j.id === id ? { ...j, ...changes } : j)),
    );
  }

  updateStatus(id: string, status: JobStatus): void {
    this.jobs.update((jobs) =>
      jobs.map((j) => (j.id === id ? { ...j, status } : j)),
    );
  }

  removeJob(id: string): void {
    this.jobs.update((jobs) => jobs.filter((j) => j.id !== id));
  }

  private loadJobs(): JobApplication[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as JobApplication[]) : [];
    } catch {
      return [];
    }
  }
}
