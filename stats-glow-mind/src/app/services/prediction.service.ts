import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  
  constructor(private http: HttpClient) { }

  predict(homeTeamId: number, visitorTeamId: number): Observable<any> {
    const body = {
      home_team_id: homeTeamId,
      visitor_team_id: visitorTeamId
    };
    return this.http.post<any>('https://us-central1-statsglowmindtfg.cloudfunctions.net/predict', body);
  }

}
