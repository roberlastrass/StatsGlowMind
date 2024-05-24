import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { ExportCsvService } from '../../services/export-csv.service';
import { PredictionService } from '../../services/prediction.service';
import { Chart, ChartType  } from 'chart.js/auto';
import { FormControl } from '@angular/forms';

interface Team {
  id: number;
  name: string;
}

interface TeamGroup {
  disabled?: boolean;
  name: string;
  teams: Team[];
}
@Component({
  selector: 'app-predict',
  templateUrl: './predict.component.html',
  styleUrl: './predict.component.css'
})
export class PredictComponent implements OnInit {

  probHomeWin: number = 1;
  probVisitorWin: number = 1;

  public predictionChart: Chart | undefined;

  homeTeamControl = new FormControl('');
  visitorTeamControl = new FormControl('');
  teamControl = new FormControl('');
  teamGroups: TeamGroup[] = [
    {
      name: 'Conferencia Este',
      teams: [
        { id: 1, name: 'Atlanta Hawks' },
        { id: 2, name: 'Boston Celtics' },
        { id: 4, name: 'Brooklyn Nets' },
        { id: 5, name: 'Charlotte Hornets' },
        { id: 6, name: 'Chicago Bulls' },
        { id: 7, name: 'Cleveland Cavaliers' },
        { id: 10, name: 'Detroit Pistons' },
        { id: 15, name: 'Indiana Pacers' },
        { id: 20, name: 'Miami Heat' },
        { id: 21, name: 'Milwaukee Bucks' },
        { id: 24, name: 'New York Knicks' },
        { id: 26, name: 'Orlando Magic' },
        { id: 27, name: 'Philadelphia 76ers' },
        { id: 38, name: 'Toronto Raptors' },
        { id: 41, name: 'Washington Wizards' },
      ],
    },
    {
      name: 'Conferencia Oeste',
      teams: [
        { id: 8, name: 'Dallas Mavericks' },
        { id: 9, name: 'Denver Nuggets' },
        { id: 11, name: 'Golden State Warriors' },
        { id: 14, name: 'Houston Rockets' },
        { id: 16, name: 'Los Angeles Clippers' },
        { id: 17, name: 'Los Angeles Lakers' },
        { id: 19, name: 'Memphis Grizzlies' },
        { id: 22, name: 'Minnesota Timberwolves' },
        { id: 23, name: 'New Orleans Pelicans' },
        { id: 25, name: 'Oklahoma City Thunder' },
        { id: 28, name: 'Phoenix Suns' },
        { id: 29, name: 'Portland Trail Blazers' },
        { id: 30, name: 'Sacramento Kings' },
        { id: 31, name: 'San Antonio Spurs' },
        { id: 40, name: 'Utah Jazz' },
      ],
    },
  ];

  logoDefault: string = "https://upload.wikimedia.org/wikipedia/commons/e/e5/NBA_script.svg";
  logo: string = this.logoDefault;
  teamName: string = "Equipo Ganador";

  constructor( 
    private firestore: FirestoreService,
    private predictionService: PredictionService,
    private csvExport: ExportCsvService
  ) { }

  ngOnInit() {
    //this.exportGamesDataToCsv();
    //this.exportTeamsStatsToCsv();
    //this.makePrediction();
    this.createCharts();
  }

  // Método que muestra el logo y nombre del equipo ganador
  showLogoWinner() {
    try {
      if (this.probHomeWin > this.probVisitorWin) {
        if (this.homeTeamControl.value) {
          this.firestore.getTeamNameAndLogo(this.homeTeamControl.value)
            .then(teamInfo => {
              if (teamInfo !== null) {
                this.teamName = teamInfo.name;
                this.logo = teamInfo.logo;
              }else {
                this.logo = this.logoDefault;
              }
            })
            .catch(error => {
              console.error("Error al obtener la info del equipo:", error);
            });
        } else {
          this.logo = this.logoDefault;
        }
      } else {
        if (this.visitorTeamControl.value) {
          this.firestore.getTeamNameAndLogo(this.visitorTeamControl.value)
            .then(teamInfo => {
              if (teamInfo !== null) {
                this.teamName = teamInfo.name;
                this.logo = teamInfo.logo;
              }else {
                this.logo = this.logoDefault;
              }
            })
            .catch(error => {
              console.error("Error al obtener la info del equipo:", error);
            });
        } else {
          this.logo = this.logoDefault;
        }
      }
    } catch (error) {
      console.error('Error al obtener la información del equipo:', error);
      this.logo = this.logoDefault;
    }
  }
  

  // Método que se encarga de pasar por parametro las ids de los equipos que se enfrentan y devuelve la predicción
  predictGame(): void {
    const homeTeamId = this.homeTeamControl.value;
    const visitorTeamId = this.visitorTeamControl.value;

    if (homeTeamId !== null && visitorTeamId !== null) {
      const homeTeamIdNumber = Number(homeTeamId);
      const visitorTeamIdNumber = Number(visitorTeamId);

      this.predictionService.predict(homeTeamIdNumber, visitorTeamIdNumber)
        .subscribe(
          data => {
            console.log('Predicción:', data);
            this.probHomeWin = data.prob_home_win;
            this.probVisitorWin = data.prob_visitor_win;

            this.createCharts();
            this.showLogoWinner();
          },
          error => {
            console.log('Error fetching prediction:', error);
          }
        );
    } else {
      console.error('Both home and visitor team must be selected');
    }
  }


  // Método que recoge los datos de cada partido y lo exporta a csv
  exportGamesDataToCsv() {
    this.firestore.exportGamesData().subscribe(data => {
      // Procesar los datos y convertirlos a un formato adecuado para CSV
      const gamesDataCsv: any[] = [];
  
      // Iterar sobre cada partido y sus estadísticas
      data.forEach(partido => {
        const result = partido.home.statistics.points > partido.visitors.statistics.points ? 1 : 0;
        const game = {
          game_id: partido.id,
          home_id: partido.home.id,
          home_assists: partido.home.statistics.assists,
          home_blocks: partido.home.statistics.blocks,
          home_defReb: partido.home.statistics.defReb,
          home_fga: partido.home.statistics.fga,
          home_fgm: partido.home.statistics.fgm,
          home_fgp: parseInt(partido.home.statistics.fgp),
          home_fta: partido.home.statistics.fta,
          home_ftm: partido.home.statistics.ftm,
          home_ftp: parseInt(partido.home.statistics.ftp),
          home_offReb: partido.home.statistics.offReb,
          home_pFouls: partido.home.statistics.pFouls,
          home_plusMinus: parseInt(partido.home.statistics.plusMinus),
          home_points: partido.home.statistics.points,
          home_steals: partido.home.statistics.steals,
          home_totReb: partido.home.statistics.totReb,
          home_tpa: partido.home.statistics.tpa,
          home_tpm: partido.home.statistics.tpm,
          home_tpp: parseInt(partido.home.statistics.tpp),
          home_turnovers: partido.home.statistics.turnovers,
          visitor_id: partido.visitors.id,
          visitor_assists: partido.visitors.statistics.assists,
          visitor_blocks: partido.visitors.statistics.blocks,
          visitor_defReb: partido.visitors.statistics.defReb,
          visitor_fga: partido.visitors.statistics.fga,
          visitor_fgm: partido.visitors.statistics.fgm,
          visitor_fgp: parseInt(partido.visitors.statistics.fgp),
          visitor_fta: partido.visitors.statistics.fta,
          visitor_ftm: partido.visitors.statistics.ftm,
          visitor_ftp: parseInt(partido.visitors.statistics.ftp),
          visitor_offReb: partido.visitors.statistics.offReb,
          visitor_pFouls: partido.visitors.statistics.pFouls,
          visitor_plusMinus: parseInt(partido.visitors.statistics.plusMinus),
          visitor_points: partido.visitors.statistics.points,
          visitor_steals: partido.visitors.statistics.steals,
          visitor_totReb: partido.visitors.statistics.totReb,
          visitor_tpa: partido.visitors.statistics.tpa,
          visitor_tpm: partido.visitors.statistics.tpm,
          visitor_tpp: parseInt(partido.visitors.statistics.tpp),
          visitor_turnovers: partido.visitors.statistics.turnovers,
          result: result
        };
  
        gamesDataCsv.push(game);
        console.log(game.game_id, ": Correcto")
      });
  
      // Crear y escribir el archivo CSV
      this.csvExport.writeCsv(gamesDataCsv, 'games.csv');
    });
  }

  // Método que recoge las estadisticas media de cada equipo y lo exporta a csv
  exportTeamsStatsToCsv() {
    this.firestore.exportTeamStats().subscribe(data => {
      // Procesar los datos y convertirlos a un formato adecuado para CSV
      const teamsStatsCsv: any[] = [];
  
      // Iterar sobre cada partido y sus estadísticas
      data.forEach(team => {
        const avg_stats = {
          team_id: team.id,
          team_assists: team.averageStats.assists,
          team_blocks: team.averageStats.blocks,
          team_defReb: team.averageStats.defReb,
          team_fga: team.averageStats.fga,
          team_fgm: team.averageStats.fgm,
          team_fgp: team.averageStats.fgp,
          team_fta: team.averageStats.fta,
          team_ftm: team.averageStats.ftm,
          team_ftp: team.averageStats.ftp,
          team_offReb: team.averageStats.offReb,
          team_pFouls: team.averageStats.pFouls,
          team_plusMinus: team.averageStats.plusMinus,
          team_points: team.averageStats.points,
          team_steals: team.averageStats.steals,
          team_totReb: team.averageStats.totReb,
          team_tpa: team.averageStats.tpa,
          team_tpm: team.averageStats.tpm,
          team_tpp: team.averageStats.tpp,
          team_turnovers: team.averageStats.turnovers
        };
  
        teamsStatsCsv.push(avg_stats);
        console.log(team.id, ": Correcto")
      });
  
      // Crear y escribir el archivo CSV
      this.csvExport.writeCsv(teamsStatsCsv, 'team_avg_stats.csv');
    });
  }

  // Método que se encarga de crear una gráfica con las probabilidades de victoria de cada equipo
  createCharts(){
    if (this.predictionChart) {
      this.predictionChart.destroy();
    }
    const dataPredict = {
      labels: [
        'Equipo Local',
        'Equipo Visitante'
      ],
      datasets: [{
          label: 'Probabilidad',
          data: [this.probHomeWin, this.probVisitorWin],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)'
          ],
          hoverOffset: 4
        }],
    };
    this.predictionChart = new Chart("chartPrediction", {
      type: 'doughnut' as ChartType,
      data: dataPredict,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        plugins: {
          title: {
            display: true,
            text: 'Probabilidad de Victoria',
            position: 'bottom'
          }
        }
      }
    })
  }

}
