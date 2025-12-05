import { Injectable } from '@angular/core';
import { delay, mergeMap, Observable, of, shareReplay, throwError, timer } from 'rxjs';
import { ColorPalette } from '../model/colors/ColorPalette';

/* =======================================================
 * INTERFAZ
 * ==================================================== */
export interface GeminiService {

  getSuggestionPrompt(conceptContext: string): Observable<string>;

  getInterpretation(colorPalette: ColorPalette): Observable<string>;
}

/* =======================================================
 * IMPLEMENTACIÓN
 * ==================================================== */
@Injectable({
  providedIn: 'root',
})
export class GeminiServiceHttp implements GeminiService {
  
  getSuggestionPrompt(conceptContext: string): Observable<string> {
    return timer(1000)
      .pipe(mergeMap(() => throwError(() => new Error('Operación no implementada'))));
  }
  
  getInterpretation(colorPalette: ColorPalette): Observable<string> {
    return timer(100)
      .pipe(mergeMap(() => throwError(() => new Error('Operación no implementada'))));
  }
}

/* =======================================================
 * MOCK
 * ==================================================== */
@Injectable({
  providedIn: 'root',
})
export class GeminiServiceMock implements GeminiService {

    private readonly prompts: string[] = [
        'A emplear en la creación de combinaciones vibrantes.',
        'Inspirado en atmósferas de calma minimalista.',
        'Diseñado para evocar sensaciones cálidas y acogedoras.',
        'Pensado para estilos urbanos modernos.',
        'Ideal para transmitir sofisticación y elegancia.',
        'Con notas visuales frescas y naturales.',
        'Para generar contrastes atrevidos y dinámicos.',
        'Orientado a composiciones suaves y equilibradas.',
        'Con una estética contemporánea y limpia.',
        'Enfocado en una expresión artística emocional.'
    ];

    getSuggestionPrompt(conceptContext: string): Observable<string> {
      const randomPrompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];

      return of(randomPrompt)
          .pipe(delay(1000))
          .pipe(shareReplay(1));
    }

    getInterpretation(colorPalette: ColorPalette): Observable<string> {
      const randomPrompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];

      return of(randomPrompt)
          .pipe(delay(100))
          .pipe(shareReplay(1));
    }
}