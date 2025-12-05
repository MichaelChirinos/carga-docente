import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAsignacionesEscuelaComponent } from './listar-asignaciones-escuelas.component';

describe('ListarAsignacionesEscuelasComponent', () => {
  let component: ListarAsignacionesEscuelaComponent;
  let fixture: ComponentFixture<ListarAsignacionesEscuelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAsignacionesEscuelaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarAsignacionesEscuelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
