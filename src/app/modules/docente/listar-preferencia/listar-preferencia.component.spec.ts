import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPreferenciaComponent } from './listar-preferencia.component';

describe('ListarPreferenciaComponent', () => {
  let component: ListarPreferenciaComponent;
  let fixture: ComponentFixture<ListarPreferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPreferenciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarPreferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
