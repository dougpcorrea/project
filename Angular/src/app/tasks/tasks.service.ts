import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private httpClient: HttpClient) { }

  getTasks() {
    return this.httpClient.get<any>(`${environment.apiUrl}task`)
  }

  addTask(id: number, task: string, date: any, priority: any, project: any,  ordering: number, status: number, subtask: number, repeat: number){

    interface TaskInterface {
      id: number;
      task: string;
      date: any;
      priority: any
      project: any
      ordering: number
      status: number
      subtask: number
      repeat: number
    }

    const taskInterface: TaskInterface = {id, task, date, priority, project, ordering, status, subtask, repeat};
    return this.httpClient.post(`${environment.apiUrl}task`, taskInterface).subscribe();
  }

  deleteTask(id: number){
    this.httpClient.delete(`${environment.apiUrl}task/${id}`).subscribe();
  }

  updateTaskName(id: number, task: string){
    this.httpClient.put(`${environment.apiUrl}task/${id}/`, {task: task}).subscribe();
  }

  updateTaskStatus(id: number, status: number){
    this.httpClient.put(`${environment.apiUrl}task/${id}/`, {status: status}).subscribe();
  }

  updateTaskDate(id: number, date: any){
    this.httpClient.put(`${environment.apiUrl}task/${id}/`, {date: date}).subscribe();
  }

  updateRepeat(id: number, repeat: number){
    this.httpClient.put(`${environment.apiUrl}task/${id}/`, {repeat: repeat}).subscribe();
  }

  updateProject(id: number, project: string){
    this.httpClient.put(`${environment.apiUrl}task/${id}/`, {project: project}).subscribe();
  }

  updateTaskPriority(id: number, priority: number){
    this.httpClient.put(`${environment.apiUrl}task/${id}/`, {priority: priority}).subscribe();
  }

  getKarma(){
    return this.httpClient.get<any>(`${environment.apiUrl}karma`)
  }

  updateKarma(date: string, completed: number){
    this.httpClient.post(`${environment.apiUrl}karma`, {date: date, completed: completed}).subscribe();
  }


}
