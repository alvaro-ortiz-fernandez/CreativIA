import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RestClient } from './rest-client';
import { delay, Observable, of, shareReplay } from 'rxjs';
import { Color } from '../model/colors/Color';
import { ColorScheme } from '../model/colors/ColorScheme';
import { ColorPalette } from '../model/colors/ColorPalette';

@Injectable({
  providedIn: 'root',
})
export class TheColorAPIService {
  
  private restClient = new RestClient(inject(HttpClient), 'https://www.thecolorapi.com');
    
  getColorPalette(color: Color, scheme: ColorScheme): Observable<ColorPalette> {
    return of(new ColorPalette())
        .pipe(delay(1000))
        .pipe(shareReplay(1));
  }
}