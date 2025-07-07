import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarAsignaturaComponent } from './registrar-asignatura.component';

describe('RegistrarAsignaturaComponent', () => {
  let component: RegistrarAsignaturaComponent;
  let fixture: ComponentFixture<RegistrarAsignaturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarAsignaturaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarAsignaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
