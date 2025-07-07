import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPlanEstudioComponent } from './registrar-plan-estudio.component';

describe('RegistrarPlanEstudioComponent', () => {
  let component: RegistrarPlanEstudioComponent;
  let fixture: ComponentFixture<RegistrarPlanEstudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarPlanEstudioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarPlanEstudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
