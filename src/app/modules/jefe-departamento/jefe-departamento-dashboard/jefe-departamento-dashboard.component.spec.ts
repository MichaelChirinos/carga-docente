import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefeDepartamentoDashboardComponent } from './jefe-departamento-dashboard.component';

describe('JefeDepartamentoDashboardComponent', () => {
  let component: JefeDepartamentoDashboardComponent;
  let fixture: ComponentFixture<JefeDepartamentoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JefeDepartamentoDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JefeDepartamentoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
