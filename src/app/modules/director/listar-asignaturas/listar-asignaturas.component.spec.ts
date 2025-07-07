import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAsignaturasComponent } from './listar-asignaturas.component';

describe('ListarAsignaturasComponent', () => {
  let component: ListarAsignaturasComponent;
  let fixture: ComponentFixture<ListarAsignaturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAsignaturasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarAsignaturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
