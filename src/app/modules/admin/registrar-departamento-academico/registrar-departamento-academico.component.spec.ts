import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarDepartamentoAcademicoComponent } from './registrar-departamento-academico.component';

describe('RegistrarDepartamentoAcademicoComponent', () => {
  let component: RegistrarDepartamentoAcademicoComponent;
  let fixture: ComponentFixture<RegistrarDepartamentoAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarDepartamentoAcademicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarDepartamentoAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
