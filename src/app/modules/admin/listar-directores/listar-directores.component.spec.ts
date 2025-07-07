import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDirectoresComponent } from './listar-directores.component';

describe('ListarDirectoresComponent', () => {
  let component: ListarDirectoresComponent;
  let fixture: ComponentFixture<ListarDirectoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarDirectoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarDirectoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
