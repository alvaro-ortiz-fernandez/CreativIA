import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RestClient } from './rest-client';
import { delay, Observable, of, shareReplay } from 'rxjs';
import { Concept } from '../model/colors/Concept';
import { Color } from '../model/colors/Color';

@Injectable({
  providedIn: 'root',
})
export class Text2ColorService {
  
  private restClient = new RestClient(inject(HttpClient), 'https://api.text2color.com');
  
  text2Color(concept: Concept): Observable<Color> {
    return of(new Color('Royal Orange', '#FF9E47', 255, 158, 71))
        .pipe(delay(1000))
        .pipe(shareReplay(1));
  }
}