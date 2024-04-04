import { Component, Inject, OnInit } from '@angular/core';
import { StatsService } from '../../../services/stats.service';
import { FormControl } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'stats-games',
  templateUrl: './games.component.html',
  styleUrl: './games.component.css',
  providers: [provideNativeDateAdapter()]
})
export class GamesComponent implements OnInit {

  games: any[] = [];
  currentDate: Date = new Date();
  date = new FormControl(new Date());

  constructor(
    private statsService: StatsService
  ) { }

  ngOnInit(): void {
    this.getGamesToday();
  }

  // Método que al cambiar de fecha en el Datepicker, llama a la función getGames(date)
  changeDate(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      const selectedDate = new Date(event.value);
      selectedDate.setDate(selectedDate.getDate() + 1); // Sumar un día
      const formattedDate = selectedDate.toISOString().split('T')[0];
      this.getGamesOfDate(formattedDate);
      console.log(formattedDate);
    }
  }

  // Método que realiza una llamada a la API para recoger los datos del partido de la fecha deseada
  getGamesOfDate(date: string): void {
    this.statsService.getGames(date)
      .subscribe(
        response => {
          this.games = response.response;
        },
        error => {
          console.error(error);
        }
      );
  }

  // Método que realiza una llamada a la API para recoger los datos del partido de hoy
  getGamesToday(): void {
    const today = this.currentDate.toISOString().split('T')[0];
    console.log(today);
    this.statsService.getGames(today)
      .subscribe(
        response => {
          this.games = response.response;
        },
        error => {
          console.error(error);
        }
      );
  }

}
