import { Component } from '@angular/core';
import { VocabCardComponent } from '../vocab-card/vocab-card';

@Component({
  selector: 'app-vocab-page',
  imports: [VocabCardComponent],
  templateUrl: './vocab-page.html',
})
export class VocabPage {}
