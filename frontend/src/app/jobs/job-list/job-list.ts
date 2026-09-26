import { Component, computed, inject, signal } from '@angular/core';
import { JOB_STATUSES, JobApplication, JobStatus } from '../job.model';
import { JobService } from '../job.service';
import { JobForm } from '../job-form/job-form';

type StatusFilter = 'all' | JobStatus;

@Component({
  selector: 'app-job-list',
  imports: [JobForm],
  templateUrl: './job-list.html',
  styleUrl: './job-list.scss',
})
export class JobList {
  private readonly jobService = inject(JobService);

  protected readonly statuses = JOB_STATUSES;
  protected readonly filter = signal<StatusFilter>('all');

  protected readonly showForm = signal(false);
  protected readonly editingJob = signal<JobApplication | null>(null);

  protected readonly jobs = this.jobService.allJobs;
  protected readonly statusCounts = this.jobService.statusCounts;

  protected readonly filteredJobs = computed(() => {
    const filter = this.filter();
    const jobs = this.jobs();
    if (filter === 'all') {
      return jobs;
    }
    return jobs.filter((j) => j.status === filter);
  });

  protected setFilter(filter: StatusFilter): void {
    this.filter.set(filter);
  }

  protected onStatusChange(id: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value as JobStatus;
    this.jobService.updateStatus(id, value);
  }

  protected removeJob(id: string): void {
    if (confirm('Remove this job from the list?')) {
      this.jobService.removeJob(id);
    }
  }

  protected openAddForm(): void {
    this.editingJob.set(null);
    this.showForm.set(true);
  }

  protected openEditForm(job: JobApplication): void {
    this.editingJob.set(job);
    this.showForm.set(true);
  }

  protected closeForm(): void {
    this.showForm.set(false);
    this.editingJob.set(null);
  }

  protected handleSave(value: Omit<JobApplication, 'id'>): void {
    const job = this.editingJob();
    if (job) {
      this.jobService.updateJob(job.id, value);
    } else {
      this.jobService.addJob(value);
    }
    this.closeForm();
  }
}
