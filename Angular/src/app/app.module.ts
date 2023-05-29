import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table'
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ApplicationModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';


import { AppComponent } from './app.component';
import { SidenavComponent } from './menu/sidenav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BodyComponent } from './body/body.component';
import { HabitsComponent } from './habits/habits.component';
import { TasksComponent } from './tasks/tasks.component';
import { ReadingComponent } from './reading/reading.component';
import { GratitudeComponent } from './gratitude/gratitude.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlashComponent } from './flash/flash.component';
import { EditCardComponent } from './flash/edit-card/edit-card.component';



@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    DashboardComponent,
    BodyComponent,
    HabitsComponent,
    TasksComponent,
    ReadingComponent,
    GratitudeComponent,
    FlashComponent,
    EditCardComponent,
  ],
  imports: [
    ApplicationModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    MatTableModule,
    HttpClientModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    FontAwesomeModule,
    QuillModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
