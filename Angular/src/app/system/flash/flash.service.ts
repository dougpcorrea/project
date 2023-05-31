import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private httpClient: HttpClient) { }

  get_cards() {
    return this.httpClient.get<any>('http://localhost:8000/api/cards')
  }

  getDecks() {
    return this.httpClient.get<any>('http://localhost:8000/api/decks')
  }

}
