import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarEscuelaProfesionalComponent } from './registrar-escuela-profesional.component';

describe('RegistrarEscuelaProfesionalComponent', () => {
  let component: RegistrarEscuelaProfesionalComponent;
  let fixture: ComponentFixture<RegistrarEscuelaProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarEscuelaProfesionalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarEscuelaProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
