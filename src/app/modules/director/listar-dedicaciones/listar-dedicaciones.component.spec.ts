import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDedicacionesComponent } from './listar-dedicaciones.component';

describe('ListarDedicacionesComponent', () => {
  let component: ListarDedicacionesComponent;
  let fixture: ComponentFixture<ListarDedicacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarDedicacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarDedicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
