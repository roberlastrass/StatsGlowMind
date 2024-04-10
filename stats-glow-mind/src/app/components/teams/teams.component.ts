import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatsService } from '../../services/stats.service';
import { Teams } from '../../models/teams.model';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})
export class TeamsComponent implements OnInit {
  
  allTeams: any[] = [];
  divisions = ['Atlantic', 'Central', 'Southeast', 'Northwest', 'Pacific', 'Southwest'];
  eastDivisions: any[] = [
    { name: 'Atlántico', conferencia: "Este", division: "Atlantic", conference: 'East' },
    { name: 'Central', conferencia: "Este", division: "Central", conference: 'East' },
    { name: 'Sudeste', conferencia: "Este", division: "Southeast", conference: 'East' }
 ];
  westDivisions: any[] = [
    { name: 'Noroeste', conferencia: "Oeste", division: "Northwest", conference: 'West' },
    { name: 'Pacífico', conferencia: "Oeste", division: "Pacific", conference: 'West' },
    { name: 'Sudoeste', conferencia: "Oeste", division: "Southwest", conference: 'West' }
  ];

  constructor( 
    private router: Router,
    private statsService: StatsService,
    private firestore: FirestoreService
  ) { }

  ngOnInit(): void {
    //this.getAllDivisionTeams();
    this.getTeamsFromFirestore();
  }

  statsTeam(teamName: string) {
    this.router.navigate(['/teams/' + teamName]);
  }
  playersTeam(teamName: string) {
    this.router.navigate(['/teams/' + teamName + '/players']);
  }

  // Método que recoge los datos de los equipos de cada division de la API y lo almacena en la Firestore
  getAllDivisionTeams(): void {
    this.divisions.forEach(division => {
      this.statsService.getTeams(division)
        .subscribe(
          response => {
            response.response.forEach((team: {
              nickname: string;
              name: string;
              logo: string;
              leagues: any;
              code: string;
              city: string; id: number; 
            }) => {
              if (team.id !== 102 && team.id !== 103) {
                const teamData: Teams = {
                  city: team.city,
                  code: team.code,
                  conference: team.leagues.standard.conference,
                  division: team.leagues.standard.division,
                  id: team.id,
                  logo: team.logo,
                  name: team.name,
                  nickname: team.nickname,
                };
                //this.firestore.addOrUpdateTeams(teamData); // Actualiza o inserta el equipo en la bbdd
              }
            });
          },
          error => {
            console.error(error);
          }
        );
    });
  }

  // Método que recoge los datos de la colección Teams de Firestore
  getTeamsFromFirestore(): void {
    this.firestore.getTeams().subscribe(teams => {
      this.allTeams = teams;
    });
  }

  // Método que filtra los datos de playoffs en rounds y en conference
  filteredDivisions(division: string): any[] {
    if (!this.allTeams) {
      return [];
    }
    return this.allTeams.filter((team: any) => 
      team.division === division
    ).sort((a, b) => a.id - b.id);
  }

}
