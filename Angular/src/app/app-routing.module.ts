import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlashComponent } from './flash/flash.component';
import { HabitsComponent } from './habits/habits.component';
import { TasksComponent } from './tasks/tasks.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
//   {path: 'dashboard', component: DashboardComponent},
  {path: 'habits', component: HabitsComponent},
  {path: 'tasks', component: TasksComponent},
  {path: 'flash', component: FlashComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
