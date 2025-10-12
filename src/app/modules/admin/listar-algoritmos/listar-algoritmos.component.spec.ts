import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarAlgoritmosComponent } from './listar-algoritmos.component';

describe('ListarAlgoritmosComponent', () => {
  let component: ListarAlgoritmosComponent;
  let fixture: ComponentFixture<ListarAlgoritmosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarAlgoritmosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarAlgoritmosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
