import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataService } from './habits.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
    selector: 'app-habits',
    templateUrl: './habits.component.html',
    styleUrls: ['./habits.component.scss']
})

export class HabitsComponent implements OnInit {

    constructor(private dataService: DataService, private httpClient: HttpClient) { }

    @ViewChild('habitsTable') habitsTable!: ElementRef;

    dataSource: any
    habits: any[] = [];
    displayedDates: string[] = [];



    ngOnInit() {
        const today = new Date();
        const endDate = new Date(); // Set the end date as today
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 29); // Subtract 30 days from the end date
      
        const displayedDates: string[] = [];
      
        while (startDate <= endDate) {
          const year = startDate.getFullYear();
          const month = startDate.getMonth() + 1;
          const day = startDate.getDate();
      
          const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          displayedDates.push(formattedDate);
      
          startDate.setDate(startDate.getDate() + 1); // Increment the start date by 1 day
        }
      
        this.displayedDates = displayedDates;
      
        this.dataService.getHabits().subscribe(res => {
          this.habits = res;
        });
      
        this.dataService.getProgress().subscribe(res => {
          this.dataSource = res;
        });
      }



    getHabitProgress(habit: number, date: string): number {
        if (this.dataSource) { // Check if dataSource is defined
            const habitProgress = this.dataSource.find((data: { habit: number; date: string; }) => data.habit === habit && data.date === date);

            if (habitProgress) {
                return habitProgress.completed;
            }
        }
        return 0;
    }

    formatDate(date: string): string {
        const parsedDate = new Date(date);
        parsedDate.setDate(parsedDate.getDate() + 1);
        const day = parsedDate.getDate();
        return day.toString();
    }

    onClick(event: any) {

        let date = event.target.querySelector('.date').attributes.id.nodeValue
        let habit = event.target.querySelector('.habit').attributes.id.nodeValue
        let completed = event.target.querySelector('.completed').attributes.id.nodeValue

        console.log(completed)

        if (completed == 0) {
            event.target.querySelector('.completed').attributes.id.nodeValue = 1
            completed = 1
            event.target.querySelector('i').classList.remove('fal', 'fa-square', 'gray')
            event.target.querySelector('i').classList.add('fad', 'fa-check-square', 'green')
        }
        else if (completed == 1) {
            event.target.querySelector('.completed').attributes.id.nodeValue = 2
            completed = 2
            event.target.querySelector('i').classList.remove('fa-check-square', 'green')
            event.target.querySelector('i').classList.add('fa-minus-square', 'yellow')
        }
        else if (completed == 2) {
            event.target.querySelector('.completed').attributes.id.nodeValue = 3
            completed = 3
            event.target.querySelector('i').classList.remove('fa-minus-square', 'yellow')
            event.target.querySelector('i').classList.add('fa-times-square', 'red')
        }
        else if (completed == 3) {
            event.target.querySelector('.completed').attributes.id.nodeValue = 0
            completed = 0
            event.target.querySelector('i').classList.remove('fad', 'fa-times-square', 'red')
            event.target.querySelector('i').classList.add('fal', 'fa-square', 'gray')
        }

        this.dataService.postProgress(habit, date, completed)

    }

}
