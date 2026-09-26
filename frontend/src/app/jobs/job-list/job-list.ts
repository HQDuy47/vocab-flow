import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JOB_STATUSES, JobStatus } from '../job.model';
import { JobService } from '../job.service';

type StatusFilter = 'all' | JobStatus;

@Component({
  selector: 'app-job-list',
  imports: [RouterLink],
  templateUrl: './job-list.html',
  styleUrl: './job-list.scss',
})
export class JobList {
  private readonly jobService = inject(JobService);

  protected readonly statuses = JOB_STATUSES;
  protected readonly filter = signal<StatusFilter>('all');

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
    if (confirm('Xóa job này khỏi danh sách?')) {
      this.jobService.removeJob(id);
    }
  }
}
