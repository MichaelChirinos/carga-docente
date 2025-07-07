import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCiclosAcademicosComponent } from './listar-ciclos-academicos.component';

describe('ListarCiclosAcademicosComponent', () => {
  let component: ListarCiclosAcademicosComponent;
  let fixture: ComponentFixture<ListarCiclosAcademicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarCiclosAcademicosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarCiclosAcademicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
