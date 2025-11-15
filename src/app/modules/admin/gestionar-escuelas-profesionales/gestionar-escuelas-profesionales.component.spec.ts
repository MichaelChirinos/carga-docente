import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarEscuelasProfesionalesComponent } from './gestionar-escuelas-profesionales.component';

describe('GestionarEscuelasProfesionalesComponent', () => {
  let component: GestionarEscuelasProfesionalesComponent;
  let fixture: ComponentFixture<GestionarEscuelasProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarEscuelasProfesionalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionarEscuelasProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
