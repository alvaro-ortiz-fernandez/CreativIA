import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { delay, map, Observable, of, shareReplay } from 'rxjs';
import { Concept } from '../model/colors/Concept';
import { Color } from '../model/colors/Color';

/* =======================================================
 * INTERFAZ
 * ==================================================== */
export interface Text2ColorService {
  text2Color(concept: Concept): Observable<Color>;
}

/* =======================================================
 * IMPLEMENTACIÓN
 * ==================================================== */
@Injectable({
  providedIn: 'root',
})
export class Text2ColorServiceHttp implements Text2ColorService {
  
  private apiUrl: string = 'https://api.text2color.com';
  private apiKey = { 'X-API-Key': this.decodeConfig('LCsuKih7Ky4vfCkqLCkvLCB+fisrLiogKykqICx5IS8=') };
  private httpClient: HttpClient = inject(HttpClient);
  
  text2Color(concept: Concept): Observable<Color> {
    let text: string = concept.context
    if (concept.suggestion) {
      if (text && !text.endsWith('.'))
        text += `.`;

      text += ` ${concept.suggestion}`;
    }

    const headers = this.apiKey;

    // GET /color/sky%20blue
    return this.httpClient.get<Text2ColorResponse>(
        this.apiUrl + `/color/${encodeURIComponent(text)}`,
        { headers }
      )
      .pipe(map(response => this.toColor(response)));
  }
  
  private toColor(response: Text2ColorResponse): Color {
    return new Color(
        response?.color_description,
        response?.hex_code,
        response?.rgb?.[0],
        response?.rgb?.[1],
        response?.rgb?.[2]
      );
  }

  private decodeConfig(encoded: string, key = 24) {
    return atob(encoded)
      .split('')
      .map(c => String.fromCharCode(c.charCodeAt(0) ^ key))
      .join('');
  }
}

export interface Text2ColorResponse {
  color_description?: string;
  hex_code?: string;
  rgb?: number[];
  cmyk?: number[];
}

/* =======================================================
 * MOCK
 * ==================================================== */
@Injectable({
  providedIn: 'root',
})
export class Text2ColorServiceMock implements Text2ColorService {
  
  text2Color(concept: Concept): Observable<Color> {
    return of(this.randomColor())
        .pipe(delay(1000))
        .pipe(shareReplay(1));
  }

  private randomColor(): Color {
    const r = this.randomChannel();
    const g = this.randomChannel();
    const b = this.randomChannel();
    const hex = `#${this.toHex(r)}${this.toHex(g)}${this.toHex(b)}`;
    const names = [
      'Royal Orange', 'Ocean Blue', 'Emerald Green', 'Sunset Pink',
      'Lavender Mist', 'Golden Yellow', 'Coral Red', 'Sky Teal',
      'Deep Purple', 'Soft Gray'
    ];

    // Elegimos un nombre aleatorio
    const name = names[Math.floor(Math.random() * names.length)];
    return new Color(name, hex, r, g, b);
  }

  private randomChannel(): number {
    return Math.floor(Math.random() * 256); // 0-255
  }

  private toHex(value: number): string {
    const hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }
}