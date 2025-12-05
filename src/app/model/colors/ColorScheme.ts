export class ColorScheme {
    type: string;
    tones: number;

  constructor(type: string = 'monochrome', tones: number = 1) {
    this.type = type;
    this.tones = tones;
  }
}