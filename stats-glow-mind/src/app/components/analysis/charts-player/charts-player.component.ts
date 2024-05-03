import { Component, HostListener, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { StatsService } from '../../../services/stats.service';

@Component({
  selector: 'app-charts-player',
  templateUrl: './charts-player.component.html',
  styleUrl: './charts-player.component.css'
})
export class ChartsPlayerComponent implements OnInit {

  playerId: string = "ID null";
  playerInfo: any = {};
  players: any[] = [];
  urlPhoto: string = "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png";
  morePlayers: any[] = [
    [203954, 0, "Joel Embiid"], [1628378, 0, "Donovan Mitchell"], [1629027, 0, "Trae Young"], [1629630, 0, "Ja Morant"], [203944, 0, "Julius Randle"],
    [1630163, 0, "LaMelo Ball"], [1630217, 0, "Desmond Bane"], [1628374, 0, "Lauri Markkanen"], [1629014, 0, "Anfernee Simons"], [203924, 0, "Jerami Grant"],
    [1629639, 0, "Tyler Herro"], [204001, 0, "Kristaps Porzingis"], [203897, 0, "Zach LaVine"], [203078, 0, "Bradley Bea"], [1629636, 0, "Darius Garland"],
    [203903, 0, "Jordan Clarkson"], [1629028, 0, "Deandre Ayton"], [1630552, 0, "Jalen Johnson"], [1631101, 0, "Shaedon Sharpe"], [1627763, 0, "Malcolm Brogdon"],
    [1630596, 0, "Evan Mobley"], [1629631, 0, "De'Andre Hunter"], [202711, 0, "Bojan Bogdanovic"], [203114, 0, "Khris Middleton"], [1630530, 0, "Trey Murphy III"],
    [1628384, 0, "OG Anunoby"], [1641713, 0, "GG Jackson"], [203935, 0, "Marcus Smart"], [1630590, 0, "Scotty Pippen Jr."], [1631109, 0, "Mark Williams"],
    [1641715, 0, "Cam Whitmore"], [1629750, 0, "Javonte Green"], [1628963, 0, "Marvin Bagley III"], [1629634, 0, "Brandon Clarke"], [1627751, 0, "Jakob Poeltl"], 
    [1629001, 0, "De'Anthony Melton"], [1628379, 0, "Luke Kennard"], [1628976, 0, "Wendell Carter Jr."], [1630191, 0, "Isaiah Stewart"], [1631222, 0, "Jake LaRavia"],
    [1630625, 0, "Dalano Banton"], [1630168, 0, "Onyeka Okongwu"], [1629659, 0, "Talen Horton-Tucker"], [1631246, 0, "Vince Williams Jr."], [1630172, 0, "Patrick Williams"],
    [1626196, 0, "Josh Richardson"], [202330, 0, "Gordon Hayward"], [1631106, 0, "Tari Eason"], [1630544, 0, "Tre Mann"], [201567, 0, "Kevin Love"],
    [203110, 0, "Draymond Green"], [201565, 0, "Derrick Rose"], [1628365, 0, "Markelle Fultz"], [1628998, 0, "Cody Martin"], [1630631, 0, "Jose Alvarado"],
    [1626174, 0, "Christian Wood"], [203095, 0, "Evan Fournier"], [1629057, 0, "Robert Williams III"], [202694, 0, "Marcus Morris Sr."], [203109, 0, "Jae Crowder"],
    [1627732, 0, "Ben Simmons"], [201568, 0, "Danilo Gallinari"], [203552, 0, "Seth Curry"], [1628467, 0, "Maxi Kleber"], [203496, 0, "Robert Covington"],
    [201580, 0, "JaVale McGee"], [201988, 0, "Patty Mills"], [201599, 0, "DeAndre Jordan"], [202684, 0, "Tristan Thompson"], [1626246, 0, "Boban Marjanovic"],
    [203490, 0, "Otto Porter Jr."], [203925, 0, "Joe Harris"], [200782, 0, "P.J. Tucker"], [202738, 0, "Isaiah Thomas"], [201577, 0, "Robin Lopez"], 
    [201980, 0, "Danny Green"], [1629003, 0, "Shake Milton"]
  ];

  displayedColumnsSort: string[] = ['GP', 'MIN', 'PTS', 'FG%', 'REB', 'AST', '+/-'];
  displayedColumnsMedium: string[] = ['GP', 'MIN', 'PTS', 'FG%', 'TP%', 'FT%', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF', '+/-'];
  displayedColumnsLarge: string[] = ['GP', 'MIN', 'PTS', 'FGM', 'FGA', 'FG%', 'TPM', 'TPA', 'TP%', 'FTM', 'FTA', 'FT%', 'OREB', 'DREB', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF', '+/-'];
  smallScreen: boolean = false;
  mediumScreen: boolean = false;

  averageStatsPlayer: any = {}

  constructor( 
    private statsService: StatsService,
    private firestore: FirestoreService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getTeamNickname();
  }

  // Método que recoge el parametro de route cuyo valor es el id del jugador
  async getTeamNickname() {
    this.route.paramMap.subscribe(params => {
      if (params !== null) {
        const playerIdParam = params.get('player')?.split(":")[1];
        this.playerId = playerIdParam !== null && playerIdParam !== undefined ? playerIdParam : "null | undefined";
      } else {
        this.playerId = "null param";
      }
    });
    this.getPlayerInformation(this.playerId);
    this.averageStatsPlayer = await this.calculateAverageStats(this.playerId);
    console.log(this.playerId)
    console.log(this.averageStatsPlayer)
  }

  // Método que recoge información del jugador
  async getPlayerInformation(idPlayer: string): Promise<void> {
    this.playerInfo = await this.firestore.getPlayerInfo(parseInt(idPlayer));
    console.log('Información del jugador:', this.playerInfo);
    const namePlayer = this.playerInfo.firstName + " " + this.playerInfo.lastName
    console.log(namePlayer)
    this.getLeadersNBA(namePlayer);
  }

  // Método que realiza una llamada a la API para mostrar los datos de los líderes de la NBA
  getLeadersNBA(playerName: string): void {
    this.statsService.getLeaders('2023-24', "PTS").subscribe(
      data => {
        this.players = data.resultSet.rowSet;
        this.morePlayers.forEach(player => {
          this.players.push(player);
        });
        
        this.getHeadshotPlayer(playerName);
      },
      error => {
        console.error('Error al obtener datos de jugadores:', error);
      }
    );
  }

  // Método que devuelve la imagen de un jugador si existe
  getHeadshotPlayer(playerName: string) {
    const baseUrl = "https://cdn.nba.com/headshots/nba/latest/1040x760/";
    let playerId = 0;
    for (const player of this.players) {
      if (player[2] === playerName) {
        playerId = player[0];
        console.log(playerId)
      }
    }
    if (playerId != 0) {
      this.urlPhoto =  baseUrl + playerId.toString() + ".png";
    }
    return this.urlPhoto;
  }

  // Método que recoge las estadísticas de los partidos de un jugador y realiza la media
  async calculateAverageStats(playerId: string): Promise<any> {
    try {
      const playerGames = await this.firestore.getPlayerGames(playerId);
      if (playerGames.length === 0) {
        console.log('El jugador no tiene ningún partido registrado.');
        return null;
      }
      // Inicializar datos
      const averageStats = {
        assists: 0,
        blocks: 0,
        defReb: 0,
        fga: 0,
        fgm: 0,
        fgp: 0,
        fta: 0,
        ftm: 0,
        ftp: 0,
        min: 0,
        offReb: 0,
        pFouls: 0,
        plusMinus: 0,
        points: 0,
        steals: 0,
        totReb: 0,
        tpa: 0,
        tpm: 0,
        tpp: 0,
        turnovers: 0,
        gp: 0
      };
      let gpfg = 0;
      let gptp = 0;
      let gpft = 0;
      // Sumar estadísticas
      playerGames.forEach(game => {
        averageStats.assists += game.assists;
        averageStats.blocks += game.blocks;
        averageStats.defReb += game.defReb;
        averageStats.fga += game.fga;
        averageStats.fgm += game.fgm;
        averageStats.fta += game.fta;
        averageStats.ftm += game.ftm;
        averageStats.min += parseInt(game.min);
        averageStats.offReb += game.offReb;
        averageStats.pFouls += game.pFouls;
        averageStats.plusMinus += parseInt(game.plusMinus);
        averageStats.points += game.points;
        averageStats.steals += game.steals;
        averageStats.totReb += game.totReb;
        averageStats.tpa += game.tpa;
        averageStats.tpm += game.tpm;
        averageStats.turnovers += game.turnovers;
        averageStats.gp++;
        if (game.fga !== 0) {
          averageStats.fgp += (game.fgm * 100) / game.fga;
          gpfg++;
        }
        
        if (game.fta !== 0) {
          averageStats.ftp += (game.ftm * 100) / game.fta;
          gpft++;
        }
        
        if (game.tpa !== 0) {
          averageStats.tpp += (game.tpm * 100) / game.tpa;
          gptp++;
        }
      });
      // Calcular promedios
      averageStats.assists /= averageStats.gp;
      averageStats.blocks /= averageStats.gp;
      averageStats.defReb /= averageStats.gp;
      averageStats.fga /= averageStats.gp;
      averageStats.fgm /= averageStats.gp;
      averageStats.fgp /= gpfg;
      averageStats.fta /= averageStats.gp;
      averageStats.ftm /= averageStats.gp;
      averageStats.ftp /= gpft;
      averageStats.min /= averageStats.gp;
      averageStats.offReb /= averageStats.gp;
      averageStats.pFouls /= averageStats.gp;
      averageStats.plusMinus /= averageStats.gp;
      averageStats.points /= averageStats.gp;
      averageStats.steals /= averageStats.gp;
      averageStats.totReb /= averageStats.gp;
      averageStats.tpa /= averageStats.gp;
      averageStats.tpm /= averageStats.gp;
      averageStats.tpp /= gptp;
      averageStats.turnovers /= averageStats.gp;
  
      console.log(averageStats)
      return averageStats;
    } catch (error) {
      console.error('Error al calcular la media de las estadísticas de los partidos del jugador:', error);
      return null;
    }
  }

  // Función para comprobar el tamaño de la pantalla
  checkScreenSize() {
    this.smallScreen = window.innerWidth <= 600;
    this.mediumScreen = window.innerWidth <= 1100;
  }

  // Escuchar el evento de cambio de tamaño de la ventana
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

}
