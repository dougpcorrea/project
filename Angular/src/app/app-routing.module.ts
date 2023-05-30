import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlashComponent } from './flash/flash.component';
import { HabitsComponent } from './habits/habits.component';
import { TasksComponent } from './tasks/tasks.component';
import { environment } from 'src/environments/environment';


const routes: Routes = [

  {path: 'habits', component: HabitsComponent},
  {path: 'tasks', component: TasksComponent},
  {path: 'flash', component: FlashComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
