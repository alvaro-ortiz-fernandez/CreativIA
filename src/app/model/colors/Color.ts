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

  syncColorFromHEX() {
    const value = this.hex?.replace('#', '');

    if (value) {
      this.r = parseInt(value.substring(0, 2), 16);
      this.g = parseInt(value.substring(2, 4), 16);
      this.b = parseInt(value.substring(4, 6), 16);
    }
  }

  syncColorFromRGB() {
    const { r, g, b } = this;

    if ([r, g, b].some(v => v < 0 || v > 255 || v == null))
      return;

    this.hex = (
        '#' +
        [r, g, b]
          .map(v => v.toString(16).padStart(2, '0'))
          .join('')
      ).toUpperCase();
  }
}