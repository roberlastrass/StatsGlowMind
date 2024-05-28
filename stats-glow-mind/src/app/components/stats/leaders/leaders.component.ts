import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

export interface PlayerData {
  RANK: number;
  PLAYER: string;
  TEAM: string;
  GP: number;
  MIN: number;
  PTS: number;
  REB: number;
  AST: number;
  STL: number;
  BLK: number;
  FG_PCT: number;
  FG3_PCT: number;
  FTA: number;
  EFF: number;
}

@Component({
  selector: 'stats-leaders',
  templateUrl: './leaders.component.html',
  styleUrl: './leaders.component.css'
})
export class LeadersComponent implements OnInit {

  players: any[] = [];
  displayedColumnsSort: string[] = ['RANK', 'PLAYER', 'MIN', 'PTS', 'EFF'];
  displayedColumnsMedium: string[] = ['RANK', 'PLAYER', 'TEAM', 'GP', 'MIN', 'PTS', 'AST', 'REB', 'EFF'];
  displayedColumnsLarge: string[] = ['RANK', 'PLAYER', 'TEAM', 'GP', 'MIN', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'FG_PCT', 'FG3_PCT', 'FTA', 'EFF'];
  dataSource!: MatTableDataSource<PlayerData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  color = '#002649';
  smallScreen: boolean = false;
  mediumScreen: boolean = false;
  category: string = "PTS";
  title: any[] = [
    { name: 'Líderes en Puntos por Partido', category: 'PTS' },
    { name: 'Líderes en Rebotes por Partido', category: 'REB' },
    { name: 'Líderes en Asistencias por Partido', category: 'AST' },
    { name: 'Líderes en Robos por Partido', category: 'STL' },
    { name: 'Líderes en Tapones por Partido', category: 'BLK' },
    { name: 'Líderes en Eficiencia', category: 'EFF' }
  ];

  constructor(
    private statsService: StatsService,
    private router: Router
  ) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.getLeadersNBA();
  }

  // Método que realiza una llamada a la API para mostrar los datos de los líderes de la NBA
  getLeadersNBA(): void {
    this.statsService.getLeaders('2023-24', this.category).subscribe(
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

  // Método que filtra los datos de lideres por categoria
  filteredCategory(category: string): void {
    this.category = category;
    this.getLeadersNBA();
    this.displayedColumnsSort = ['RANK', 'PLAYER', 'MIN', category.toUpperCase(), 'EFF'];
    if (category == 'STL' || category == 'BLK') {
      this.displayedColumnsMedium = ['RANK', 'PLAYER', 'TEAM', 'GP', 'MIN', 'PTS', 'AST', 'REB', category.toUpperCase(), 'EFF'];
    } else if (category == 'EFF') {
      this.displayedColumnsSort = ['RANK', 'PLAYER', 'TEAM', 'MIN', category.toUpperCase()];
    }
  }

  // Método que modifica el titulo de la página, según la categoria seleccionada
  getTitle(category: string): string {
    const titleCategory = this.title.find(option => option.category === category);
    return titleCategory ? titleCategory.name : 'Líderes';
  }

  // Función para comprobar el tamaño de la pantalla
  checkScreenSize() {
    this.smallScreen = window.innerWidth <= 800;
    this.mediumScreen = window.innerWidth <= 1100;
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
