import { Component, OnInit } from '@angular/core';
import { Team } from '../team.model';
import { StatsService } from '../../../services/stats.service';

@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.css'
})
export class StandingsComponent implements OnInit {

  eastStandings: Team[] = [];
  westStandings: Team[] = [];

  constructor(private statsService: StatsService) { 
  }

  ngOnInit(): void {
    this.getStandingsConference();
  }

  getStandingsConference(): void {
    this.statsService.getStandings('standard', '2023')
      .subscribe(
        response => {
          // Filtra los equipos por conferencia
          const eastConference = response.response.filter((team: Team) => team.conference.name === 'east');
          const westConference = response.response.filter((team: Team) => team.conference.name === 'west');
          // Ordena los equipos por rango dentro de cada conferencia
          this.eastStandings = eastConference.sort((a: any, b: any) => a.conference.rank - b.conference.rank);
          this.westStandings = westConference.sort((a: any, b: any) => a.conference.rank - b.conference.rank);
        },
        error => {
          console.error(error);
        }
      );
  }

}
