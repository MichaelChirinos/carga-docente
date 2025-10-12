import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarDisponibilidadesComponent } from './gestionar-disponibilidades.component';

describe('GestionarDisponibilidadesComponent', () => {
  let component: GestionarDisponibilidadesComponent;
  let fixture: ComponentFixture<GestionarDisponibilidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarDisponibilidadesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionarDisponibilidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
