import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarEspecializacionesComponent } from './gestionar-especializaciones.component';

describe('GestionarEspecializacionesComponent', () => {
  let component: GestionarEspecializacionesComponent;
  let fixture: ComponentFixture<GestionarEspecializacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarEspecializacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionarEspecializacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
