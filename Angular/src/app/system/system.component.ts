import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { BooksService } from './books/books.service';
import { TasksService } from './tasks/tasks.service';
import { HabitsService } from './habits/habits.service'

interface SideNavToggle {
    screenWidth: number;
    collapsed: boolean;
  }

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements AfterViewInit, OnInit{

    constructor(
        private TasksService: TasksService,
        private BooksService: BooksService,
        private HabitsService: HabitsService,
    ) {}

    load = true;
    
    title = 'Projects';

    isSideNavCollapsed = false;
    screenWidth = 0;

    ngOnInit (){
        this.HabitsService.getHabits().subscribe()
        this.HabitsService.getProgress().subscribe()
        this.TasksService.getTasks().subscribe()
        this.BooksService.getData().subscribe()
    }

    ngAfterViewInit(){
        this.load = true;
    }
    
    onToggleSideNav(data: SideNavToggle): void {
      this.screenWidth = data.screenWidth;
      this.isSideNavCollapsed = data.collapsed;
    }
  

}
