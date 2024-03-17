import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  // Rutas de la API
  private apiUrls = {
    standings: 'https://api-nba-v1.p.rapidapi.com/standings',
    leagueLeaders: 'https://stats.nba.com/stats/leagueLeaders'
  };

  // Claves de la API
  private headers = new HttpHeaders({
    'X-RapidAPI-Key': 'ea12f4d7aamsh442372561154d97p18935cjsn4f38abcc1df6',
    'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
  });

  constructor(private http: HttpClient) {}

  // Método que recoge los datos de la clasificación
  getStandings(league: string, season: string): Observable<any> {
    const params = new HttpParams()
      .set('league', league)
      .set('season', season);

    return this.http.get(this.apiUrls.standings, { headers: this.headers, params });
  }

  // Método que recoge los datos de los lideres de la sesion
  getLeaders(season: string): Observable<any> {
    const params = new HttpParams()
      .set('LeagueID', '00')
      .set('PerMode', 'PerGame')
      .set('Scope', 'S')
      .set('Season', season)
      .set('SeasonType', 'Regular Season')
      .set('StatCategory', 'PTS');

      return this.http.get(this.apiUrls.leagueLeaders, {params });
  }

}
