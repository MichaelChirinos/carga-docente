import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarEscuelaComponent } from './registrar-escuela.component';

describe('RegistrarEscuelaComponent', () => {
  let component: RegistrarEscuelaComponent;
  let fixture: ComponentFixture<RegistrarEscuelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarEscuelaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarEscuelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
