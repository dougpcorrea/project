import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BooksComponent } from './system/books/books.component';
import { DashboardComponent } from './system/dashboard/dashboard.component';
import { FlashComponent } from './system/flash/flash.component';
import { HabitsComponent } from './system/habits/habits.component';
import { SystemComponent } from './system/system.component';
import { TasksComponent } from './system/tasks/tasks.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: '',
        component: SystemComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'books', component: BooksComponent },
            { path: 'habits', component: HabitsComponent },
            { path: 'tasks', component: TasksComponent },
            { path: 'flash', component: FlashComponent },
        ]
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
