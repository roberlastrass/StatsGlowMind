import { Component, OnInit } from '@angular/core';
import { StatsService } from '../../../services/stats.service';

@Component({
  selector: 'stats-leaders',
  templateUrl: './leaders.component.html',
  styleUrl: './leaders.component.css'
})
export class LeadersComponent implements OnInit {

  players: any[] = [];

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    this.getLeadersNBA();
  }

  getLeadersNBA(): void {
    this.statsService.getLeaders('2023-24').subscribe(
      data => {
        // Aquí puedes manipular los datos antes de mostrarlos en el componente
        console.log('Datos de jugadores recibidos:', data);
        this.players = data.resultSet.rowSet;
      },
      error => {
        console.error('Error al obtener datos de jugadores:', error);
      }
    );
  }

}
