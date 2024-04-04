import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

export interface PlayerData {
  RANK: number;
  PLAYER: string;
  TEAM: string;
  GP: number;
  MIN: number;
  PTS: number;
  FG_PCT: number;
  FG3_PCT: number;
  FTA: number;
}

@Component({
  selector: 'stats-leaders',
  templateUrl: './leaders.component.html',
  styleUrl: './leaders.component.css'
})
export class LeadersComponent implements OnInit {

  players: any[] = [];
  displayedColumns: string[] = ['RANK', 'PLAYER', 'TEAM', 'GP', 'MIN', 'PTS'];
  displayedColumnsLarge: string[] = ['RANK', 'PLAYER', 'TEAM', 'GP', 'MIN', 'PTS', 'FG_PCT', 'FG3_PCT', 'FTA', 'EFF'];
  dataSource!: MatTableDataSource<PlayerData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  color = '#002649';
  smallScreen: boolean = false;

  constructor(
    private statsService: StatsService
  ) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.getLeadersNBA();
  }

  // Método que realiza una llamada a la API para mostrar los datos de los líderes de la NBA
  getLeadersNBA(): void {
    this.statsService.getLeaders('2023-24').subscribe(
      data => {
        console.log('Datos de jugadores recibidos:', data);
        this.players = data.resultSet.rowSet;

        this.dataSource = new MatTableDataSource(this.players);
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.error('Error al obtener datos de jugadores:', error);
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

}
