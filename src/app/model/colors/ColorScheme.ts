export class ColorScheme {
    type: string;
    tones: number;

  constructor(type: string = '', tones: number = 1) {
    this.type = type;
    this.tones = tones;
  }
}