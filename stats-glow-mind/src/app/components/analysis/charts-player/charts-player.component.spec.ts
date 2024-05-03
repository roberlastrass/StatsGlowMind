import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsPlayerComponent } from './charts-player.component';

describe('ChartsPlayerComponent', () => {
  let component: ChartsPlayerComponent;
  let fixture: ComponentFixture<ChartsPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartsPlayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartsPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
