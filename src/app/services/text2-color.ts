import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RestClient } from './rest-client';

@Injectable({
  providedIn: 'root',
})
export class Text2ColorService {
  
  private restClient = new RestClient(inject(HttpClient), 'https://api.text2color.com');
}