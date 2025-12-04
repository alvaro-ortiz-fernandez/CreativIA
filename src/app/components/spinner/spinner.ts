import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  imports: [],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss',
})
export class Spinner {

  @Input() size: SpinnerSize = SpinnerSize.MD; // Tamaño por defecto

  private sizeMap: Record<SpinnerSize, SpinnerConfig> = {
    [SpinnerSize.SM]: { height: '40px', width: '40px', fontSize: '1rem' },
    [SpinnerSize.MD]: { height: '60px', width: '60px', fontSize: '1.5rem' },
    [SpinnerSize.LG]: { height: '80px', width: '80px', fontSize: '2rem' },
  };

  get config(): SpinnerConfig {
    return this.sizeMap[this.size];
  }
}

export interface SpinnerConfig {
  height: string;
  width: string;
  fontSize: string;
}

export enum SpinnerSize {
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
}