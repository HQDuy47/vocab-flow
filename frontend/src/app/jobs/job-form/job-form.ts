import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { JOB_STATUSES, JobApplication, JobStatus } from '../job.model';

@Component({
  selector: 'app-job-form',
  imports: [ReactiveFormsModule],
  templateUrl: './job-form.html',
  styleUrl: './job-form.scss',
})
export class JobForm {
  private readonly fb = inject(FormBuilder);

  readonly job = input<JobApplication | null>(null);
  readonly save = output<Omit<JobApplication, 'id'>>();
  readonly cancelled = output<void>();

  protected readonly statuses = JOB_STATUSES;
  protected readonly isEditMode = computed(() => this.job() !== null);
  protected readonly submitted = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    company: ['', Validators.required],
    position: ['', Validators.required],
    status: ['applied' as JobStatus, Validators.required],
    appliedDate: [this.today(), Validators.required],
    link: [''],
    notes: [''],
  });

  constructor() {
    effect(() => {
      const job = this.job();
      if (job) {
        this.form.patchValue(job);
      }
    });
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      return;
    }
    this.save.emit(this.form.getRawValue());
  }

  protected cancel(): void {
    this.cancelled.emit();
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
