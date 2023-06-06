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
import { SidenavComponent } from './system/menu/sidenav.component';
import { DashboardComponent } from './system/dashboard/dashboard.component';
import { BodyComponent } from './system/body/body.component';
import { HabitsComponent } from './system/habits/habits.component';
import { TasksComponent } from './system/tasks/tasks.component';
import { ReadingComponent } from './system/reading/reading.component';
import { GratitudeComponent } from './system/gratitude/gratitude.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlashComponent } from './system/flash/flash.component';
import { EditCardComponent } from './system/flash/edit-card/edit-card.component';
import { SystemComponent } from './system/system.component';
import { HomeComponent } from './home/home.component';
import { BooksComponent } from './system/books/books.component';
import { HeadComponent } from './system/head/head.component';



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
    SystemComponent,
    HomeComponent,
    BooksComponent,
    HeadComponent,
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
