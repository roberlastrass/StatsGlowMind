import { Component, HostListener, OnInit } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { FirestoreService } from '../../../services/firestore.service';
import { ActivatedRoute } from '@angular/router';
import { PlayerData } from '../../../models/player-data.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-team-players',
  templateUrl: './team-players.component.html',
  styleUrl: './team-players.component.css'
})
export class TeamPlayersComponent implements OnInit {

  displayedColumnsSort: string[] =  [];
  displayedColumnsMedium: string[] =  [];
  displayedColumnsLarge: string[] = [];
  smallScreen: boolean = false;
  mediumScreen: boolean = false;

  teamNickname: string = "Nickname null";
  teamId: number = 0;
  teamName: string = "";
  teamLogo: string = "";

  teamPlayers: PlayerData[] = [];

  constructor( 
    private statsService: StatsService,
    private firestore: FirestoreService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.getTeamNickname();
    
    this.translate.get(['TEAMS.INFO_PLAYERS.NAME', 'TEAMS.INFO_PLAYERS.POSITION', 'TEAMS.INFO_PLAYERS.AGE',
    'TEAMS.INFO_PLAYERS.HEIGHT', 'TEAMS.INFO_PLAYERS.WEIGHT', 'TEAMS.INFO_PLAYERS.NUMBER', 'TEAMS.INFO_PLAYERS.YEARS_PRO',
    'TEAMS.INFO_PLAYERS.BIRTHDATE','TEAMS.INFO_PLAYERS.COLLEGE', 'TEAMS.INFO_PLAYERS.COUNTRY'
    ]).subscribe(translations => {
      this.displayedColumnsSort =  [translations['TEAMS.INFO_PLAYERS.NAME'], translations['TEAMS.INFO_PLAYERS.NUMBER'], translations['TEAMS.INFO_PLAYERS.AGE'], 
      translations['TEAMS.INFO_PLAYERS.HEIGHT'], translations['TEAMS.INFO_PLAYERS.WEIGHT']];
      this.displayedColumnsMedium =  [translations['TEAMS.INFO_PLAYERS.NAME'], translations['TEAMS.INFO_PLAYERS.NUMBER'], translations['TEAMS.INFO_PLAYERS.POSITION'],
      translations['TEAMS.INFO_PLAYERS.AGE'], translations['TEAMS.INFO_PLAYERS.HEIGHT'], translations['TEAMS.INFO_PLAYERS.WEIGHT'], translations['TEAMS.INFO_PLAYERS.COUNTRY']];
      this.displayedColumnsLarge = [translations['TEAMS.INFO_PLAYERS.NAME'], translations['TEAMS.INFO_PLAYERS.NUMBER'], translations['TEAMS.INFO_PLAYERS.POSITION'],
      translations['TEAMS.INFO_PLAYERS.BIRTHDATE'], translations['TEAMS.INFO_PLAYERS.AGE'], translations['TEAMS.INFO_PLAYERS.HEIGHT'], translations['TEAMS.INFO_PLAYERS.WEIGHT'],
      'DEBUT', translations['TEAMS.INFO_PLAYERS.YEARS_PRO'], translations['TEAMS.INFO_PLAYERS.COLLEGE'], translations['TEAMS.INFO_PLAYERS.COUNTRY']];
    });
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
          
          //this.getPlayersForIdTeam(this.teamId);
          this.getTeamPlayersData(this.teamId);
        }else {
          this.teamId = 0;
        }
      })
      .catch(error => {
        console.error("Error al obtener la ID del equipo:", error);
      });
  }

  // Método que recoge los datos de los jugadores de cada equipo de la API y lo almacena en la Firestore
  getPlayersForIdTeam( teamId: number ): void {
    this.statsService.getTeamPlayers(teamId, '2023')
      .subscribe(
        response => {
          console.log(response);
          if (Array.isArray(response.response)) {
            response.response.forEach((player: any) => {
              const playerData: PlayerData = {
                id: player.id,
                idTeam: teamId,
                firstname: player.firstname,
                lastname: player.lastname,
                birth: {
                  date: player.birth.date,
                  country: player.birth.country
                },
                nba: {
                  start: player.nba.start,
                  pro: player.nba.pro
                },
                height: {
                  feets: player.height.feets,
                  inches: player.height.inches,
                  meters: player.height.meters
                },
                weight: {
                  pounds: player.weight.pounds,
                  kilograms: player.weight.kilograms
                },
                college: player.college,
                affiliation: player.affiliation,
                leagues: {
                  standard: {
                    jersey: player.leagues.standard.jersey,
                    active: player.leagues.standard.active,
                    pos: player.leagues.standard.pos
                  }
                }
              };
              this.firestore.addOrUpdatePlayers(playerData);
            });
          } else {
            console.error('Response no es un array:', response);
          }
        },
        error => {
          console.error(error);
        }
      );
  }

  // Método para calcular la edad del jugador
  playerAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Método para obtener todos los jugadores del equipo en la bbdd
  getTeamPlayersData(teamId: number): void {
    this.firestore.getTeamPlayers(teamId)
      .subscribe(
        players => {
          this.teamPlayers = players;
          console.log(this.teamPlayers)
        },
        error => {
          console.error('Error al obtener jugadores del equipo', error);
        }
      );
  }

  // Función para comprobar el tamaño de la pantalla
  checkScreenSize() {
    this.smallScreen = window.innerWidth <= 700;
    this.mediumScreen = window.innerWidth <= 1100;
  }

  // Escuchar el evento de cambio de tamaño de la ventana
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

}
