import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private httpClient: HttpClient) { }

  get_cards() {
    return this.httpClient.get<any>(`${environment.apiUrl}cards`)
  }

  getDecks() {
    return this.httpClient.get<any>(`${environment.apiUrl}decks`)
  }

}
