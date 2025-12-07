import { Injectable } from '@angular/core';
import { delay, from, map, mergeMap, Observable, of, shareReplay, throwError, timer } from 'rxjs';
import { ColorPalette } from '../model/colors/ColorPalette';
import { GenerateContentResponse, GoogleGenAI } from '@google/genai';

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

  private googleGenAI: GoogleGenAI = new GoogleGenAI({
    // https://aistudio.google.com/api-keys
    apiKey: this.decodeConfig('WVFieUthWixNdUBNYSBuai5uUytsLG1Lfl1oelR+UV5cdCxeQk93')
  });

  getSuggestionPrompt(conceptContext: string): Observable<string> {
    const prompt = `
    Eres un generador profesional de prompts para crear paletas de colores.
    Tu tarea es producir un único prompt breve, claro y visualmente descriptivo que sirva para que otra IA genere una paleta de colores.

    REGLAS:
    - Esto es lo que quiere el usuario de la paleta, tómalo en cuenta: ${conceptContext}
    - Evita repetir escenarios, colores o emociones comunes.
    - Sé lo más original y creativo posible en cada prompt.
    - Genera prompts que sean muy diferentes entre sí.
    - No devuelvas explicaciones ni texto extra: SOLO el prompt final.
    - No incluyas códigos hexadecimales ni nombres técnicos.
    - Describe sensaciones, ambientes, materiales, luz, emociones y estilos.
    - Usa lenguaje evocador y concreto.
    - Longitud máxima: 1–2 frases.

    FORMATO:
    [Prompt descriptivo]

    EJEMPLOS DE VARIEDAD:
    - “Atardecer cálido en un pueblo costero mediterráneo, luz dorada sobre paredes blancas y detalles en azul profundo.”
    - “Interior minimalista japonés, tonos naturales de madera clara con sombras suaves y acentos negros.”
    - “Bosque místico cubierto de niebla, hojas mojadas reflejando la luz de la luna, atmósfera etérea y silenciosa.”

    Genera un prompt ahora, tratando de que sea muy distinto a los ejemplos anteriores.
    `;

    return this.getAIMessage(prompt);
  }
  
  getInterpretation(colorPalette: ColorPalette): Observable<string> {
    const prompt = `
    Eres un experto en diseño e interpretación de paletas de color.

    Quiero que analices la siguiente paleta y generes una **interpretación textual clara y atractiva para un usuario final**.

    La interpretación debe:
    - Describir qué sensaciones transmite la combinación de colores.
    - Mencionar para qué contextos o usos visuales es adecuada (branding, web, marketing, interiorismo, etc.).
    - Tener un tono inspirador y profesional.
    - Tener una longitud de entre 2 y 4 frases.
    - No hagas listas ni encabezados: devuelve un único texto fluido.

    DATOS DE LA PALETA:

    Color base:
    - Nombre: ${colorPalette.baseColor.name || 'Sin nombre'}
    - Hex: ${colorPalette.baseColor.hex}
    - RGB: (${colorPalette.baseColor.r}, ${colorPalette.baseColor.g}, ${colorPalette.baseColor.b})

    Colores secundarios:
    ${colorPalette.colors.map((c, i) => `
    ${i + 1}. ${c.name || 'Color sin nombre'} - ${c.hex} - RGB(${c.r}, ${c.g}, ${c.b})
    `).join('')}

    Esquema cromático:
    - Tipo: ${colorPalette.scheme.type}
    - Número de tonos: ${colorPalette.scheme.tones}

    Concepto asociado:
    - Contexto: ${colorPalette.concept.context}
    - Sugerencia: ${colorPalette.concept.suggestion}

    Devuelve únicamente el texto final de interpretación, sin explicaciones adicionales ni etiquetas.
    `;
    return this.getAIMessage(prompt);
  }

  private getAIMessage(prompt: string): Observable<string> {
    const response: Promise<GenerateContentResponse> = this.googleGenAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return from(response)
      .pipe(map((r) => r.text || ''));
  }

  private decodeConfig(encoded: string, key = 24) {
    return atob(encoded)
      .split('')
      .map(c => String.fromCharCode(c.charCodeAt(0) ^ key))
      .join('');
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