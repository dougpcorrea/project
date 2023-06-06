import { DIALOG_DATA } from '@angular/cdk/dialog';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-edit-card',
    templateUrl: './edit-card.component.html',
    styleUrls: ['./edit-card.component.scss']
})

export class EditCardComponent {

    constructor(private dialog: MatDialogRef<EditCardComponent>, private http: HttpClient, @Inject(MAT_DIALOG_DATA) public dialogData: any) {

        this.type = dialogData[5].type

        if (this.type === 0) {
            this.question = dialogData[1].front;
            this.id = dialogData[0].id
            this.answerOne = dialogData[2].back_one
            this.answerTwo = dialogData[3].back_two
            this.answerThree = dialogData[4].back_three

            if (dialogData[2].back_one?.startsWith('<img>')) {
                this.answerOneType = 'image'
                this.selectedAnswerType = 'image'
                this.answerOne = dialogData[2].back_one.split('<img>')[1]
            }
    
            if (dialogData[3].back_two?.startsWith('<img>')) {
                this.answerTwoType = 'image'
                this.answerTwo = dialogData[3].back_two.split('<img>')[1]
            }
    
            if (dialogData[4].back_three?.startsWith('<img>')) {
                this.answerThreeType = 'image'
                this.answerThree = dialogData[4].back_three.split('<img>')[1]
            }
        }
    }

    id!: number
    type!: number
    error!: string
    question!: string
    answerOne!: any
    answerTwo!: any
    answerThree!: any

    answerOneType = "text"
    answerTwoType = "text"
    answerThreeType = "text"

    selectedAnswer = 1
    selectedAnswerType = 'text'

    erro = false;

    save() {

        let back_one = this.answerOne
        let back_two = this.answerTwo
        let back_three = this.answerThree
        let url_one = ''
        let url_two = ''
        let url_three = ''
        let filetype_one = ''
        let filetype_two = ''
        let filetype_three = ''

        if (this.answerOneType === 'image' && this.answerOne !== '') {
            url_one = this.answerOne
            filetype_one = this.answerOne.split('.')
            filetype_one = filetype_one[filetype_one.length - 1]
            back_one = '<img>' + back_one
        }

        if (this.answerTwoType === 'image' && this.answerTwo !== '') {
            url_two = this.answerTwo
            filetype_two = this.answerTwo.split('.')
            filetype_two = filetype_two[filetype_two.length - 1]
            back_two = '<img>' + back_two
        }

        if (this.answerThreeType === 'image' && this.answerThree !== '') {
            url_three = this.answerThree
            filetype_three = this.answerThree.split('.')
            filetype_three = filetype_three[filetype_three.length - 1]
            back_three = '<img>' + back_three
        }

        const payload = {
            id: this.id,
            front: this.question,
            type: this.type,
            back_one: back_one,
            url_one: url_one,
            filetype_one: filetype_one,
            back_two: back_two,
            url_two: url_two,
            filetype_two: filetype_two,
            back_three: back_three,
            url_three: url_three,
            filetype_three: filetype_three,
        };

        if (this.type === 0){
            return this.http.put(`${environment.apiUrl}cards/`, payload).subscribe(res => {
                if (res === 'URL_INVALIDO') {
                    this.erro = true;
                    this.error = 'The provided URL is invalid'
                    console.log(res)
                } else {
                    this.dialog.close(res)
                }
            })
        } else {
            return this.http.post(`${environment.apiUrl}cards/`, payload).subscribe(res => {
                if (res === 'URL_INVALIDO') {
                    this.erro = true;
                    this.error = 'The provided URL is invalid'
                    console.log(res)
                } else {
                    this.dialog.close(res)
                }
            })
        }

    }

    close() {
        this.dialog.close()
    }

    preventBreak(event: KeyboardEvent) {
        const isEnterKey = event.key === 'Enter';
        const isShiftEnter = event.key === 'Enter' && event.shiftKey;
        if (isEnterKey || isShiftEnter) {
            event.preventDefault();
        }
    }

    limitRows(event: any) {
        const maxRows = 3;

        if (event.target.id === 'question') {
            const lines = this.question.split('\n');
            if (lines.length > maxRows) {
                event.preventDefault();
                this.question = lines.slice(0, maxRows).join('\n');
            }
        } else if (event.target.id === 'answer_one') {
            const lines = this.answerOne.split('\n');
            if (lines.length > maxRows) {
                event.preventDefault();
                this.answerOne = lines.slice(0, maxRows).join('\n');
            }
        }
    }

    changeType(type: string) {
        this.selectedAnswerType = type
        if (this.selectedAnswer === 1) {
            this.answerOneType = type
        } else if (this.selectedAnswer === 2) {
            this.answerTwoType = type
        } else {
            this.answerThreeType = type
        }
    }

    selectAnswer(answer: number) {
        this.selectedAnswer = answer
        this.erro = false;

        if (answer === 1) {
            this.selectedAnswerType = this.answerOneType

        } else if (answer === 2) {
            this.selectedAnswerType = this.answerTwoType

        } else {
            this.selectedAnswerType = this.answerThreeType

        }
    }
}


