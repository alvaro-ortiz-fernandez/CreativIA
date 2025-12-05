import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RestClient } from './rest-client';
import { delay, map, Observable, of, shareReplay } from 'rxjs';
import { Color } from '../model/colors/Color';
import { ColorScheme } from '../model/colors/ColorScheme';
import { ColorPalette } from '../model/colors/ColorPalette';
import { Concept } from '../model/colors/Concept';

export interface GetSchemeResponse {
  mode: string;
  count: number;
  seed: ApiColor;
  colors: ApiColor[];
}

export interface ApiColor {
  name: ApiValue;
  hex: ApiValue;
  rgb: ApiRgb;
}

export interface ApiRgb {
  r: number;
  g: number;
  b: number;
}

export interface ApiValue {
  value: string;
}

/* =======================================================
 * INTERFAZ
 * ==================================================== */
export interface TheColorAPIService {
  getColorPalette(color: Color, scheme: ColorScheme, concept: Concept): Observable<ColorPalette>;
}

/* =======================================================
 * IMPLEMENTACIÓN
 * ==================================================== */
@Injectable({
  providedIn: 'root',
})
export class TheColorAPIServiceHttp implements TheColorAPIService {
  
  private restClient = new RestClient(inject(HttpClient), 'https://www.thecolorapi.com');
    
  getColorPalette(color: Color, scheme: ColorScheme, concept: Concept): Observable<ColorPalette> {
    const params = {
      hex: color.hex.replace('#', ''),
      format: 'json',
      mode: scheme.type,
      count: scheme.tones
    };

    // GET /scheme?hex=0047AB&format=json&mode=monochrome&count=5
    return this.restClient.get<GetSchemeResponse>('/scheme', params)
      .pipe(
        map((response) => this.toColorPalette(response, concept)),
        shareReplay(1)
      );
  }

  private toColorPalette(response: GetSchemeResponse, concept: Concept): ColorPalette {
    const id: string = "1";
    const baseColor: Color = this.toColor(response?.seed);
    const colors: Color[] = response?.colors?.map((c) => this.toColor(c));
    const scheme: ColorScheme = new ColorScheme(response?.mode, response?.count);

    return new ColorPalette(id, baseColor, colors, scheme, concept);
  }

  private toColor(apiColor: ApiColor): Color {
    return new Color(
        apiColor?.name?.value,
        apiColor?.hex?.value,
        apiColor?.rgb?.r,
        apiColor?.rgb?.g,
        apiColor?.rgb?.b
      );
  }
}

/* =======================================================
 * MOCK
 * ==================================================== */
@Injectable({
  providedIn: 'root',
})
export class TheColorAPIServiceMock implements TheColorAPIService {

  getColorPalette(color: Color, scheme: ColorScheme): Observable<ColorPalette> {
    const palette = this.generatePalette(color, scheme);
    return of(palette).pipe(
      delay(100),
      shareReplay(1)
    );
  }

  private generatePalette(baseColor: Color, scheme: ColorScheme): ColorPalette {
    const colors: Color[] = [];

    for (let i = 0; i < scheme.tones; i++) {
      colors.push(this.variationColor(baseColor, i, scheme.tones));
    }

    const id = 'mock-' + Math.floor(Math.random() * 1000);
    return new ColorPalette(id, baseColor, colors, scheme);
  }
  
  private variationColor(base: Color, index: number, total: number): Color {
    // Ajustamos el factor de variación según la posición
    const factor = (index - Math.floor(total / 2)) / total; // entre -0.5 y +0.5
    const r = this.clamp(base.r + Math.round(50 * factor + this.randomOffset()), 0, 255);
    const g = this.clamp(base.g + Math.round(50 * factor + this.randomOffset()), 0, 255);
    const b = this.clamp(base.b + Math.round(50 * factor + this.randomOffset()), 0, 255);
    const hex = `#${this.toHex(r)}${this.toHex(g)}${this.toHex(b)}`;

    return new Color('', hex, r, g, b);
  }

  private randomOffset(): number {
    return Math.floor(Math.random() * 21 - 10); // entre -10 y +10
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private toHex(value: number): string {
    const hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }
}