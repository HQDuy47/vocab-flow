import { Component, input } from '@angular/core';

@Component({
  selector: 'vocab-card',
  templateUrl: './vocab-card.html',
  styleUrl: './vocab-card.scss',
})
export class VocabCardComponent {
  word = input.required<string>();
  meaning = input.required<string>();
  example = input.required<string>();
}
