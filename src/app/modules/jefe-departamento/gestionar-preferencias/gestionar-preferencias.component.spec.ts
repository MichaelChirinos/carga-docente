import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarPreferenciasComponent } from './gestionar-preferencias.component';

describe('GestionarPreferenciasComponent', () => {
  let component: GestionarPreferenciasComponent;
  let fixture: ComponentFixture<GestionarPreferenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarPreferenciasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionarPreferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
