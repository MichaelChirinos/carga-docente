import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LogisticaRequest } from '../../../core/models/logistica.model';
import { DirectorService } from '../services/director.service';

@Component({
  selector: 'app-registrar-logistica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-logistica.component.html'
})
export class RegistrarLogisticaComponent {
  logisticaData: LogisticaRequest = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    cargo: 'logística de escuela'
  };

  isLoading = false;
  mensaje = '';
  error = '';

  constructor(
    private DirectorService: DirectorService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.validarFormulario()) {
      this.error = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.mensaje = '';

    this.DirectorService.registrarLogistica(this.logisticaData).subscribe({
      next: (response) => {
        this.mensaje = response.message;
        this.isLoading = false;
        this.limpiarFormulario();
        
        // Opcional: redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/Administrador/listar-logisticas']);
        }, 2000);
      },
      error: (err) => {
        this.error = 'Error al registrar logística: ' + (err.error?.message || '');
        this.isLoading = false;
        console.error('Error:', err);
      }
    });
  }

  private validarFormulario(): boolean {
    return this.logisticaData.email.trim() !== '' &&
           this.logisticaData.password.trim() !== '' &&
           this.logisticaData.nombre.trim() !== '' &&
           this.logisticaData.apellido.trim() !== '' &&
           this.logisticaData.cargo.trim() !== '';
  }

  private limpiarFormulario(): void {
    this.logisticaData = {
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      cargo: 'logística de escuela'
    };
  }
}