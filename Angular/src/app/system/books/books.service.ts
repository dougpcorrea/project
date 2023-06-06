import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class BooksService {

  constructor(private httpClient: HttpClient) { }

  private getDataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  getData() {
    const cachedTasks = this.getDataSubject.getValue();
    if (cachedTasks.length > 0) {
      return this.getDataSubject.asObservable();
    } else {
      return this.httpClient.get<any>(`${environment.apiUrl}book`).pipe(
        tap((res) => this.getDataSubject.next(res))
      );
    }
  }

  getBooks() {
      return this.httpClient.get<any>(`${environment.apiUrl}catalogue`).pipe(
          map(catalogue => catalogue.slice(10, 15))
        );
  }
}
