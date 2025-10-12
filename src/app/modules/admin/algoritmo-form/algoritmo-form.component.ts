import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DirectorService } from '../services/director.service';
import { AlgoritmoRequest } from '../../../core/models/algoritmo.model';

@Component({
  selector: 'app-algoritmo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './algoritmo-form.component.html'
})
export class AlgoritmoFormComponent {
  algoritmoForm: FormGroup;
  mensaje: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private directorService: DirectorService,
    private router: Router
  ) {
    this.algoritmoForm = this.createForm();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      poblacion: [null, [Validators.required, Validators.min(1)]],
      generacionGa: [null, [Validators.required, Validators.min(1)]],
      probCruzamientos: [null, [Validators.required, Validators.min(0), Validators.max(1)]],
      probMutacion: [null, [Validators.required, Validators.min(0), Validators.max(1)]],
      elitismo: [null, [Validators.required, Validators.min(0), Validators.max(1)]],
      enjambrePso: [null, [Validators.required, Validators.min(1)]],
      iteracionesPso: [null, [Validators.required, Validators.min(1)]],
      inerciaInicial: [null, [Validators.required, Validators.min(0)]],
      inerciaFinal: [null, [Validators.required, Validators.min(0)]],
      cUno: [null, [Validators.required, Validators.min(0)]],
      cDos: [null, [Validators.required, Validators.min(0)]],
      velocidadMaxima: [null, [Validators.required, Validators.min(0)]],
      cicloHibridos: [null, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    // Marcar todos los campos como touched para mostrar errores
    this.markAllFieldsAsTouched();
    
    if (this.algoritmoForm.valid) {
      this.isLoading = true;
      const algoritmoRequest: AlgoritmoRequest = this.algoritmoForm.value;
      
      this.directorService.insertarAlgoritmo(algoritmoRequest).subscribe({
        next: (response) => {
          this.mensaje = response.message;
          this.error = '';
          this.isLoading = false;
          this.algoritmoForm.reset();
        },
        error: (err) => {
          this.error = 'Error al guardar el algoritmo: ' + (err.error?.message || '');
          this.mensaje = '';
          this.isLoading = false;
          console.error('Error:', err);
        }
      });
    } else {
      this.error = 'Por favor complete todos los campos correctamente';
    }
  }

  onClear(): void {
    this.algoritmoForm.reset();
    this.mensaje = '';
    this.error = '';
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.algoritmoForm.controls).forEach(key => {
      const control = this.algoritmoForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  // Helper para mostrar errores
  hasError(controlName: string, errorType: string): boolean {
    const control = this.algoritmoForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }
}