import { Component, OnInit, ViewChild } from '@angular/core';
import { StatsService } from '../../services/stats.service';
import { FirestoreService } from '../../services/firestore.service';
import { PlayerStatsGame } from '../../models/player-stats-game.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.css'
})
export class AnalysisComponent implements OnInit {

  displayedColumns: string[] = ['ID', 'PLAYER', 'NO', 'POS', 'EDAD', 'TEAM'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  color = '#002649';
  teamIds: string[] = [];
  lukaDoncic: any[] = ["963", "Luka Doncic", "DAl", "https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png"];
  nikolaJocic: any[] = ["279", "Nikola Jokic", "DEN", "https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png"];
  shai: any[] = ["972", "Shai Gilgeous-Alexander", "OKC", "https://cdn.nba.com/headshots/nba/latest/1040x760/1628983.png"];
  giannis: any[] = ["20", "Giannis Antetokounmpo", "MIL", "https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png"];
  name = "player:279";

  constructor( 
    private statsService: StatsService,
    private firestore: FirestoreService,
    private router: Router
  ) { }

  ngOnInit() {
    //this.loadTeamIds();
    this.getPlayers();
    //this.firestore.removeGamesFromPlayers();
  }

  // Método que guarda las ids de los equipos en un array
  loadTeamIds() {
    this.firestore.getTeamIds().subscribe(ids => {
      this.teamIds = ids;
      this.getTeamPlayersStats(this.teamIds);
    });
  }

  // Método que recoge las estadisticas de cada partido de cada jugador y lo almacena en la base de datos
  getTeamPlayersStats(teamIds: any[]) {
    console.log(teamIds)
    //teamIds.forEach((teamId, index) => {
    const firstThird = teamIds.slice(0, Math.ceil(teamIds.length / 3)); // Obtener el primer tercio del array
    const secondThird = teamIds.slice(Math.ceil(teamIds.length / 3), Math.ceil((teamIds.length / 3) * 2)); // Obtener segundo tercio
    const thirdThird = teamIds.slice(Math.ceil((teamIds.length / 3) * 2)); // Obtener tercer tercio
    thirdThird.forEach((teamId, index) => {
      setTimeout(() => {
        this.statsService.getStatsPlayersForTeam(parseInt(teamId), "2023")
          .subscribe(
            (response: any) => {
              response.response.forEach(async (playerStat: any) => {
                const playerId = playerStat.player.id.toString();
                const gameId = playerStat.game.id.toString();
                const gameExists = await this.firestore.checkGameExists(gameId);
                if (gameExists) {
                  console.log(playerStat)
                  const gameStats: PlayerStatsGame = {
                    idGame: gameId,
                    points: playerStat.points,
                    pos: playerStat.pos,
                    min: playerStat.min,
                    fgm: playerStat.fgm,
                    fga: playerStat.fga,
                    fgp: playerStat.fgp,
                    ftm: playerStat.ftm,
                    fta: playerStat.fta,
                    ftp: playerStat.ftp,
                    tpm: playerStat.tpm,
                    tpa: playerStat.tpa,
                    tpp: playerStat.tpp,
                    offReb: playerStat.offReb,
                    defReb: playerStat.defReb,
                    totReb: playerStat.totReb,
                    assists: playerStat.assists,
                    pFouls: playerStat.pFouls,
                    steals: playerStat.steals,
                    turnovers: playerStat.turnovers,
                    blocks: playerStat.blocks,
                    plusMinus: playerStat.plusMinus
                  };
                  this.firestore.addStatsGamesPlayer(playerId, gameId, gameStats);
                } else {
                  console.log(`Game ${gameId} no existe en la base de datos`);
                }
              });
            },
            error => {
              console.error(error);
            }
          );
      }, index * 7000);
    });
  }

  // Método que recoge de la base de datos todos los jugadores
  getPlayers() {
    this.firestore.getAllPlayers().subscribe(
      (players: any[]) => {
        this.dataSource = new MatTableDataSource(players);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error al obtener los jugadores:', error);
      }
    );
  }

  // Método para calcular la edad del jugador
  playerAge(dateOfBirth: string): number | string {
    const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
  }

  // Método que segun la id de un equipo, devuelve su nickname
  getCodeTeam(idTeam: any): string | undefined {
    const teamsCode = new Map<number, string>([
        [1, "ATL"], [2, "BOS"], [4, "BKN"], [5, "CHA"], [6, "CHI"],
        [7, "CLE"], [8, "DAL"], [9, "DEN"], [10, "DET"], [11, "GSW"],
        [14, "HOU"], [15, "IND"], [16, "LAC"], [17, "LAL"], [19, "MEM"], 
        [20, "MIA"], [21, "MIL"], [22, "MIN"], [23, "NOP"], [24, "NYK"], 
        [25, "OKC"], [26, "ORL"], [27, "PHI"], [28, "PHX"], [29, "POR"], 
        [30, "SAC"], [31, "SAS"], [38, "TOR"], [40, "UTA"], [41, "WAS"]
    ]);
    return teamsCode.get(parseInt(idTeam));
  }

  // Método que filtrar los jugadores de la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
