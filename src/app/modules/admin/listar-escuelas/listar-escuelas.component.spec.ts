import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarEscuelasComponent } from './listar-escuelas.component';

describe('ListarEscuelasComponent', () => {
  let component: ListarEscuelasComponent;
  let fixture: ComponentFixture<ListarEscuelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarEscuelasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarEscuelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
