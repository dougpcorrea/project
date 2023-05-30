import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { DataService } from './reading.service';

@Component({
    selector: 'app-reading',
    templateUrl: './reading.component.html',
    styleUrls: ['./reading.component.scss']
})
export class ReadingComponent implements OnInit {

    constructor(private dataService: DataService) { }

    @ViewChild('audio') audio!: ElementRef;
    @ViewChild('audioFile') audioFile!: ElementRef;
    @ViewChild('progressBar') progressBar!: ElementRef;
    @ViewChild('progressArea') progressArea!: ElementRef;
    @ViewChild('title') title!: ElementRef;
    @ViewChild('autor') autor!: ElementRef;

    isMusicPlaying = true;
    autoPlay = true;
    player = false;

    audioId = 0

    currentTime = '0:00:00'
    duration = ''

    booksFolder = '../../../assets/books/'

    allBooks!: Array<any>

    saveDuration!: Subscription

    musicSrc = ''
    coverSrc = ''

    ngOnInit() {
        this.dataService.get_settings().subscribe(respo => {
            this.audioId = respo[0].value
            this.booksFolder = respo[1].value
            this.dataService.getData().subscribe(
                res => {
                    if (res.length > 0) {
                        this.allBooks = res
                        this.musicSrc = `${this.booksFolder}${this.allBooks.filter(x => x.id == this.audioId)[0].filename}`
                        this.coverSrc = `${this.booksFolder}${this.allBooks.filter(x => x.id == this.audioId)[0].cover}`
                        this.audio.nativeElement.load()
                        this.player = true;
                    }
                }
            )
        })
    }

    playPause() {
        var intervalo = interval(5000)

        this.isMusicPlaying ? this.audio.nativeElement.play() : this.audio.nativeElement.pause()
        this.isMusicPlaying ? this.saveDuration = intervalo.subscribe(() => {
            this.dataService.postData(this.audioId, { duration: this.audio.nativeElement.currentTime }),
                this.allBooks[this.allBooks.findIndex((x) => { return x.id == this.audioId })].duration = this.audio.nativeElement.currentTime
        }) : this.saveDuration.unsubscribe()
        this.isMusicPlaying = !this.isMusicPlaying;
    }

    changeTime(event: any) {
        let progressWidth = this.progressArea.nativeElement.clientWidth
        let clickedOffSetX = event.offsetX
        let duration = this.audio.nativeElement.duration

        this.audio.nativeElement.currentTime = (clickedOffSetX / progressWidth) * duration
        this.dataService.postData(this.audioId, { duration: this.audio.nativeElement.currentTime })
        this.allBooks[this.allBooks.findIndex((x) => { return x.id == this.audioId })].duration = this.audio.nativeElement.currentTime

    }

    skipSeconds() {
        this.audio.nativeElement.currentTime = this.audio.nativeElement.currentTime + 10
        this.dataService.postData(this.audioId, { duration: this.audio.nativeElement.currentTime })
        this.allBooks[this.allBooks.findIndex((x) => { return x.id == this.audioId })].duration = this.audio.nativeElement.currentTime
    }

    reverseSeconds() {
        this.audio.nativeElement.currentTime = this.audio.nativeElement.currentTime - 10
        this.dataService.postData(this.audioId, { duration: this.audio.nativeElement.currentTime })
        this.allBooks[this.allBooks.findIndex((x) => { return x.id == this.audioId })].duration = this.audio.nativeElement.currentTime
    }

    nextBook() {
        var i = this.allBooks.findIndex((x) => { return x.id == this.audioId })
        i + 1 > this.allBooks.length - 1 ? i = 0 : i = i + 1;
        this.audioId = this.allBooks[i].id
        this.audio.nativeElement.currentTime = this.allBooks[i].duration
        this.musicSrc = `${this.booksFolder}${this.allBooks[i].filename}`
        this.coverSrc = `${this.booksFolder}${this.allBooks[i].cover}`
        this.audio.nativeElement.load()
        this.isMusicPlaying ? this.audio.nativeElement.pause() : this.audio.nativeElement.play()
        this.dataService.post_settings(this.audioId)
    }

    previousBook() {
        var i = this.allBooks.findIndex((x) => { return x.id == this.audioId })
        i - 1 < 0 ? i = this.allBooks.length - 1 : i = i - 1;
        this.audioId = this.allBooks[i].id
        this.audio.nativeElement.currentTime = this.allBooks[i].duration
        this.musicSrc = `${this.booksFolder}${this.allBooks[i].filename}`
        this.coverSrc = `${this.booksFolder}${this.allBooks[i].cover}`
        this.audio.nativeElement.load()
        this.isMusicPlaying ? this.audio.nativeElement.pause() : this.audio.nativeElement.play()
    }

    updateCurrentTime() {
        let duration = this.audio.nativeElement.duration
        let currentTime = this.audio.nativeElement.currentTime

        let curHou = Math.floor(this.audio.nativeElement.currentTime / 3600)
        let curMin = Math.floor((this.audio.nativeElement.currentTime - curHou * 3600) / 60)
        let curSec = Math.floor(this.audio.nativeElement.currentTime % 60)

        if (curSec < 10) {
            var currentSec = `0${curSec}`;
        } else {
            var currentSec = `${curSec}`;
        }

        if (curMin < 10) {
            var currentMin = `0${curMin}`;
        } else {
            var currentMin = `${curMin}`;
        }

        this.currentTime = `${curHou}:${currentMin}:${currentSec}`

        let progressWidth = (currentTime / duration) * 100
        this.progressBar.nativeElement.style.width = `${progressWidth}%`
    }

    dataLoaded() {

        this.audio.nativeElement.currentTime = this.allBooks.filter(x => x.id == this.audioId)[0].duration;
        this.title.nativeElement.innerText = this.allBooks.filter(x => x.id == this.audioId)[0].title;
        this.autor.nativeElement.innerText = this.allBooks.filter(x => x.id == this.audioId)[0].autor;

        let durHou = Math.floor(this.audio.nativeElement.duration / 3600)
        let durMin = Math.floor((this.audio.nativeElement.duration - durHou * 3600) / 60)
        let durSec = Math.floor(this.audio.nativeElement.duration % 60)

        if (durSec < 10) {
            var durationSec = `0${durSec}`;
        } else {
            var durationSec = `${durSec}`;
        }

        if (durMin < 10) {
            var durationMin = `0${durMin}`;
        } else {
            var durationMin = `${durMin}`;
        }


        this.duration = `${durHou}:${durationMin}:${durationSec}`

    }
}
