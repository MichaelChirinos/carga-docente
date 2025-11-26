// src/app/components/registrar-jefe-departamento/registrar-jefe-departamento.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JefeDepartamentoRequest } from '../../../core/models/jefe-departamento.model';
import { DirectorService } from '../services/director.service';

@Component({
  selector: 'app-registrar-jefe-departamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-jefe-departamento.component.html'
})
export class RegistrarJefeDepartamentoComponent {
  jefeData: JefeDepartamentoRequest = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    cargo: 'jefe de departamento de escuela de ciencias de la computación'
  };

  isLoading = false;
  mensaje = '';
  error = '';

  constructor(
    private directorService: DirectorService,
    public router: Router
  ) {}

  onSubmit() {
    if (!this.validarFormulario()) {
      this.error = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.mensaje = '';

    this.directorService.registrarJefeDepartamento(this.jefeData).subscribe({
      next: (response) => {
        this.mensaje = response.message;
        this.isLoading = false;
        this.limpiarFormulario();
        
        // Opcional: redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/Administrador/gestionar-jefes-departamento']);
        }, 2000);
      },
      error: (err) => {
        this.error = 'Error al registrar jefe de departamento: ' + (err.error?.message || '');
        this.isLoading = false;
        console.error('Error:', err);
      }
    });
  }

  private validarFormulario(): boolean {
    return this.jefeData.email.trim() !== '' &&
           this.jefeData.password.trim() !== '' &&
           this.jefeData.nombre.trim() !== '' &&
           this.jefeData.apellido.trim() !== '' &&
           this.jefeData.cargo.trim() !== '';
  }

  private limpiarFormulario(): void {
    this.jefeData = {
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      cargo: 'jefe de departamento de escuela de ciencias de la computación'
    };
  }
}