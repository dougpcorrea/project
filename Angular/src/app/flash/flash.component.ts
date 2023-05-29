import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { EditCardComponent } from './edit-card/edit-card.component';
import { DataService } from './flash.service';

@Component({
    selector: 'app-flash',
    templateUrl: './flash.component.html',
    styleUrls: ['./flash.component.scss']
})
export class FlashComponent implements OnInit {

    constructor(private dataService: DataService, private dialog: MatDialog) { }

    dialogRef!: MatDialogRef<EditCardComponent>

    @ViewChild('frontCard') frontCard!: ElementRef;

    carouselInterval: any;
    deck!: string
    front!: string
    back_one!: string
    back_two!: string
    back_three!: string
    voice = 'Google US English'
    totalCards!: number
    index = 0
    selectedBack: number = 1
    totalBack: number = 1
    cardStatus = true
    startStatus = true
    stopStatus = false
    back_one_status = true
    back_two_status = false
    back_three_status = false
    img = false

    decks: Array<{
        deck: string
    }> = [];

    allCards: Array<{
        id: number,
        front: string,
        back_one: string,
        back_two: string,
        back_three: string,
    }> = [];

    ngOnInit(): void {
        speechSynthesis.onvoiceschanged = () => {
            console.log(speechSynthesis.getVoices())
        }
        this.dataService.getDecks().subscribe(res => { this.decks = res })
        this.dataService.get_cards().subscribe(res => {
            this.allCards = res.filter((card: { deck: string, id: number }) => card.deck === 'Vocabulary')
            this.front = this.allCards[this.index].front
            this.totalCards = this.allCards.length

            if (this.allCards[this.index].back_one !== null && this.allCards[this.index].back_one !== '') { this.totalBack = this.totalBack + 1 }
            if (this.allCards[this.index].back_two !== null && this.allCards[this.index].back_two !== '') { this.totalBack = this.totalBack + 1 }
            if (this.allCards[this.index].back_three !== null && this.allCards[this.index].back_three !== '') { this.totalBack = this.totalBack + 1 }

            if (this.allCards[this.index].back_one?.startsWith('<img>')) {
                this.img = true
                this.back_one = `../../../assets/cards/${this.allCards[this.index].back_one.split('<img>')[1]}`
            } else {
                this.img = false
                this.back_one = this.allCards[this.index].back_one
            }

            if (this.allCards[this.index].back_two?.startsWith('<img>')) {
                this.back_two = `../../../assets/cards/${this.allCards[this.index].back_two.split('<img>')[1]}`
            } else {
                this.back_two = this.allCards[this.index].back_two
            }

            if (this.allCards[this.index].back_three?.startsWith('<img>')) {
                this.back_three = `../../../assets/cards/${this.allCards[this.index].back_three.split('<img>')[1]}`
            } else {
                this.back_three = this.allCards[this.index].back_three
            }
        })
    }

    startCarousel() {
        this.carouselInterval = setInterval(() => {
            this.selectedBack++;
            if (this.selectedBack > this.totalBack) {
                this.selectBack(1)
            }

            if (this.selectedBack === 1) {
                this.selectBack(1)
            } else if (this.selectedBack === 2) {
                this.selectBack(2)
            } else if (this.selectedBack === 3 && this.totalBack > 2) {
                this.selectBack(3)
            }
        }, 2000);
    }

    editCard() {

        const dialogConfig = new MatDialogConfig()
        dialogConfig.disableClose = true

        const data = [
            { id: this.allCards[this.index].id },
            { front: this.allCards[this.index].front },
            { back_one: this.allCards[this.index].back_one },
            { back_two: this.allCards[this.index].back_two },
            { back_three: this.allCards[this.index].back_three },
        ]

        dialogConfig.data = data;

        this.dialogRef = this.dialog.open(EditCardComponent, dialogConfig)

        this.dialogRef.afterClosed().subscribe((data) => {
            if (data) {
                this.back_one = data.back_one
                this.back_two = data.back_two
                this.back_three = data.back_three
                this.allCards[this.index].back_one = data.back_one
                this.allCards[this.index].back_two = data.back_two
                this.allCards[this.index].back_three = data.back_three
                this.front = data.front

                if (data.back_one?.startsWith('<img>')) {
                    this.img = true
                    this.back_one = `../../../assets/cards/${data.back_one.split('<img>')[1]}`
                } else {
                    this.img = false
                    this.back_one = data.back_one
                }
                if (data.back_two?.startsWith('<img>')) {
                    this.back_two = `../../../assets/cards/${data.back_two.split('<img>')[1]}`
                } else {
                    this.back_two = data.back_two
                }
                if (data.back_three?.startsWith('<img>')) {
                    this.back_three = `../../../assets/cards/${data.back_three.split('<img>')[1]}`
                } else {
                    this.back_three = data.back_three
                }

                if (data.back_one !== '' && data.back_one !== null) {
                    this.totalBack = 1
                }
                if (data.back_two !== '' && data.back_two !== null) {
                    this.totalBack = this.totalBack + 1
                }
                if (data.back_three !== '' && data.back_three !== null) {
                    this.totalBack = this.totalBack + 1
                }
            }
        });
    }

    selectBack(back: number) {
        this.selectedBack = back

        if (back === 1) {
            if (this.allCards[this.index].back_one?.startsWith('<img>')) { this.img = true } else { this.img = false }
            this.back_one_status = true
            this.back_two_status = false
            this.back_three_status = false
        } else if (back === 2) {
            if (this.allCards[this.index].back_two?.startsWith('<img>')) { this.img = true } else { this.img = false }
            this.back_one_status = false
            this.back_two_status = true
            this.back_three_status = false
        } else {
            if (this.allCards[this.index].back_three?.startsWith('<img>')) { this.img = true } else { this.img = false }
            this.back_one_status = false
            this.back_two_status = false
            this.back_three_status = true
        }
    }

    start() {
        this.startStatus = !this.startStatus
        this.speakText()
    }

    showAnswer() {
        this.frontCard.nativeElement.classList.add('flip')
        setTimeout(() => { this.cardStatus = !this.cardStatus }, 150);

        this.totalBack = 0

        if (this.allCards[this.index].back_one !== null && this.allCards[this.index].back_one !== '') { this.totalBack = this.totalBack + 1 }
        if (this.allCards[this.index].back_two !== null && this.allCards[this.index].back_two !== '') { this.totalBack = this.totalBack + 1 }
        if (this.allCards[this.index].back_three !== null && this.allCards[this.index].back_three !== '') { this.totalBack = this.totalBack + 1 }

        this.selectBack(1)
        if (this.totalBack > 1) { this.startCarousel() } else { this.carouselInterval = 0}
    }

    nextCard() {
        try {
            this.index = this.index + 1
            this.front = this.allCards[this.index].front

            if (this.allCards[this.index].back_one?.startsWith('<img>')) {
                this.img = true
                this.back_one = `../../../assets/cards/${this.allCards[this.index].back_one.split('<img>')[1]}`
            } else {
                this.img = false
                this.back_one = this.allCards[this.index].back_one
            }
            if (this.allCards[this.index].back_two?.startsWith('<img>')) {
                this.back_two = `../../../assets/cards/${this.allCards[this.index].back_two.split('<img>')[1]}`
            } else {
                this.back_two = this.allCards[this.index].back_two
            }

            if (this.allCards[this.index].back_three?.startsWith('<img>')) {
                this.back_three = `../../../assets/cards/${this.allCards[this.index].back_three.split('<img>')[1]}`
            } else {
                this.back_three = this.allCards[this.index].back_three
            }

            this.cardStatus = !this.cardStatus
            this.speakText()
        } catch {
            this.stopStatus = !this.stopStatus
        }

    }

    speakText(): void {
        const speechSynthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(this.front);

        const voices = speechSynthesis.getVoices();
        const voice = voices.find((voice) => voice.name === 'Google US English');

        if (voice) {
            utterance.voice = voice;
            speechSynthesis.speak(utterance);
        } else {
            speechSynthesis.onvoiceschanged = () => {
                const updatedVoices = speechSynthesis.getVoices();
                const updatedVoice = updatedVoices.find((voice) => voice.name === 'Google US English');
                if (updatedVoice) {
                    utterance.voice = updatedVoice;
                    speechSynthesis.speak(utterance);
                }
            };
        }
    }
}
