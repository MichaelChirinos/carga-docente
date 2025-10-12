// registrar-escuela.component.ts
import { Component } from '@angular/core';
import { DirectorService } from '../services/director.service';
import { EscuelaRequest, EscuelaResponse } from '../../../core/models/escuela';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registrar-escuela',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Agregar RouterModule
  templateUrl: './registrar-escuela.component.html'
})
export class RegistrarEscuelaComponent {
  escuelasLista: EscuelaRequest[] = [];
  nuevaEscuela: EscuelaRequest = {
    nombre: '',
  };
  isLoading = false;
  message = '';
  isError = false;

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  agregarEscuela(): void {
    if (this.validarEscuela(this.nuevaEscuela)) {
      this.escuelasLista.push({
        nombre: this.nuevaEscuela.nombre.trim()
      });
      this.nuevaEscuela = { nombre: '' };
    }
  }

  eliminarEscuela(index: number): void {
    this.escuelasLista.splice(index, 1);
  }

  registrarEscuelas(): void {
    if (this.escuelasLista.length === 0) {
      this.showMessage('Debe agregar al menos una escuela', true);
      return;
    }

    this.isLoading = true;
    
    // Si tu backend acepta múltiples escuelas
    this.directorService.registrarEscuelasMultiples(this.escuelasLista).subscribe({
      next: (response: EscuelaResponse) => {
        this.showMessage(response.message || 'Escuelas registradas con éxito', false);
        setTimeout(() => this.router.navigate(['/admin/gestionar-escuelas']), 1500); // Cambiado a listar-escuelas
      },
      error: (err) => {
        this.showMessage('Error: ' + (err.error?.message || 'No se pudieron registrar las escuelas'), true);
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // Método alternativo si solo registras una escuela a la vez
  registrarEscuelaIndividual(): void {
    if (!this.nuevaEscuela.nombre.trim()) {
      this.showMessage('El nombre de la escuela es obligatorio', true);
      return;
    }

    this.isLoading = true;
    this.directorService.registrarEscuela(this.nuevaEscuela).subscribe({
      next: (response: EscuelaResponse) => {
        this.showMessage(response.message || 'Escuela registrada con éxito', false);
        this.nuevaEscuela = { nombre: '' };
        setTimeout(() => this.router.navigate(['/admin/gestionar-escuelas']), 1500);
      },
      error: (err) => {
        this.showMessage('Error: ' + (err.error?.message || 'No se pudo registrar la escuela'), true);
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  private validarEscuela(escuela: EscuelaRequest): boolean {
    if (!escuela.nombre?.trim()) {
      this.showMessage('El nombre de la escuela es obligatorio', true);
      return false;
    }
    return true;
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}