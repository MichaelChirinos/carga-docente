import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarAsignacionComponent } from './registrar-asignacion.component';

describe('RegistrarAsignacionComponent', () => {
  let component: RegistrarAsignacionComponent;
  let fixture: ComponentFixture<RegistrarAsignacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarAsignacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
