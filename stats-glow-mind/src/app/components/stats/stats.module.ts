import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { StatsService } from '../../services/stats.service';
import { StatsComponent } from './stats.component';
import { StandingsComponent } from './standings/standings.component';
import { LeadersComponent } from './leaders/leaders.component';
import { GamesComponent } from './games/games.component';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    StandingsComponent,
    LeadersComponent,
    GamesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    StandingsComponent,
    LeadersComponent,
    GamesComponent
  ],
  providers: [
    StatsService
  ],
  bootstrap: [StatsComponent],
})
export class StatsModule { }
