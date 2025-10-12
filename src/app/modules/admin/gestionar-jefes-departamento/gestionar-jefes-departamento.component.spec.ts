import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarJefesDepartamentoComponent } from './gestionar-jefes-departamento.component';

describe('GestionarJefesDepartamentoComponent', () => {
  let component: GestionarJefesDepartamentoComponent;
  let fixture: ComponentFixture<GestionarJefesDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarJefesDepartamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionarJefesDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
