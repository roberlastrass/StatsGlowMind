import { Component } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'stats-playoffs',
  templateUrl: './playoffs.component.html',
  styleUrl: './playoffs.component.css'
})
export class PlayoffsComponent {

  playoffs: any;
  rounds: any[] = [
    { name: 'Round 1', roundNumber: 1, conference: 'West' },
    { name: 'Round 2', roundNumber: 2, conference: 'West' },
    { name: 'Round 3', roundNumber: 3, conference: 'West' },
    { name: 'FINAL NBA', roundNumber: 4, conference: 'NBA Finals' },
    { name: 'Round 3', roundNumber: 3, conference: 'East' },
    { name: 'Round 2', roundNumber: 2, conference: 'East' },
    { name: 'Round 1', roundNumber: 1, conference: 'East' }
  ];
  teamsNicknames: any [] = [];
  nicknamesWest: any [] = this.filteredSeries(1, "West");
  nicknamesEast: any [] = this.filteredSeries(1, "East");
  teamsNickLogo: any [] = [];
  teamLogo: string = "";

  constructor(
    private statsService: StatsService,
    private firestore: FirestoreService
  ) { }

  ngOnInit(): void {
    this.getPlayoffsData('2023');
    //this.getTeamLogoForNickname();
  }

  // Método que realiza una llamada a la API para mostrar los datos de los playoffs de la NBA
  getPlayoffsData(season: string): void {
    this.statsService.getPlayoffs(season)
      .subscribe(
        (data) => {
          this.playoffs = data;
          console.log('Datos de playoffs:', data);
        },
        (error) => {
          console.error('Error al obtener los datos de playoffs:', error);
        }
      );
  }

  // Método que filtra los datos de playoffs en rounds y en conference
  filteredSeries(roundNumber: number, conference: string): any[] {
    if (!this.playoffs || !this.playoffs.bracket.playoffBracketSeries) {
      return [];
    }
    return this.playoffs.bracket.playoffBracketSeries.filter((series: any) => 
      series.roundNumber === roundNumber && series.seriesConference === conference
    );
  }

  // Método que a partir del nickname recoge el logo del equipo
  /*
  getTeamLogoForNickname() {
    this.nicknamesWest = this.filteredSeries(1, "West");
    this.nicknamesEast = this.filteredSeries(1, "East");
    this.teamsNicknames.push(this.nicknamesWest, this.nicknamesEast);
    console.log(this.teamsNicknames)
    this.teamsNicknames.forEach((nickname) => {
      this.firestore.getTeamId(nickname)
      .then(teamInfo => {
        if (teamInfo !== null) {
          this.teamLogo = teamInfo.logo;
        }
      })
      .catch(error => {
        console.error("Error al obtener el logo del equipo:", error);
      });
    });
  }*/

}
