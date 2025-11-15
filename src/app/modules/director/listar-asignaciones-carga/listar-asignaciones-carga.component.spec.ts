import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAsignacionesCargaComponent } from './listar-asignaciones-carga.component';

describe('ListarAsignacionesCargaComponent', () => {
  let component: ListarAsignacionesCargaComponent;
  let fixture: ComponentFixture<ListarAsignacionesCargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAsignacionesCargaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarAsignacionesCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
