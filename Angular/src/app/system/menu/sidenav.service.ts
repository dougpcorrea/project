import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SidenavService {

    private subject = new Subject<any>();

    sendClickEvent(label: string) {
        this.subject.next(label);
    }

    getClickEvent(): Observable<any> {
        return this.subject.asObservable();
    }
}