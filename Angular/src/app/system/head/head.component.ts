import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnInit {

  constructor(private router: Router) { }

  title!: string

  ngOnInit(): void {
    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.title = event.url.split('/')[1].charAt(0).toUpperCase() + event.url.split('/')[1].slice(1)
        }
      });
  }

}
