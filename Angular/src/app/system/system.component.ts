import { Component, OnInit, Input } from '@angular/core';
import { DataService } from './system.service';

interface SideNavToggle {
    screenWidth: number;
    collapsed: boolean;
  }

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent{

    constructor() {}
    
    title = 'Projects';

    isSideNavCollapsed = false;
    screenWidth = 0;
  
    onToggleSideNav(data: SideNavToggle): void {
      this.screenWidth = data.screenWidth;
      this.isSideNavCollapsed = data.collapsed;
    }
  

}
