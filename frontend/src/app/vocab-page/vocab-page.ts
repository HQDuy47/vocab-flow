import { Component } from '@angular/core';
import { VocabCardComponent } from '../vocab-card/vocab-card';

@Component({
  selector: 'app-vocab-page',
  imports: [VocabCardComponent],
  templateUrl: './vocab-page.html',
  styleUrl: './vocab-page.scss',
})
export class VocabPage {}
