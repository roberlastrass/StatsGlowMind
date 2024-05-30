import { Component } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { FirestoreService } from '../../../services/firestore.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'stats-playoffs',
  templateUrl: './playoffs.component.html',
  styleUrl: './playoffs.component.css'
})
export class PlayoffsComponent {

  playoffs: any;
  rounds: any[] = [];
  teamsNicknames: any [] = [];
  nicknamesWest: any [] = this.filteredSeries(1, "West");
  nicknamesEast: any [] = this.filteredSeries(1, "East");
  teamsNickLogo: any [] = [];
  
  logoDefault: string = "https://upload.wikimedia.org/wikipedia/commons/e/e5/NBA_script.svg";
  // Mapa que almacena los URLs de los logos de los equipos
  teamsLogos: Map<string, string> = new Map<string, string>([
    ['Celtics', 'https://upload.wikimedia.org/wikipedia/fr/thumb/6/65/Celtics_de_Boston_logo.svg/1024px-Celtics_de_Boston_logo.svg.png'],
    ['Cavaliers', 'https://upload.wikimedia.org/wikipedia/fr/thumb/0/06/Cavs_de_Cleveland_logo_2017.png/150px-Cavs_de_Cleveland_logo_2017.png'],
    ['Mavericks', 'https://upload.wikimedia.org/wikipedia/fr/thumb/b/b8/Mavericks_de_Dallas_logo.svg/150px-Mavericks_de_Dallas_logo.svg.png'],
    ['Nuggets', 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/35/Nuggets_de_Denver_2018.png/180px-Nuggets_de_Denver_2018.png'],
    ['Pacers', 'https://upload.wikimedia.org/wikipedia/fr/thumb/c/cf/Pacers_de_l%27Indiana_logo.svg/1180px-Pacers_de_l%27Indiana_logo.svg.png'],
    ['Clippers', 'https://upload.wikimedia.org/wikipedia/fr/d/d6/Los_Angeles_Clippers_logo_2010.png'],
    ['Lakers', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/220px-Los_Angeles_Lakers_logo.svg.png'],
    ['Heat', 'https://upload.wikimedia.org/wikipedia/fr/thumb/1/1c/Miami_Heat_-_Logo.svg/1200px-Miami_Heat_-_Logo.svg.png'],
    ['Bucks', 'https://upload.wikimedia.org/wikipedia/fr/3/34/Bucks2015.png'],
    ['Timberwolves', 'https://upload.wikimedia.org/wikipedia/fr/thumb/d/d9/Timberwolves_du_Minnesota_logo_2017.png/200px-Timberwolves_du_Minnesota_logo_2017.png'],
    ['Pelicans', 'https://upload.wikimedia.org/wikipedia/fr/thumb/2/21/New_Orleans_Pelicans.png/200px-New_Orleans_Pelicans.png'],
    ['Knicks', 'https://upload.wikimedia.org/wikipedia/fr/3/34/Knicks_de_NY.png'],
    ['Thunder', 'https://upload.wikimedia.org/wikipedia/fr/thumb/4/4f/Thunder_d%27Oklahoma_City_logo.svg/1200px-Thunder_d%27Oklahoma_City_logo.svg.png'],
    ['Magic', 'https://upload.wikimedia.org/wikipedia/fr/b/bd/Orlando_Magic_logo_2010.png'],
    ['76ers', 'https://upload.wikimedia.org/wikipedia/fr/4/48/76ers_2016.png'],
    ['Suns', 'https://upload.wikimedia.org/wikipedia/fr/5/56/Phoenix_Suns_2013.png'],
  ]);

  constructor(
    private statsService: StatsService,
    private firestore: FirestoreService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getPlayoffsData('2023');

    this.translate.get(['PLAYOFFS.ROUND1', 'PLAYOFFS.ROUND2', 'PLAYOFFS.ROUND3', 'PLAYOFFS.FINAL'])
    .subscribe(translations => {
      this.rounds = [
        { name: translations['PLAYOFFS.ROUND1'], roundNumber: 1, conference: 'West' },
        { name: translations['PLAYOFFS.ROUND2'], roundNumber: 2, conference: 'West' },
        { name: translations['PLAYOFFS.ROUND3'], roundNumber: 3, conference: 'West' },
        { name: translations['PLAYOFFS.FINAL'], roundNumber: 4, conference: 'NBA Finals' },
        { name: translations['PLAYOFFS.ROUND3'], roundNumber: 3, conference: 'East' },
        { name: translations['PLAYOFFS.ROUND2'], roundNumber: 2, conference: 'East' },
        { name: translations['PLAYOFFS.ROUND1'], roundNumber: 1, conference: 'East' }
      ];
    });
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

}
