export class Color {
    name?: string;
    hex: string;
    r: number;
    g: number;
    b: number;

  constructor(name: string = '', hex: string = '#FFFFFF',
        r: number = 255, g: number = 255, b: number = 255) {

    this.name = name;
    this.hex = hex;
    this.r = r;
    this.g = g;
    this.b = b;
  }
}