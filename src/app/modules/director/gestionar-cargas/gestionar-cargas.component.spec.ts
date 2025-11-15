import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarCargasComponent } from './gestionar-cargas.component';

describe('GestionarCargasComponent', () => {
  let component: GestionarCargasComponent;
  let fixture: ComponentFixture<GestionarCargasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarCargasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionarCargasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
