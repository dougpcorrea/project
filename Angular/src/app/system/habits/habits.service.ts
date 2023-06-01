import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private httpClient: HttpClient) { }

  private getProgressSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private getHabitsSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  getHabits() {
    const cachedTasks = this.getHabitsSubject.getValue();
    if (cachedTasks.length > 0) {
      return this.getHabitsSubject.asObservable();
    } else {
      return this.httpClient.get<any>(`${environment.apiUrl}habit`).pipe(
        tap((tasks) => this.getHabitsSubject.next(tasks))
      );
    }
  }

  getProgress() {
    const cachedTasks = this.getProgressSubject.getValue();
    if (cachedTasks.length > 0) {
      return this.getProgressSubject.asObservable();
    } else {
        return this.httpClient.get<any>(`${environment.apiUrl}habit/progress`).pipe(
        tap((tasks) => this.getProgressSubject.next(tasks))
      );
    }
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
