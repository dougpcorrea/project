import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { DataService } from './tasks.service';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ViewChildren, QueryList } from '@angular/core';
import { CdkDragDrop, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { DOCUMENT } from '@angular/common';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { parseTemplate } from '@angular/compiler';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss']
})

export class TasksComponent implements OnInit {

    constructor(private dataService: DataService, @Inject(DOCUMENT) private document: Document) { }

    @ViewChild('taskInput') taskInput!: ElementRef;
    @ViewChild('dateInput') dateInput!: ElementRef;
    @ViewChild('todoList') todoList!: ElementRef;
    @ViewChild('prioritySelect') prioritySelect!: MatSelect;
    @ViewChild('projectSelect') projectSelect!: MatSelect;
    @ViewChild('updatePicker') updatePicker!: MatDatepicker<any>;
    @ViewChildren('prioritySetter') prioritySetter!: QueryList<MatSelect>;

    tasks: Array<{
        id: number,
        task: string,
        date: any,
        priority: any,
        ordering: number,
        project: any,
        status: number,
        subtask: number,
        repeat: number
    }> = [];

    subtasks: Array<{
        id: number,
        task: string,
        date: any,
        priority: any,
        ordering: number,
        project: any,
        status: number,
        subtask: number,
        repeat: number
    }> = [];

    filteredSubtasks: Array<{
        id: number,
        task: string,
        date: any,
        priority: any,
        ordering: number,
        project: any,
        status: number,
        subtask: number,
        repeat: number
    }> = [];

    filteredTasks: Array<{
        id: number,
        task: string,
        date: any,
        priority: any,
        ordering: number,
        project: any,
        status: number,
        subtask: number,
        repeat: number
    }> = [];

    priority: number = 3;
    project: string = 'Inbox'
    inputStatus: boolean = false;
    subtaskInputStatus: boolean = false;
    isDisabled: boolean = false;
    repeat = false;
    show = false;
    spanInserted = false;
    formDate = new FormControl(new Date())
    pipeDate = new DatePipe('en-US');
    date: any = 'No date selected'
    hoje = new Date();
    today = new Date(this.hoje.getFullYear(), this.hoje.getMonth(), this.hoje.getDate()).toISOString().split('T')[0];
    startDate = new Date();
    endDate = new Date(this.startDate.setDate(this.startDate.getDate() + 7)).toISOString().split('T')[0];
    title: string = 'Today'
    task: string = ''
    smartDate = ''
    smartDateFormated: any = 'No date selected'

    completedTasks: number = 0;

    ngOnInit() {
        if (this.tasks.length === 0){
            this.dataService.getTasks().subscribe((res: any[]) => {
                res.forEach((task: any) => {
                    if (task.date === null) {
                        task.date = 'No date selected';
                    }
                });
                this.tasks = res;
                this.filteredTasks = res.filter((task: any) => task.status === 0 && task.date <= this.today && task.subtask === 0).sort((a: any, b: any) => a.ordering - b.ordering);
                this.subtasks = res.filter((task: any) => task.subtask !== 0).sort((a: any, b: any) => a.ordering - b.ordering);
                this.show = true;
            });
        }

        this.dataService.getKarma().subscribe(res => {
            let filteredData = res.filter((item: { date: string; }) => item.date === this.today);
            if (filteredData.length > 0) {
                this.completedTasks = filteredData[0].completed;
            } else {
                this.completedTasks = 0;
            }
        });

    }

    subtaskCounter(id: number) {
            const subtasks = this.subtasks.filter((task: any) => task.subtask === id).sort((a: any, b: any) => a.ordering - b.ordering).length
            if (subtasks === 0)
            return ''
        else {
            return subtasks
        }
    }

    subtaskCounterComplete(id: number) {
        const subtasks = this.subtasks.filter((task: any) => task.subtask === id).sort((a: any, b: any) => a.ordering - b.ordering).length
        const completedSubtasks = this.subtasks.filter((task: any) => task.subtask === id && task.status === 1).sort((a: any, b: any) => a.ordering - b.ordering).length
        if (subtasks === 0)
            return ''
        else {
            return String(completedSubtasks + "/")
        }
        
}

    filterSubtasks(event: any, id: number) {
        const selector = `#subtask${id}`;
        const taskSelector = `#task${id}`;

        const elements = document.querySelectorAll(selector);
        const taskElements = document.querySelectorAll(taskSelector);

        const subtasks = this.subtasks.filter((task: any) => task.subtask === id).sort((a: any, b: any) => a.ordering - b.ordering);

        if (subtasks.length >= 0) {
            this.filteredSubtasks = subtasks

            if (event.target.classList.contains('fa-chevron-up')) {
                this.document.querySelectorAll('.fa-chevron-up').forEach(element => { element.classList.remove('fa-chevron-up'); });
                this.document.querySelectorAll('.substasked').forEach(element => { element.classList.remove('substasked'); });
                this.document.querySelectorAll('.tasked').forEach(element => { element.classList.remove('tasked'); });
                event.target.classList.remove('fa-chevron-up')
                event.target.classList.add('fa-chevron-down')
                this.subtaskInputStatus = false;
            } else {
                this.document.querySelectorAll('.fa-chevron-up').forEach(element => { element.classList.remove('fa-chevron-up'); element.classList.add('fa-chevron-down'); });
                this.document.querySelectorAll('.substasked').forEach(element => { element.classList.remove('substasked'); });
                this.document.querySelectorAll('.tasked').forEach(element => { element.classList.remove('tasked'); });
                elements.forEach((element) => { element.classList.add('substasked'); });
                taskElements.forEach((element) => { element.classList.add('tasked'); });
                event.target.classList.remove('fa-chevron-down')
                event.target.classList.add('fa-chevron-up')
                this.subtaskInputStatus = false;
            }
        } else {

        }
    }

    filterData(element: any) {
        const id = element.currentTarget.id
        this.title = id

        this.isDisabled = false;

        this.document.querySelectorAll('.selected').forEach(element => { element.classList.remove('selected'); });
        element.target.classList.add('selected')

            if (id === 'Today') {
                this.filteredTasks = this.tasks.filter((task: any) =>
                    task.status === 0 &&
                    task.date <= this.today &&
                    task.subtask === 0
                ).sort((a: any, b: any) => a.ordering - b.ordering);
            } else if (id === 'This week') {
                this.filteredTasks = this.tasks.filter((task: any) =>
                    task.status === 0 &&
                    task.date >= this.today &&
                    task.date <= this.endDate &&
                    task.subtask === 0
                ).sort((a: any, b: any) => a.ordering - b.ordering);
            } else if (id === 'Overdue') {
                this.filteredTasks = this.tasks.filter((task: any) =>
                    task.status === 0 &&
                    task.date < this.today &&
                    task.subtask === 0
                ).sort((a: any, b: any) => a.ordering - b.ordering);
            } else if (id === 'Completed') {
                this.isDisabled = true;
                this.filteredTasks = this.tasks.filter((task: any) =>
                    task.status === 1 &&
                    task.subtask === 0
                ).sort((a: any, b: any) => a.ordering - b.ordering);
            } else {
                this.filteredTasks = this.tasks.filter((task: any) => task.status === 0 && task.project === id && task.subtask === 0).sort((a: any, b: any) => a.ordering - b.ordering);
            }
   
        if (this.title === 'Inbox' || this.title === 'Today' || this.title === 'This week' || this.title === 'Overdue' || this.title === 'Complete'){
            this.project = 'Inbox'
        } else {
            this.project = this.title
        }

        this.inputStatus = false;
    }

    isDateSelected(date: string) {
        if (date === 'No date selected') {
            return false
        } else {
            return true
        }
    }

    inputTask() {
        if (this.inputStatus === false) {
            this.date = 'No date selected'
        }
        
        this.inputStatus = true;
        setTimeout(() => { this.taskInput.nativeElement.focus() }, 25);
    }

    inputOpen(id: any) {
        const element = `#subtaskInput${id}`
        this.subtaskInputStatus = true;

        setTimeout(() => {
            const inputElements = this.document.querySelectorAll(element);
            (inputElements[0] as HTMLInputElement).focus();
        }, 50);
    }

    selectPriority() {
        this.prioritySelect.open()
    }

    getPriority(element: any) {
        let priority = element.target.innerText

        if (priority === 'Alta') {
            this.priority = 1
        } else if (priority === 'Média') {
            this.priority = 2
        } else {
            this.priority = 3
        }
    }

    getProject(element: any) {
        this.project = element.target.innerText
    }

    formatDate(date: string) {
        let newDate = new Date(date);
        let formatedDate = this.pipeDate.transform(newDate, 'MMMM d, y');
        return formatedDate
    }

    updateDate(date: any, id: number) {
        let finalDate = null
        let dateString = 'No date selected'

        if (date === null){
            date = 'No date selected'
        }

        if (date === 'No date selected') {
            finalDate = null
            dateString = date
        } else {
            finalDate = date.toISOString().slice(0, 10);
            dateString = date.toISOString().slice(0, 10);
        }

        if (id === 0){
            this.date = finalDate
        } else {
            const i_all = this.tasks.findIndex(function (x) { return x.id == id })
            const i_filter = this.filteredTasks.findIndex(function (x) { return x.id == id })
            this.filteredTasks[i_filter].date = dateString;
            this.tasks[i_all].date = dateString;
            this.dataService.updateTaskDate(id, finalDate)
        }

        const hoje = new Date()
        const data = new Date(finalDate  + 'T03:00:00Z')

        const diff = data.getDate() - hoje.getDate() 


        if ((this.title === 'Today' && diff !== 0) || (this.title === 'This week' && (diff > 7 || diff < 0))){
            const i_all = this.tasks.findIndex(function (x) { return x.id == id })
            const i_filter = this.filteredTasks.findIndex(function (x) { return x.id == id })
            this.tasks[i_all].status = 2;
            this.filteredTasks[i_filter].status = 2;
            setTimeout(() => { this.tasks.splice(i_all, 1), this.filteredTasks.splice(i_filter, 1) }, 250);
        }

    }

    updateProject(event: any, id: number) {
        const project = event.target.innerText

        const i_all = this.tasks.findIndex(function (x) { return x.id == id })
        const i_filter = this.filteredTasks.findIndex(function (x) { return x.id == id })
        this.tasks[i_all].project = project;
        this.filteredTasks[i_filter].project = project;
        this.dataService.updateProject(id, project)

        if (this.tasks.some(obj => obj.project === this.title) && project !== this.project){
            this.tasks[i_all].status = 2;
            this.filteredTasks[i_filter].status = 2;
            setTimeout(() => { this.tasks.splice(i_all, 1), this.filteredTasks[i_filter].status = 2; }, 250);
        }
    }

    addTask() {
        let date = this.date
        let id = Math.floor(100000000 + Math.random() * 999999999)
        let project = this.project
        let index = this.tasks.length + 1
        let repeat = 0
        
        if (this.date === 'No date selected') {
            date = null
        }

        if (this.repeat){
            repeat = 1
        }

        var obj = {
            id: id,
            task: this.task,
            date: this.date,
            priority: this.priority,
            project: project,
            ordering: index,
            status: 0,
            subtask: 0,
            repeat: repeat
        }
        
        if (this.tasks.some(obj => obj.project === this.title)){
            this.project = this.title
        } else {
            this.project = 'Inbox'
        }

        if (this.task !== '') {
            this.tasks.push(obj)
            this.filteredTasks.push(obj)
            this.dataService.addTask(id, this.task, date, this.priority, project, index, 0, 0, repeat)
        }

        this.repeat = false;
        this.taskInput.nativeElement.value = ''
        this.date = 'No date selected'
        this.priority = 0
        this.task = ''
    }

    addSubtask(subtask: number) {
        const element = `#subtaskInput${subtask}`
        const inputElements = this.document.querySelectorAll(element);

        (inputElements[0] as HTMLInputElement).value;

        let task = (inputElements[0] as HTMLInputElement).value;
        let id = Math.floor(100000000 + Math.random() * 999999999)
        let index = this.subtasks.length + 1

        var obj = {
            id: id,
            task: task,
            date: null,
            priority: null,
            project: null,
            ordering: index,
            status: 0,
            subtask: subtask,
            repeat: 0
        }

        this.subtaskInputStatus = false;

        if (task !== '') {
            this.subtasks.push(obj)
            this.filteredSubtasks.push(obj)
            this.dataService.addTask(id, task, null, null, null, index, 0, subtask, 0)
        }
    }

    deleteTask(element: any, type: number) {
        if (confirm('Are you sure?')) {

            if (type === 1) {
                const i = this.tasks.findIndex(function (x) { return x.id == element.target.id })
                this.tasks[i].status = 2;
                setTimeout(() => { this.tasks.splice(i, 1) }, 250);
                this.dataService.deleteTask(element.target.id)
            } else {
                const i = this.subtasks.findIndex(function (x) { return x.id == element.target.id })
                const k = this.filteredSubtasks.findIndex(function (x) { return x.id == element.target.id })
                this.subtasks.splice(i, 1)
                this.filteredSubtasks[k].status = 2;
                setTimeout(() => { this.filteredSubtasks.splice(k, 1) }, 250);
                this.dataService.deleteTask(element.target.id)
            }
        }
    }

    completeTask(parent_id: number, id: number, status: number, type: number, repeat: number) {

        if (status === 0 && type === 1){
            const index = this.tasks.findIndex(function (x) { return x.id == id })
                           
            this.completedTasks = this.completedTasks + 1
            this.dataService.updateKarma(this.today, this.completedTasks)

            if (this.tasks[index].repeat === 1){
                let hoje = new Date();
                let competency = new Date(hoje.setDate(hoje.getDate() + 1)).toISOString().split('T')[0];
                this.dataService.updateTaskDate(id, competency)
                
                this.tasks[index].status = 3;
                this.tasks[index].date = competency
                setTimeout(() => { this.tasks[index].status = 0; }, 250);
                
            } else {
                this.tasks[index].status = 2;
                this.dataService.updateTaskStatus(id, 1)
                setTimeout(() => { this.tasks.splice(index, 1) }, 250);
            }

        } else if (status === 1 && type === 1 ) {

            if (confirm('Are you sure?')) {
                const index = this.tasks.findIndex(function (x) { return x.id == id })
                this.tasks[index].status = 2;
                setTimeout(() => { this.tasks.splice(index, 1) }, 250);
                this.dataService.updateTaskStatus(id, 0)

                this.subtasks.filter((task: any) => task.subtask === id).forEach((data) => {
                    const i = this.subtasks.findIndex(function (x) { return x.id == data.id })
                    this.subtasks[i].status = 0;
                    this.dataService.updateTaskStatus(data.id, 0)

                    this.dataService.updateTaskStatus(data.id, 0)
                })
            }
        } else if (status === 1 && type === 2){

            const index = this.tasks.findIndex(function (x) { return x.id == parent_id })
            if (this.tasks[index].status === 0){
                const filteredSubtasksIndex = this.filteredSubtasks.findIndex(function (x) { return x.id == id })
                const subtasksIndex = this.subtasks.findIndex(function (x) { return x.id == id })
                this.filteredSubtasks[filteredSubtasksIndex].status = 0;
                this.subtasks[subtasksIndex].status = 0;
                this.dataService.updateTaskStatus(id, 0)
            } else {
                if (confirm('Are you sure?')) {
                    const filteredSubtasksIndex = this.filteredSubtasks.findIndex(function (x) { return x.id == id })
                    const subtasksIndex = this.subtasks.findIndex(function (x) { return x.id == id })
                    const index = this.tasks.findIndex(function (x) { return x.id == parent_id})
                    this.tasks[index].status = 0;
                    this.filteredSubtasks[filteredSubtasksIndex].status = 0;
                    this.subtasks[subtasksIndex].status = 0;
                    this.dataService.updateTaskStatus(id, 0)
                    this.dataService.updateTaskStatus(parent_id, 0)
                    this.tasks[index].status = 2;
                    setTimeout(() => { this.tasks.splice(index, 1) }, 250);
                }
            }
        } else if (status === 0 && type === 2){
            const filteredSubtasksIndex = this.filteredSubtasks.findIndex(function (x) { return x.id == id })
            const subtasksIndex = this.subtasks.findIndex(function (x) { return x.id == id })
            this.filteredSubtasks[filteredSubtasksIndex].status = 1;
            this.subtasks[subtasksIndex].status = 1;
            this.dataService.updateTaskStatus(id, 1)

            let total = this.subtasks.filter((task: any) => task.subtask === parent_id).length;
            let complete = this.subtasks.filter((task: any) => task.subtask === parent_id && task.status === 1).length;

            if (total - complete === 0){
                const index = this.tasks.findIndex(function (x) { return x.id == parent_id })
                this.tasks[index].status = 2;
                setTimeout(() => { this.tasks.splice(index, 1) }, 250);
                this.dataService.updateTaskStatus(parent_id, 1)

                this.completedTasks = this.completedTasks + 1
                this.dataService.updateKarma(this.today, this.completedTasks)
            }
        }

        if (repeat === 1){
            return true
        } else{
            return false
        }
        
    }

    openPrioritySetter(id: string) {
        const taskRef = this.prioritySetter.find(ref => ref.id === id);
        if (taskRef) {
            taskRef.open();
        }
    }

    removeDate(event: MouseEvent, id: number) {

        if (event.ctrlKey) {
            event.preventDefault()
            this.updateDate('No date selected', id)
            return false
        } else {
            return true
        }
    }

    dateToday(event: MouseEvent) {
        if (event.ctrlKey) {
            event.preventDefault()
            if (this.date === 'No date selected'){
                this.date = this.today
            } else {
                this.date = 'No date selected'
            }

            return false
        } else {
            return true
        }
    }

    updateTaskPriority(event: any, id: number) {
        let newPriority = 0
        let priority = event.target.innerText

        if (priority === 'Alta') {
            newPriority = 1
        } else if (priority === 'Média') {
            newPriority = 2
        } else {
            newPriority = 3
        }

        const index = this.tasks.findIndex(function (x) { return x.id == id })
        this.tasks[index].priority = newPriority
        this.dataService.updateTaskPriority(id, newPriority)
    }

    makeTaskEditable(event: any, id: number, type: number) {
        event.preventDefault();
        let name = event.target.innerText
        this.dataService.updateTaskName(id, name)
    }

    onDrop(event: CdkDragDrop<any>, id: number, type: number) {
        moveItemInArray(
            event.container.data,
            event.previousIndex,
            event.currentIndex
        );

        if (type === 1){
            this.tasks.forEach((data) => {
                let ordering = this.tasks.indexOf(data)
                let date = null
                if (data.date === 'No date selected') {
                    date = null
                } else {
                    date = data.date
                }
                this.dataService.addTask(data.id, data.task, date, data.priority, data.project, ordering, data.status, data.subtask, data.repeat);
            });
        } else {
            
            this.filteredSubtasks.forEach((data) => {
                let ordering = this.filteredSubtasks.indexOf(data)
                let date = null
                if (data.date === 'No date selected') {
                    date = null
                } else {
                    date = data.date
                }
                this.dataService.addTask(data.id, data.task, date, data.priority, data.project, ordering, data.status, data.subtask, data.repeat);
            });

            event.container.data.forEach((data: { id: any; }) => {
                const newIndex = event.container.data.findIndex(function (x: { id: any; }) { return x.id == data.id})
                const oldIndex = this.subtasks.findIndex(function (x) { return x.id == data.id})
                
                this.subtasks[oldIndex].ordering = newIndex
            })
        }

    }

    repeating(){
        this.repeat = !this.repeat;
    }

    updateRepeat(id: number, repeat: number){
        let newRepeat = 0

        if (repeat === 0){
           newRepeat = 1
        }

        this.dataService.updateRepeat(id, newRepeat)
        let i = this.tasks.findIndex(function (x) { return x.id == id})
        this.tasks[i].repeat = newRepeat

        return true
    }

    convertDate(date: any){
        let data:any = new Date

        if (date === 'No date selected'){
            data = null
        } else {
            data = new Date(date + 'T03:00:00Z');
        }
        return data
    }  

    preventDefault(event: any){
        if (event.keyCode === 13) {
            event.preventDefault();
            this.addTask()
            this.taskInput.nativeElement.textContent = ''
          }
    }

    onInputChange(event: any) {

        this.task = this.taskInput.nativeElement.textContent

        const inputString = this.taskInput.nativeElement.textContent;
        const inputParts = inputString.split(/\s/);
    
        const regex = /\b([A-Za-z]+, \d+)\b/;
        const match = inputString.match(regex);
    
        this.smartDate = ''

        if (!this.spanInserted){
            this.date = 'No date selected'
        }
    
        for (const part of inputParts) {
            const parsedDate = moment(part, ['M[/]D', 'M[/]D[/]Y', 'M[-]D'], true);
            
            if (parsedDate.isValid()) {
                const selectedDate = parsedDate.toDate();
                this.smartDateFormated = selectedDate.toISOString().split('T')[0];
                this.smartDate = part;
                this.task = inputString.replace(part, '').trim().replace(/\s+/g, ' ');
            } else {
                if (match) {
                    const dateString = match[1];
                    const parsedDate = moment(dateString, 'MMMM, D', true);
    
                    if (parsedDate.isValid()) {
                        const selectedDate = parsedDate.toDate();
                        this.smartDateFormated = selectedDate.toISOString().split('T')[0];
                        this.smartDate = match[1];
                        this.task = inputString.replace(match[1], '').trim().replace(/\s+/g, ' ');;
                    } 
                } else if (part.toLowerCase() === 'today'){
                    this.smartDate = 'today'
                    this.task = inputString.replace(part, '').trim().replace(/\s+/g, ' ');
                    const date = new Date()
                    this.smartDateFormated = date.toISOString().split('T')[0]
                } else if (part.toLowerCase() === 'tomorrow'){
                    this.smartDate = 'tomorrow'
                    this.task = inputString.replace(part, '').trim().replace(/\s+/g, ' ');
                    const date = new Date()
                    this.smartDateFormated = new Date(date.setDate(date.getDate() + 1)).toISOString().split('T')[0]
                } else if (part.toLowerCase() === 'next week'){
                    this.smartDate = 'next week'
                    this.task = inputString.replace(part, '').trim().replace(/\s+/g, ' ');
                    const date = new Date()
                    this.smartDateFormated = new Date(date.setDate(date.getDate() + 7)).toISOString().split('T')[0]
                } else if (part.toLowerCase() === 'saturday'){
                    this.smartDate = 'saturday'
                    this.task = inputString.replace(part, '').trim().replace(/\s+/g, ' ');
                    const today = new Date();
                    const nextSaturday = new Date();
                    this.smartDateFormated = new Date(nextSaturday.setDate(today.getDate() + (5 - today.getDay() + 1) % 7)).toISOString().split('T')[0];
                    console.log(this.smartDateFormated)
                } else {
                    
                }
                
            }
        }
    
        const selection = window.getSelection();
        if (selection !== null) {
            const range = selection.getRangeAt(0);
            const inputText = this.taskInput.nativeElement.textContent;
            
    
            if (this.smartDate !== '' && !this.spanInserted && event.data === ' ') {

                this.date = this.smartDateFormated

                const spanElement = document.createElement('span');
                spanElement.textContent = this.smartDate;
                spanElement.contentEditable = 'false'; // Enable editing within the span
                spanElement.style.borderRadius = '.3rem';
                spanElement.style.padding = '2px 8px 2px 8px';
                spanElement.style.color = 'white';

                console.log(this.today)
                console.log(this.date)

                if (this.date === this.today){
                    spanElement.style.backgroundColor = '#FCB62B';
                } else if (new Date(this.date) < new Date (this.today)){
                    spanElement.style.backgroundColor = '#7E6642';
                } else {
                    spanElement.style.backgroundColor = '#FCB62B';
                    spanElement.style.opacity = '0.6';
                }

                // Find all occurrences of 'today' using a regular expression
                const regex = new RegExp(this.smartDate, 'gi');
                const matches = [...inputText.matchAll(regex)];
               
    
                // Wrap each 'today' occurrence with the <span> element
                matches.forEach(match => {
                    const startOffset = match.index!;
                    const endOffset = startOffset + match[0].length;
                    const textNode = range.startContainer;
    
                    // Create a new range to encompass the 'today' string
                    const newRange = document.createRange();
                    newRange.setStart(textNode, startOffset);
                    newRange.setEnd(textNode, endOffset);
    
                    // Insert the <span> element around the 'today' string
                    newRange.surroundContents(spanElement);
                    range.setStartAfter(spanElement);
                    range.setEndAfter(spanElement);
                });

                // Insert a space after the <span> element
                const spaceNode = document.createTextNode(' ');
                range.insertNode(spaceNode);
                range.setStartAfter(spaceNode);
                range.setEndAfter(spaceNode);
    
                // Set the flag to true after inserting the span
                this.spanInserted = true;

            } else if (this.smartDate === '') {
                // Reset the flag if 'today' is not present
                this.spanInserted = false;
            }

            // Check for backspace key press near the span
            if (event.inputType === 'deleteContentBackward' && this.spanInserted) {
                const spanElement = this.taskInput.nativeElement.querySelector('span');
                const lastCharacter = spanElement.textContent?.slice(-1);
                const lastInputCharacter = inputText.charAt(inputText.length);
                const cursorOffset = window.getSelection()?.focusOffset;
            
                // Check if cursor is near span
                if (lastCharacter !== lastInputCharacter && cursorOffset === 0) {
                    
                    // Check if there is any text left in the span
                    if (spanElement.textContent !== '') {

                        // Convert the remaining text of the span back to normal text
                        this.taskInput.nativeElement.innerText = this.taskInput.nativeElement.innerText.replace(/\u00A0/g, '')
                        // spanElement.replaceWith(textNode)
                    }
            
                    // Set the flag to false to allow recreating the span if needed
                    this.spanInserted = false;

                    // Set the cursor at the end of the editableContent element
                    const editableContent = this.taskInput.nativeElement;
                    range.selectNodeContents(editableContent);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    this.date = 'No date selected'
                }           
            }
        }
    }    

    projects = [
        {project: 'Inbox', karma: 1},
        {project: 'Project', karma: 0},
        {project: 'Professional', karma: 1},
        {project: 'Tweets', karma: 0},
        {project: 'Grocery', karma: 0},
        {project: 'Buys', karma: 0},
    ]

    // projects = [
    //     {project: 'Inbox', karma: 1},
    //     {project: 'College', karma: 0},
    //     {project: 'Professional', karma: 1},
    //     {project: 'Grocery', karma: 0},
    //     {project: 'Buys', karma: 0},
    // ]

}
