import { Color } from "./Color";
import { ColorScheme } from "./ColorScheme";
import { Concept } from "./Concept";

export class ColorPalette {
    id: string;
    baseColor: Color;
    colors: Color[];
    scheme: ColorScheme;
    concept: Concept;
    interpretation: string;

  constructor(id: string = '', baseColor: Color = new Color(),
        colors: Color[] = [], scheme: ColorScheme = new ColorScheme(),
        concept: Concept = new Concept(), interpretation: string = '') {
    
    this.id = id;
    this.baseColor = baseColor;
    this.colors = colors;
    this.scheme = scheme;
    this.concept = concept;
    this.interpretation = interpretation;
  }
}