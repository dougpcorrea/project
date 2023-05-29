import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private httpClient: HttpClient) { }

  getData() {
    return this.httpClient.get<any>('http://localhost:8000/api/book')
  }

  postData(id: number, bookData: any) {
    return this.httpClient.put(`http://localhost:8000/api/book/${id}/`, bookData).subscribe();
  }

  get_settings() {
    return this.httpClient.get<any>('http://localhost:8000/api/settings?setting=last_book')
  }

  post_settings(value: number) {
    return this.httpClient.put('http://localhost:8000/api/settings/', {setting: 'last_book', value: value}).subscribe()
  }


}
