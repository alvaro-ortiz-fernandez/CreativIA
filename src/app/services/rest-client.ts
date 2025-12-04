import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export class RestClient {

  constructor(private httpClient: HttpClient, baseUrl: string) {}

  get<T>(url: string, params?: any): Observable<T> {
    return this.httpClient.get<T>(url, { params });
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.httpClient.post<T>(url, body);
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.httpClient.put<T>(url, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.httpClient.delete<T>(url);
  }
}