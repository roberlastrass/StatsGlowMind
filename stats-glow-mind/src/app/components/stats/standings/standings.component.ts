import { Component, HostListener, OnInit } from '@angular/core';
import { Team } from '../../../models/team.model';
import { StatsService } from '../../../services/stats.service';
import { Router } from '@angular/router';

@Component({
  selector: 'stats-standings',
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.css'
})
export class StandingsComponent implements OnInit {

  eastStandings: Team[] = [];
  westStandings: Team[] = [];

  displayedColumnsSort: string[] = ['Nº', 'LOGO', 'EQUIPO', 'W', 'L', 'W%', 'LOCAL', 'VISITANTE'];
  displayedColumns: string[] = ['Nº', 'LOGO', 'EQUIPO', 'W', 'L', 'W%', 'LOCAL', 'VISITANTE', '10 ÚLTIMOS', 'RACHA'];
  smallScreen: boolean = false;

  constructor(
    private statsService: StatsService,
    private router: Router
  ) { 
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

  // Función para comprobar el tamaño de la pantalla
  checkScreenSize() {
    this.smallScreen = window.innerWidth <= 800;
  }

  // Escuchar el evento de cambio de tamaño de la ventana
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  // Método que te mueve a la página Glossary
  routeGlossary() {
    this.router.navigate(['/about/glossary']);
  }

}
