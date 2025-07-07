import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarCicloAcademicoComponent } from './registrar-ciclo-academico.component';

describe('RegistrarCicloAcademicoComponent', () => {
  let component: RegistrarCicloAcademicoComponent;
  let fixture: ComponentFixture<RegistrarCicloAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarCicloAcademicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarCicloAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
