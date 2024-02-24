import { NgModule } from '@angular/core';
import { StandingsComponent } from './standings/standings.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from '../../app.component';
import { StatsService } from '../../services/stats.service';

@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    StatsService
  ],
  bootstrap: [AppComponent],
})
export class StatsModule { }
