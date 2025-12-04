import { Component } from '@angular/core';

@Component({
  selector: 'app-library',
  imports: [],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export class Library {

  colorPalettes: ColorPalette[] = [
    {
      id: "1",
      baseColor: '#CCCCCC',
      scheme: "Tetrádico",
      description: "Esquema de color seco.",
      context: "A emplear en la creación de combinaciones vibrantes.",
      interpretation: "El color gris suave transmite neutralidad y equilibrio, proporcionando una base versátil que puede complementar una amplia gama de colores.",
      colors: [
        { name: "Gris suave", hex: "#CCCCCC", r: 204, g: 204, b: 204 },
        { name: "Azul cielo", hex: "#99CCFF", r: 153, g: 204, b: 255 },
        { name: "Naranja cálido", hex: "#FFCC99", r: 255, g: 204, b: 153 },
        { name: "Verde menta", hex: "#99FFCC", r: 153, g: 255, b: 204 }
      ]
    }
  ];
}
