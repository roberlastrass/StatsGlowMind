import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit {

  activeComponent: string = 'standings';

  constructor(
    private router: Router,
    private statsService: StatsService
    ) { 
  }

  ngOnInit(): void {
  }

  showComponent(component: string) {
    this.activeComponent = component;
  }

}
