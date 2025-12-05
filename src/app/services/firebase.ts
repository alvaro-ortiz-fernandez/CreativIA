import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, shareReplay } from 'rxjs/operators';
import { ColorPalette } from '../model/colors/ColorPalette';
import { Color } from '../model/colors/Color';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {

  mockColorPalettes: ColorPalette[] = [
    {
      id: "1",
      baseColor: new Color("Azul profundo", "#CCCCCC", 204, 204, 204),
      scheme: {
        type: "Tetrádico",
        tones: 4
      },
      concept: {
        context: "Esquema de color seco.",
        suggestion: "A emplear en la creación de combinaciones vibrantes."
      },
      interpretation: "El color gris suave transmite neutralidad y equilibrio, proporcionando una base versátil que puede complementar una amplia gama de colores.",
      colors: [
        new Color("Gris suave", "#CCCCCC", 204, 204, 204),
        new Color("Azul cielo", "#99CCFF", 153, 204, 255),
        new Color("Naranja cálido", "#FFCC99", 255, 204, 153),
        new Color("Verde menta", "#99FFCC", 153, 255, 204)
      ]
    }
  ];
  
  private colorPalettes$: Observable<ColorPalette[]> =
        of(this.mockColorPalettes)
        .pipe(delay(2000))
        .pipe(shareReplay(1));

  getColorPalettes(): Observable<ColorPalette[]> {
    return this.colorPalettes$;
  }

  saveColorPalette(colorPalette: ColorPalette): Observable<ColorPalette> {
    return of(colorPalette)
        .pipe(delay(100))
        .pipe(shareReplay(1));
  }
}