import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private apiUrl = 'https://api-nba-v1.p.rapidapi.com/standings';

  private headers = new HttpHeaders({
    'X-RapidAPI-Key': 'ea12f4d7aamsh442372561154d97p18935cjsn4f38abcc1df6',
    'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
  });

  constructor(private http: HttpClient) {}

  getStandings(league: string, season: string): Observable<any> {
    const params = new HttpParams()
      .set('league', league)
      .set('season', season);

    return this.http.get(this.apiUrl, { headers: this.headers, params });
  }
}
