import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export class RestClient {

  constructor(private httpClient: HttpClient, private baseUrl: string) {}

  get<T>(url: string, params?: any): Observable<T> {
    return this.httpClient.get<T>(this.baseUrl + url, { params });
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.httpClient.post<T>(this.baseUrl + url, body);
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.httpClient.put<T>(this.baseUrl + url, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.httpClient.delete<T>(this.baseUrl + url);
  }
}