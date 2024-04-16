import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_KEY } from '../keys/keys';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  // Rutas de la API
  private apiUrls = {
    standings: 'https://api-nba-v1.p.rapidapi.com/standings',
    leagueLeaders: 'https://stats.nba.com/stats/leagueLeaders',
    games: 'https://api-nba-v1.p.rapidapi.com/games',
    playoffs: 'https://stats.nba.com/stats/playoffbracket',
    teams: 'https://api-nba-v1.p.rapidapi.com/teams',
    seasonGames: 'https://api-nba-v1.p.rapidapi.com/games',
    gameStats: 'https://api-nba-v1.p.rapidapi.com/games/statistics'
  };

  // Claves de la API
  private headers = new HttpHeaders({
    'X-RapidAPI-Key': API_KEY,
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
  getLeaders(season: string, category: string): Observable<any> {
    const params = new HttpParams()
      .set('LeagueID', '00')
      .set('PerMode', 'PerGame')
      .set('Scope', 'S')
      .set('Season', season)
      .set('SeasonType', 'Regular Season')
      .set('StatCategory', category);

      return this.http.get(this.apiUrls.leagueLeaders, { params });
  }

  // Método que recoge los datos de los partidos
  getGames(date: string): Observable<any> {
    const params = new HttpParams()
      .set('date', date);

    return this.http.get(this.apiUrls.games, { headers: this.headers, params });
  }

  // Método que recoge los datos de los lideres de la sesion
  getPlayoffs(season: string): Observable<any> {
    const params = new HttpParams()
      .set('LeagueID', '00')
      .set('SeasonYear', season)
      .set('State', '2');

      return this.http.get(this.apiUrls.playoffs, { params });
  }

  // Método que recoge los datos de los equipos
  getTeams(division: string): Observable<any> {
    const params = new HttpParams()
      .set('division', division);

    return this.http.get(this.apiUrls.teams, { headers: this.headers, params });
  }

  // Método que recoge los datos de los partidos de la sesion
  getSeasonGames(season: string): Observable<any> {
    const params = new HttpParams()
      .set('season', season);

    return this.http.get(this.apiUrls.seasonGames, { headers: this.headers, params });
  }

  // Método que recoge los datos de los partidos de la sesion
  getGameStats(idGame: number): Observable<any> {
    const params = new HttpParams()
      .set('id', idGame);

    return this.http.get(this.apiUrls.gameStats, { headers: this.headers, params });
  }

}
