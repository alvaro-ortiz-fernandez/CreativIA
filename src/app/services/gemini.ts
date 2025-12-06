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
        'Enfocado en una expresión artística emocional.',

        'Con influencia de paisajes mediterráneos.',
        'Inspirado en la serenidad de la naturaleza.',
        'Para comunicar energía positiva.',
        'Con un enfoque elegante y sobrio.',
        'Pensado para ambientes relajantes.',
        'Ideal para branding moderno.',
        'Diseñado para transmitir confianza.',
        'Con una vibra juvenil y dinámica.',
        'Perfecto para proyectos creativos.',
        'Pensado para generar impacto visual.',

        'Inspirado en la estética escandinava.',
        'Con una paleta fresca y ligera.',
        'Para lograr ambientes armónicos.',
        'Con una intención expresiva clara.',
        'Diseñado para destacar sin saturar.',
        'Para composiciones visuales minimalistas.',
        'Inspirado en tonos de temporada.',
        'Enfocado en un balance cromático preciso.',
        'Con un estilo limpio y funcional.',
        'Pensado para comunicar modernidad.',

        'Para transmitir sensaciones optimistas.',
        'Inspirado en paisajes urbanos nocturnos.',
        'Con carácter sofisticado.',
        'Pensado para espacios digitales.',
        'Para composiciones visuales audaces.',
        'Con un tono elegante pero accesible.',
        'Inspirado en la estética editorial.',
        'Diseñado para causar buena primera impresión.',
        'Para transmitir profesionalismo.',
        'Enfocado en claridad visual.',

        'Ideal para destacar elementos clave.',
        'Con una inspiración artística contemporánea.',
        'Para comunicar innovación.',
        'Pensado para proyectos tecnológicos.',
        'Inspirado en la naturaleza salvaje.',
        'Con contrastes refinados.',
        'Para lograr una experiencia visual envolvente.',
        'Diseñado para transmitir bienestar.',
        'Con énfasis en tonos suaves.',
        'Para crear ambientes reconfortantes.',

        'Inspirado en galerías de arte modernas.',
        'Diseñado para atraer la atención.',
        'Con una narrativa visual definida.',
        'Pensado para estética premium.',
        'Para transmitir exclusividad.',
        'Con una paleta de tonos terrosos.',
        'Inspirado en tonos oceánicos.',
        'Pensado para relajación visual.',
        'Para diseñar experiencias inmersivas.',
        'Con un estilo limpio y ordenado.',

        'Inspirado en la luz del amanecer.',
        'Ideado para transmitir frescura.',
        'Con un toque sutil de sofisticación.',
        'Para propuestas visuales distintivas.',
        'Diseñado para identidad de marca.',
        'Enfocado en composiciones balanceadas.',
        'Para crear atmósferas delicadas.',
        'Inspirado en tonos pastel suaves.',
        'Con una estética accesible.',
        'Para transmitir cercanía emocional.',

        'Pensado para ambientes estimulantes.',
        'Con una vibra creativa.',
        'Inspirado en festivales de diseño.',
        'Para generar sensación de movimiento.',
        'Diseñado para destacar sin exagerar.',
        'Con una intención visual clara.',
        'Para fortalecer la identidad gráfica.',
        'Inspirado en ilustración digital.',
        'Con una paleta moderna.',
        'Para comunicar originalidad.'
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