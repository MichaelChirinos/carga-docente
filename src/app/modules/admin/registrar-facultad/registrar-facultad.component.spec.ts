import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarFacultadComponent } from './registrar-facultad.component';

describe('RegistrarFacultadComponent', () => {
  let component: RegistrarFacultadComponent;
  let fixture: ComponentFixture<RegistrarFacultadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarFacultadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrarFacultadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
