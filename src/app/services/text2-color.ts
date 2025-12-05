import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RestClient } from './rest-client';
import { delay, mergeMap, Observable, of, shareReplay, throwError, timer } from 'rxjs';
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
  
  private restClient = new RestClient(inject(HttpClient), 'https://api.text2color.com');
  
  text2Color(concept: Concept): Observable<Color> {
    return timer(1000)
      .pipe(mergeMap(() => throwError(() => new Error('Operación no implementada'))));
  }
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