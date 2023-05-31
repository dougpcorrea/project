import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private httpClient: HttpClient) { }

  getProgress() {
    return this.httpClient.get<any>(`${environment.apiUrl}habit/progress`)
  }

  getHabits() {
    return this.httpClient.get<any>(`${environment.apiUrl}habit`)
  }

  postProgress(habit: string, date: Date, completed: number) {

    interface HabitProgress {
      habit: string;
      date: Date;
      completed: number;
    }

    const habitProgress: HabitProgress = { habit, date, completed };
    return this.httpClient.put(`${environment.apiUrl}habit/update/`, habitProgress).subscribe();
  }
}
