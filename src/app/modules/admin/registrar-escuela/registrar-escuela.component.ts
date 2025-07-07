import { Component } from '@angular/core';
import { DirectorService } from '../services/director.service';
import { EscuelaRequest, EscuelaResponse } from '../../../core/models/escuela';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-escuela',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-escuela.component.html',
  styleUrls: ['./registrar-escuela.component.scss']
})
export class RegistrarEscuelaComponent {
  escuelasLista: EscuelaRequest[] = [];
  nuevaEscuela: EscuelaRequest = {
    nombre: '',
    idFacultad: 0
  };
  facultades: any[] = [];
  isLoading = false;
  message = '';
  isError = false;

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarFacultades();
  }

  cargarFacultades(): void {
    this.isLoading = true;
    this.directorService.obtenerFacultades().subscribe({
      next: (response: any) => {
        this.facultades = response.data || response;
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar facultades', true);
        this.isLoading = false;
      }
    });
  }

  // Método para obtener el nombre de la facultad
  getNombreFacultad(idFacultad: number): string {
    const facultad = this.facultades.find(f => f.idFacultad === idFacultad);
    return facultad ? facultad.nombre : 'No asignada';
  }

  agregarEscuela(): void {
    if (this.validarEscuela(this.nuevaEscuela)) {
      this.escuelasLista.push({
        nombre: this.nuevaEscuela.nombre.trim(),
        idFacultad: this.nuevaEscuela.idFacultad
      });
      this.nuevaEscuela = { nombre: '', idFacultad: 0 };
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
    this.directorService.registrarEscuelasMultiples(this.escuelasLista).subscribe({
      next: (response: EscuelaResponse) => {
        this.showMessage(response.message || 'Escuelas registradas con éxito', false);
        setTimeout(() => this.router.navigate(['/admin/gestionar-escuelas']), 1500);
      },
      error: (err) => {
        this.showMessage('Error: ' + (err.error?.message || 'No se pudieron registrar las escuelas'), true);
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
    if (escuela.idFacultad <= 0) {
      this.showMessage('Debe seleccionar una facultad', true);
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