import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private httpClient: HttpClient) { }

  getProgress() {
    return this.httpClient.get<any>('http://localhost:8000/api/habit/progress')
  }

  getHabits() {
    return this.httpClient.get<any>('http://localhost:8000/api/habit')
  }

  postProgress(habit: string, date: Date, completed: number) {

    interface HabitProgress {
      habit: string;
      date: Date;
      completed: number;
    }

    const habitProgress: HabitProgress = { habit, date, completed };
    return this.httpClient.put('http://localhost:8000/api/habit/update/', habitProgress).subscribe();
  }
}
