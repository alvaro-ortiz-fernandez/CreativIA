import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tech-card',
  host: {
    'class': 'col-xxl-4 col-md-6'
  },
  templateUrl: './tech-card.html',
  styleUrl: './tech-card.scss',
})
export class TechCard {

  @Input() tech!: Tech;
}