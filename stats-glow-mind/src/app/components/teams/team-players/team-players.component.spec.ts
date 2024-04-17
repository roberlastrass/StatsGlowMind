import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPlayersComponent } from './team-players.component';

describe('TeamPlayersComponent', () => {
  let component: TeamPlayersComponent;
  let fixture: ComponentFixture<TeamPlayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamPlayersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
