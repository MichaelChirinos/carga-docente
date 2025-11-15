import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAsignacionesEscuelasComponent } from './listar-asignaciones-escuelas.component';

describe('ListarAsignacionesEscuelasComponent', () => {
  let component: ListarAsignacionesEscuelasComponent;
  let fixture: ComponentFixture<ListarAsignacionesEscuelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAsignacionesEscuelasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarAsignacionesEscuelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
