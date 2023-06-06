import { Component, Inject, OnInit } from '@angular/core';
import { navbarData } from './nav-data';
import { Tasks, Books, Projects, Genre, Habits } from './nav-data'
import { SidenavService } from './sidenav.service';
import { Router } from '@angular/router';
import { HabitsService } from '../habits/habits.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {

    constructor (
        private SidenavService: SidenavService,
        private HabitsService: HabitsService,
        private router: Router, 
    ) {}

    navData = navbarData
    submenu!: any
    secondSubmenu!: any
    selected!: any

    ngOnInit(): void {
        this.change(this.router.url)
        console.log(this.router.url)
    }

    change(label: string){
        if (label.includes('/')){} else {label = '/' + label}
    
        this.selected = label;

        if (label === '/tasks') {this.submenu = Tasks; this.secondSubmenu = Projects}
        else if (label === '/books') {this.submenu = Books; this.secondSubmenu = Genre}
        else if (label === '/habits') {this.submenu = Habits; this.HabitsService.getHabits().subscribe((res) => {
            this.secondSubmenu = res.map((item: { habit: any; }) => {
                return { 
                  title: item.habit, // Replace "newKeyName" with the desired new key name
                  icon: 'fal fa-circle'
                };
              });
        })}
    }

    method(label: string): void{
        if (this.selected === '/tasks') {this.SidenavService.sendClickEvent(label)}
    }   

}