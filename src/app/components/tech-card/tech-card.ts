import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tech-card',
  host: {
    'class': 'col-xxl-4 col-md-6 mt-4 px-4 py-3'
  },
  templateUrl: './tech-card.html',
  styleUrl: './tech-card.scss',
})
export class TechCard {

  @Input() tech!: Tech;
}