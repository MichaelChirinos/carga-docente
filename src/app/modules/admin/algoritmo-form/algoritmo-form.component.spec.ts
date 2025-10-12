import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgoritmoFormComponent } from './algoritmo-form.component';

describe('AlgoritmoFormComponent', () => {
  let component: AlgoritmoFormComponent;
  let fixture: ComponentFixture<AlgoritmoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlgoritmoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlgoritmoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
