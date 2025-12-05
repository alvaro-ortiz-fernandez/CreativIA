export class Color {
    name?: string;
    hex: string;
    r: number;
    g: number;
    b: number;

  constructor(name: string = '', hex: string = '',
        r: number = 0, g: number = 0, b: number = 0) {

    this.name = name;
    this.hex = hex;
    this.r = r;
    this.g = g;
    this.b = b;
  }
}