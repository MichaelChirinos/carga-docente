import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAsignacionesComponent } from './listar-asignaciones-docente.component';

describe('ListarAsignacionesDocenteComponent', () => {
  let component: ListarAsignacionesComponent;
  let fixture: ComponentFixture<ListarAsignacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAsignacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarAsignacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
