import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit {

  activeComponent: string = 'standings';

  constructor() { }

  ngOnInit(): void {
  }

  showComponent(component: string) {
    this.activeComponent = component;
  }

}
