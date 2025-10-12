import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarLogisticaComponent } from './gestionar-logistica.component';

describe('GestionarLogisticaComponent', () => {
  let component: GestionarLogisticaComponent;
  let fixture: ComponentFixture<GestionarLogisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarLogisticaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionarLogisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
