import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarJefeDepartamentoComponent } from './registrar-jefe-departamento.component';

describe('RegistrarJefeDepartamentoComponent', () => {
  let component: RegistrarJefeDepartamentoComponent;
  let fixture: ComponentFixture<RegistrarJefeDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarJefeDepartamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarJefeDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
