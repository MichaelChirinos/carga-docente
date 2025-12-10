import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCursosEscuelaComponent } from './reporte-cursos-escuela.component';

describe('ReporteCursosEscuelaComponent', () => {
  let component: ReporteCursosEscuelaComponent;
  let fixture: ComponentFixture<ReporteCursosEscuelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteCursosEscuelaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteCursosEscuelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
