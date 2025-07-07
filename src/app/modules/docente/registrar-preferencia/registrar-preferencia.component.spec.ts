import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPreferenciaComponent } from './registrar-preferencia.component';

describe('RegistrarPreferenciaComponent', () => {
  let component: RegistrarPreferenciaComponent;
  let fixture: ComponentFixture<RegistrarPreferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarPreferenciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarPreferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
