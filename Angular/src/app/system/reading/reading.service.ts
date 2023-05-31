import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private httpClient: HttpClient) { }

  getData() {
    return this.httpClient.get<any>(`${environment.apiUrl}book`)
  }

  postData(id: number, bookData: any) {
    return this.httpClient.put(`${environment.apiUrl}book/${id}/`, bookData).subscribe();
  }

  get_settings() {
    return this.httpClient.get<any>(`${environment.apiUrl}settings`)
  }

  post_settings(value: number) {
    return this.httpClient.put(`${environment.apiUrl}settings/`, {setting: 'last_book', value: value}).subscribe()
  }


}
