import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { RestClient } from './rest-client';

@Injectable({
  providedIn: 'root',
})
export class TheColorAPIService {
  
  private restClient = new RestClient(inject(HttpClient), 'https://www.thecolorapi.com');
}