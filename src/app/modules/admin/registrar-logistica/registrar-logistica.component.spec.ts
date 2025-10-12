import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarLogisticaComponent } from './registrar-logistica.component';

describe('RegistrarLogisticaComponent', () => {
  let component: RegistrarLogisticaComponent;
  let fixture: ComponentFixture<RegistrarLogisticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarLogisticaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarLogisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
