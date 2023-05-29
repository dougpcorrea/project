import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private httpClient: HttpClient) { }

  getBirthdays() {
    return this.httpClient.get<any>('http://localhost:8000/api/birthday')
  }

}
