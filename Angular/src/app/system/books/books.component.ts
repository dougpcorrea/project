import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { BooksService } from './books.service';

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

    constructor(private httpClient: HttpClient, private BooksService: BooksService) { }

    ngOnInit(): void {
        this.BooksService.getData().subscribe(
            res => {
                if (res.length > 0) {
                    this.books = res
                }
            }
        )
        this.BooksService.getBooks().subscribe(
            res => {
                this.allBooks = res
                console.log(this.allBooks)
            }
        )
    }

    show = false
    books!: Array<any>
    selected = 'mindset.jpg'
    allBooks!: Array<any>
    

    searchBook() {
        this.show = true
    }

    select(event: any, file: string){
        this.selected = file
    }

    b(){
        console.log('b')
    }

}
