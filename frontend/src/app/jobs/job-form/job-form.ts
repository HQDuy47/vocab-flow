import { Component, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JOB_STATUSES, JobStatus } from '../job.model';
import { JobService } from '../job.service';

@Component({
  selector: 'app-job-form',
  imports: [ReactiveFormsModule],
  templateUrl: './job-form.html',
  styleUrl: './job-form.scss',
})
export class JobForm {
  private readonly fb = inject(FormBuilder);
  private readonly jobService = inject(JobService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly statuses = JOB_STATUSES;
  private readonly editId = signal<string | null>(
    this.route.snapshot.paramMap.get('id'),
  );
  protected readonly isEditMode = computed(() => this.editId() !== null);

  protected readonly form = this.fb.nonNullable.group({
    company: ['', Validators.required],
    position: ['', Validators.required],
    status: ['applied' as JobStatus, Validators.required],
    appliedDate: [this.today(), Validators.required],
    link: [''],
    notes: [''],
  });

  constructor() {
    const id = this.editId();
    if (id) {
      const job = this.jobService.getJob(id);
      if (job) {
        this.form.patchValue(job);
      }
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const id = this.editId();
    if (id) {
      this.jobService.updateJob(id, value);
    } else {
      this.jobService.addJob(value);
    }
    this.router.navigate(['/jobs']);
  }

  protected cancel(): void {
    this.router.navigate(['/jobs']);
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
