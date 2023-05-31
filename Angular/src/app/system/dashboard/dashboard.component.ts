import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/system/dashboard/dashboard.service';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


    dataSource: Array<{
        name: string,
        date: Date,
    }> = [];

    today = new Date().toISOString().slice(0, 10);
    hoje = new Date()


    todayBirthdays: Array<{
        name: string,
        date: Date,
    }> = [];

    weekBirthdays: Array<{
        name: string,
        date: Date,
    }> = [];



    constructor(private dataService: DataService, private sanitizer: DomSanitizer) { }

    @ViewChild('abc') abc!: ElementRef;

    ngOnInit(): void {
        this.dataService.getBirthdays().subscribe(res => {
            this.dataSource = res;
            this.todayBirthdays = this.dataSource.filter(element => {
                const elementDate = new Date(element.date); // Assuming each element has a 'date' property
                const elementDateString = elementDate.toISOString().slice(0, 10); // Get the date of the element in "YYYY-MM-DD" format
                return elementDateString === this.today
            });
            this.weekBirthdays = this.dataSource.filter((element: any) => {
                const elementDate = new Date(element.date) // Convert the string date to a Date object
                const endDate = new Date()
                endDate.setDate(this.hoje.getDate() + 7);
                return elementDate >= this.hoje && elementDate <= endDate;
            });
            this.weekBirthdays.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA.getTime() - dateB.getTime();
            });
        });


    }



    @ViewChild('editableContent') editableContent!: ElementRef;

    spanInserted = false;
    date = ''
    smartDate = ''

    onInputChange(event: any) {
    

        const inputString = this.editableContent.nativeElement.textContent;
        const inputParts = inputString.split(/\s/);
    
        const regex = /\b([A-Za-z]+, \d+)\b/;
        const match = inputString.match(regex);
    
        this.smartDate = '';
    
        for (const part of inputParts) {
            const parsedDate = moment(part, ['M[/]D', 'M[/]D[/]Y', 'M[-]D'], true);
            
    
            if (parsedDate.isValid()) {
                const selectedDate = parsedDate.toDate();
                this.date = selectedDate.toISOString().split('T')[0];
    
                this.smartDate = part;
                // console.log('Valid without regex: '+part)
            } else {
                if (match) {
                    const dateString = match[1];
                    const parsedDate = moment(dateString, 'MMMM, D', true);
    
                    if (parsedDate.isValid()) {
                        const selectedDate = parsedDate.toDate();
                        this.date = selectedDate.toISOString().split('T')[0];
                        this.smartDate = match[1];
                        // console.log('Valid with regex: '+match[1])
                    } 
                } else if (part === 'today'){
                    this.smartDate = 'today'
                }
            }
        }
    
        const selection = window.getSelection();
        if (selection !== null) {
            const range = selection.getRangeAt(0);
            const inputText = this.editableContent.nativeElement.textContent;
            
    
            if (this.smartDate !== '' && !this.spanInserted && event.data === ' ') {
                console.log('Rodando');
                const spanElement = document.createElement('span');
                spanElement.textContent = this.smartDate;
                spanElement.contentEditable = 'false'; // Enable editing within the span
                spanElement.style.backgroundColor = '#FCB62B';
                spanElement.style.borderRadius = '.3rem';
                spanElement.style.padding = '2px 8px 2px 8px';
                spanElement.style.color = 'white';
    
                // Find all occurrences of 'today' using a regular expression
                const regex = new RegExp(this.smartDate, 'gi');
                const matches = [...inputText.matchAll(regex)];
               
    
                // Wrap each 'today' occurrence with the <span> element
                matches.forEach(match => {

                    const textNode = range.startContainer;
 
                    const startOffset = match.index!;
                    const endOffset = startOffset + match[0].length;

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

            if (event.inputType === 'deleteContentBackward' && this.spanInserted) {
                const spanElement = this.editableContent.nativeElement.querySelector('span');
                const lastCharacter = spanElement.textContent?.slice(-1);
                const lastInputCharacter = inputText.charAt(inputText.length);
                const cursorOffset = window.getSelection()?.focusOffset;
            
                // Check if cursor is near span
                if (lastCharacter !== lastInputCharacter && cursorOffset === 0) {
                    
                    // Check if there is any text left in the span
                    if (spanElement.textContent !== '') {

                        // Convert the remaining text of the span back to normal text
                        this.editableContent.nativeElement.innerText = this.editableContent.nativeElement.innerText.replace(/\u00A0/g, '')
                        // spanElement.replaceWith(textNode)
                    }
            
                    // Set the flag to false to allow recreating the span if needed
                    this.spanInserted = false;

                    const editableContent = this.editableContent.nativeElement;
                    range.selectNodeContents(editableContent);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }            
            }
        }
    }     
}
