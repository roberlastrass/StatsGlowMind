import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { StatsComponent } from './components/stats/stats.component';
import { StandingsComponent } from './components/stats/standings/standings.component';

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
  { path: 'stats', component: StatsComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])) },
  { path: 'stats/standings', component: StandingsComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/login'])) },
  { path: '**', redirectTo: 'main', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

export { routes };
