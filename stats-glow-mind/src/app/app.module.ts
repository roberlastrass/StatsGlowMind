import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HttpClient  } from '@angular/common/http';
import { StatsModule } from './components/stats/stats.module';
import { MaterialModule } from './material/material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { UserService } from './services/user.service';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { StatsComponent } from './components/stats/stats.component';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AdminComponent, DialogDeleteUser, DialogUpdateUser } from './components/admin/admin.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TeamsComponent } from './components/teams/teams.component';
import { TeamStatsComponent } from './components/teams/team-stats/team-stats.component';
import { TeamPlayersComponent } from './components/teams/team-players/team-players.component';
import { FooterComponent } from './components/footer/footer.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import { ChartsPlayerComponent } from './components/analysis/charts-player/charts-player.component';
import { PredictComponent } from './components/predict/predict.component';
import { AboutComponent } from './components/about/about.component';
import { GlossaryComponent } from './components/glossary/glossary.component';

// Exportamos una función para crear un nuevo TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    MainComponent,
    StatsComponent,
    AdminComponent,
    TeamsComponent,
    TeamStatsComponent,
    TeamPlayersComponent,
    FooterComponent,
    AnalysisComponent,
    ChartsPlayerComponent,
    PredictComponent,
    AboutComponent,
    GlossaryComponent,
    DialogUpdateUser,
    DialogDeleteUser
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    HttpClientModule,
    StatsModule,
    provideFirestore(() => getFirestore()),
    MaterialModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    UserService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
