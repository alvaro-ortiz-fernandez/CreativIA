import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GeminiService } from '../../services/gemini';
import { Text2ColorService } from '../../services/text2-color';
import { TheColorAPIService } from '../../services/the-color-api';
import { BtnSpinner } from '../../components/btn-spinner/btn-spinner';

@Component({
  selector: 'app-compose',
  imports: [RouterLink, BtnSpinner],
  templateUrl: './compose.html',
  styleUrl: './compose.scss',
})
export class Compose {

  geminiService: GeminiService = inject(GeminiService);
  text2ColorService: Text2ColorService = inject(Text2ColorService);
  theColorAPIService: TheColorAPIService = inject(TheColorAPIService);
}