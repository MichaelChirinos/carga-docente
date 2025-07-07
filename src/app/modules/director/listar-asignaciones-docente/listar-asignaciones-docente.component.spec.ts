import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAsignacionesDocenteComponent } from './listar-asignaciones-docente.component';

describe('ListarAsignacionesDocenteComponent', () => {
  let component: ListarAsignacionesDocenteComponent;
  let fixture: ComponentFixture<ListarAsignacionesDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAsignacionesDocenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarAsignacionesDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
