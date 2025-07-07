import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarFacultadesComponent } from './listar-facultades.component';

describe('ListarFacultadesComponent', () => {
  let component: ListarFacultadesComponent;
  let fixture: ComponentFixture<ListarFacultadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarFacultadesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarFacultadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
