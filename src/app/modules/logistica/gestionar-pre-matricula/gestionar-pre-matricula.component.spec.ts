import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarPreMatriculaComponent } from './gestionar-pre-matricula.component';

describe('GestionarPreMatriculaComponent', () => {
  let component: GestionarPreMatriculaComponent;
  let fixture: ComponentFixture<GestionarPreMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarPreMatriculaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionarPreMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
