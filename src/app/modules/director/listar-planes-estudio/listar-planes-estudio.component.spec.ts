import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPlanesEstudioComponent } from './listar-planes-estudio.component';

describe('ListarPlanesEstudioComponent', () => {
  let component: ListarPlanesEstudioComponent;
  let fixture: ComponentFixture<ListarPlanesEstudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPlanesEstudioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarPlanesEstudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
