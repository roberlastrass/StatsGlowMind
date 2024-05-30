import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { StatsService } from '../../services/stats.service';
import { StatsComponent } from './stats.component';
import { StandingsComponent } from './standings/standings.component';
import { LeadersComponent } from './leaders/leaders.component';
import { GamesComponent } from './games/games.component';
import { PlayoffsComponent } from './playoffs/playoffs.component';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    StandingsComponent,
    LeadersComponent,
    GamesComponent,
    PlayoffsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule
  ],
  exports: [
    StandingsComponent,
    LeadersComponent,
    GamesComponent,
    PlayoffsComponent
  ],
  providers: [
    StatsService
  ],
  bootstrap: [StatsComponent],
})
export class StatsModule { }
