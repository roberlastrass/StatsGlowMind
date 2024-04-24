import { Component, HostListener, OnInit } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { FirestoreService } from '../../../services/firestore.service';
import { GameStats } from '../../../models/game-stats.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrl: './team-stats.component.css'
})
export class TeamStatsComponent implements OnInit {

  displayedColumnsSort: string[] = ['GP', 'W%', 'PTS', 'FG%', 'TP%', 'FT%', '+/-'];
  displayedColumnsMedium: string[] = ['GP', 'W', 'L', 'W%', 'PTS', 'FG%', 'TP%', 'FT%', 'REB', 'AST', 'STL', 'BLK', '+/-'];
  displayedColumnsLarge: string[] = ['GP', 'W', 'L', 'W%', 'PTS', 'FGM', 'FGA', 'FG%', 'TPM', 'TPA', 'TP%', 'FTM', 'FTA', 'FT%', 'OREB', 'DREB', 'REB', 'AST', 'STL', 'BLK', 'TOV', 'PF', '+/-'];
  smallScreen: boolean = false;
  mediumScreen: boolean = false;

  teamNickname: string = "Nickname null";
  teamId: number = 0;
  teamName: string = "";
  teamLogo: string = "";

  games: any[] =  [] ;
  gamesIds: number[] = [];
  teamStats: any[] = [];
  teamStatsHome: any[] = [];
  teamStatsVisitor: any[] = [];
  teamStatsWin: any[] = [];
  teamStatsLoss: any[] = [];

  averageStats: any = this.inicializateStats();
  homeStats: any = this.inicializateStats();
  visitorStats: any = this.inicializateStats();
  winStats: any = this.inicializateStats();
  lossStats: any = this.inicializateStats();

  constructor( 
    private statsService: StatsService,
    private firestore: FirestoreService,
    private route: ActivatedRoute
  ) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.getTeamNickname();
    //this.filteredValidGames();
  }


  // Método que recoge el parametro de route cuyo valor es el nickname del Equipo
  getTeamNickname() {
    this.route.paramMap.subscribe(params => {
      if (params !== null) {
        const teamNameParam = params.get('teamName');
        this.teamNickname = teamNameParam !== null && teamNameParam !== undefined ? teamNameParam : "null | undefined";
      } else {
        this.teamNickname = "null param";
      }
    });
    this.getTeamIdForNickname(this.teamNickname);
  }

  // Método que a partir del nickname haya la id de ese equipo
  getTeamIdForNickname(nickname: string) {
    this.firestore.getTeamId(nickname)
      .then(teamInfo => {
        if (teamInfo !== null) {
          this.teamId = teamInfo.id;
          this.teamName = teamInfo.name;
          this.teamLogo = teamInfo.logo;
          
          this.getTeamStatistics();
        }else {
          this.teamId = 0;
        }
      })
      .catch(error => {
        console.error("Error al obtener la ID del equipo:", error);
      });
  }


  // Método que recoge los partidos que devuelve la API y recoge las Ids de los partidos válidos
  filteredValidGames(): void {
    this.statsService.getSeasonGames("2023").subscribe(
      response => {
        this.games = response.response.filter((partido: any) => {
          const fechaPartido = new Date(partido.date.start);
          const fechaLimite = new Date('2023-10-24');
          return fechaPartido >= fechaLimite && partido.status.long === 'Finished';
        });
        this.gamesIds = this.games.map((partido: any) => partido.id);
        console.log(this.gamesIds);
        this.getGameStatsForId();
      },
      error => {
        console.error("Error al obtener los datos:", error);
      }
    );
  }

  // Método que recoge los datos de las estadisticas de cada partido de la API y lo almacena en la Firestore
  getGameStatsForId(): void {
    const games100Ids = this.gamesIds.slice(720, 810); // Seleccionar las primeras 100 IDs
    games100Ids.forEach((gameId, index) => {
      console.log(gameId)
    //this.gamesIds.forEach((gameId, index) => {
      setTimeout(() => {
        this.statsService.getGameStats(gameId)
        .subscribe(
          response => {
            const gameData: GameStats = {
              id: gameId,
              home: {
                id: response.response[0].team.id,
                statistics: response.response[0].statistics[0]
              },
              visitors: {
                id: response.response[1].team.id,
                statistics: response.response[1].statistics[0]
              }
            };
            this.firestore.addOrUpdateGameStats(gameData);
          },
          error => {
            console.error(error);
          }
        );
      }, index * 7000);
    });
    
  }


  // Método para obtener todas las estadísticas de todos los partidos del equipo en la bbdd
  getTeamStatistics(): void {
    this.firestore.getTeamStatsAllGames(this.teamId)
      .subscribe(
        stats => {
          this.teamStats = stats;
          console.log(this.teamStats)
          this.calculateStats(this.teamStats, this.averageStats);
          this.updateAverageStats(this.averageStats);
        },
        error => {
          console.error('Error al obtener estadísticas de todos los partidos del equipo', error);
        }
      );
    this.firestore.getTeamStatsHomeAndVisitor(this.teamId)
      .subscribe(data => {
        this.teamStatsHome = data.teamStatsHome;
        this.teamStatsVisitor = data.teamStatsVisitor;

        this.calculateStats(this.teamStatsHome, this.homeStats);
        this.calculateStats(this.teamStatsVisitor, this.visitorStats);
      },
      error => {
        console.error('Error al obtener estadísticas de los partidos jugados en casa y de visitante del equipo', error);
      }
      );
    this.firestore.getTeamWinLossStats(this.teamId)
      .subscribe(data => {
        this.teamStatsWin = data.teamStatsWin;
        this.teamStatsLoss = data.teamStatsLoss;

        this.calculateStats(this.teamStatsWin, this.winStats);
        this.calculateStats(this.teamStatsLoss, this.lossStats);
      },
      error => {
        console.error('Error al obtener estadísticas de los partidos ganados y perdidos del equipo', error);
      }
      );
  }

  // Método para actualizar las estadisticas en la base de datos
  updateAverageStats( stats: any ): void {
    this.firestore.updateTeamStats(this.teamId, stats)
      .then(() => {
        console.log('Medias de estadísticas actualizadas en la base de datos.');
      })
      .catch(error => {
        console.error('Error al actualizar las medias de estadísticas en la base de datos:', error);
      });
  }

  // Método para calcular las medias de las estadísticas de los partidos
  calculateStats( teamStats:any[], stats: any ): void {
    if (teamStats.length === 0) return;

    // Sumar todas las estadísticas
    teamStats.forEach(stat => {
      stats.points += stat.points || 0;
      stats.fgm += stat.fgm || 0;
      stats.fga += stat.fga || 0;
      stats.fgp += parseFloat(stat.fgp) || 0;
      stats.ftm += stat.ftm || 0;
      stats.fta += stat.fta || 0;
      stats.ftp += parseFloat(stat.ftp) || 0;
      stats.min += parseFloat(stat.min) || 0;
      stats.offReb += stat.offReb || 0;
      stats.defReb += stat.defReb || 0;
      stats.totReb += stat.totReb || 0;
      stats.assists += stat.assists || 0;
      stats.steals += stat.steals || 0;
      stats.blocks += stat.blocks || 0;
      stats.turnovers += stat.turnovers || 0;
      stats.pFouls += stat.pFouls || 0;
      stats.plusMinus += parseFloat(stat.plusMinus) || 0;
      stats.tpm += stat.tpm || 0;
      stats.tpa += stat.tpa || 0;
      stats.tpp += parseFloat(stat.tpp) || 0;
      if (stat.result == "win"){
        stats.win ++;
      } else {
        stats.loss ++;
      }
    });

    // Calcular la media dividiendo por el número de partidos jugados
    const numGames = teamStats.length;
    if (numGames > 0) {
      stats.points /= numGames;
      stats.fgm /= numGames;
      stats.fga /= numGames;
      stats.fgp /= numGames;
      stats.ftm /= numGames;
      stats.fta /= numGames;
      stats.ftp /= numGames;
      stats.min /= numGames;
      stats.offReb /= numGames;
      stats.defReb /= numGames;
      stats.totReb /= numGames;
      stats.assists /= numGames;
      stats.steals /= numGames;
      stats.blocks /= numGames;
      stats.turnovers /= numGames;
      stats.pFouls /= numGames;
      stats.plusMinus /= numGames;
      stats.tpm /= numGames;
      stats.tpa /= numGames;
      stats.tpp /= numGames;
      stats.gp = numGames;
      stats.winPercentage = stats.win * 100 / numGames;
    }
  }

  // Método que se encarga de inicializar los arrays de todas las estadisticas
  inicializateStats() {
    const iniStats = {
      assists: 0,
      blocks: 0,
      defReb: 0,
      fga: 0,
      fgm: 0,
      fgp: null,
      fta: 0,
      ftm: 0,
      ftp: null,
      min: null,
      offReb: 0,
      pFouls: 0,
      plusMinus: null,
      points: 0,
      steals: 0,
      totReb: 0,
      tpa: 0,
      tpm: 0,
      tpp: null,
      turnovers: 0,
      gp: 0,
      win: 0,
      loss: 0,
      winPercentage: 0
    };
    return iniStats;
  }

  // Función para comprobar el tamaño de la pantalla
  checkScreenSize() {
    this.smallScreen = window.innerWidth <= 700;
    this.mediumScreen = window.innerWidth <= 1300;
  }

  // Escuchar el evento de cambio de tamaño de la ventana
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

}
