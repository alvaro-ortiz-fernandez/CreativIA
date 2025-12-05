import { Injectable } from '@angular/core';
import { delay, Observable, of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  
    getSuggestionPrompt(conceptContext: string): Observable<string> {
      return of("A emplear en la creación de combinaciones vibrantes.")
          .pipe(delay(1000))
          .pipe(shareReplay(1));
    }
}