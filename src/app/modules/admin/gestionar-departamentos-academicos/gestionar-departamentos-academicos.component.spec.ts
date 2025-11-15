import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarDepartamentosAcademicosComponent } from './gestionar-departamentos-academicos.component';

describe('GestionarDepartamentosAcademicosComponent', () => {
  let component: GestionarDepartamentosAcademicosComponent;
  let fixture: ComponentFixture<GestionarDepartamentosAcademicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarDepartamentosAcademicosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionarDepartamentosAcademicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
