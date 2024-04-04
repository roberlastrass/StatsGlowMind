import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { StatsComponent } from './components/stats/stats.component';
import { StandingsComponent } from './components/stats/standings/standings.component';
import { LeadersComponent } from './components/stats/leaders/leaders.component';
import { GamesComponent } from './components/stats/games/games.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  {
    path: 'main',
    component: MainComponent,
    // Esto lo tengo que hacer para cuando un usuario NO registrado no pueda acceder a ciertas partes de la app
    //...canActivate(() => redirectUnauthorizedTo(['/register']))
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'stats', component: StatsComponent,
    children: [
      { path: 'standings', component: StandingsComponent },
      //{ path: 'playoffs', component: PlayoffsComponent },
      { path: 'games', component: GamesComponent },
      { path: 'leaders', component: LeadersComponent },
      { path: '', redirectTo: 'standings', pathMatch: 'full' },
    ] 
  },
  { path: '**', redirectTo: 'main', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

export { routes };
