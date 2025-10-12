// listar-escuelas.component.ts
import { Component } from '@angular/core';
import { DirectorService } from '../services/director.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-escuelas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-escuelas.component.html'
})
export class ListarEscuelasComponent {
  escuelas: any[] = [];
  escuelaSeleccionada: any = null;
  escuelaEditando: any = null;
  escuelaEliminando: any = null;
  loading = true;
  loadingDetalle = false;
  loadingEdicion = false;
  loadingEliminacion = false;
  error = '';
  mostrarModal = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEscuelas();
  }

  cargarEscuelas(): void {
    this.loading = true;
    this.directorService.obtenerEscuelas().subscribe({
      next: (response: any) => {
        this.escuelas = response.data || response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar escuelas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // Ver detalles
  verDetalles(escuela: any): void {
    this.loadingDetalle = true;
    this.mostrarModal = true;
    this.error = '';

    this.directorService.obtenerEscuelaPorId(escuela.idEscuela).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.escuelaSeleccionada = response.data;
        } else {
          this.error = response.message || 'Escuela no encontrada';
          this.escuelaSeleccionada = null;
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles de la escuela';
        this.escuelaSeleccionada = null;
        this.loadingDetalle = false;
        console.error(err);
      }
    });
  }

  // Abrir modal para editar
  abrirEditar(escuela: any): void {
    this.escuelaEditando = { ...escuela };
    this.mostrarModalEditar = true;
    this.error = '';
  }

  // Abrir modal para eliminar
  abrirEliminar(escuela: any): void {
    this.escuelaEliminando = { ...escuela };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  // Guardar cambios de edición
  guardarEdicion(): void {
    if (!this.escuelaEditando.nombre?.trim()) {
      this.error = 'El nombre de la escuela es obligatorio';
      return;
    }

    this.loadingEdicion = true;
    
    const datosActualizacion = {
      nombre: this.escuelaEditando.nombre.trim(),
      idFacultad: 1
    };

    this.directorService.actualizarEscuela(this.escuelaEditando.idEscuela, datosActualizacion).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Actualizar la lista local
          const index = this.escuelas.findIndex(e => e.idEscuela === this.escuelaEditando.idEscuela);
          if (index !== -1) {
            this.escuelas[index] = { ...this.escuelas[index], ...response.data };
          }
          this.cerrarModalEditar();
          this.cargarEscuelas(); // Recargar para asegurar datos actualizados
        } else {
          this.error = response.message || 'Error al actualizar la escuela';
        }
        this.loadingEdicion = false;
      },
      error: (err) => {
        this.error = 'Error al actualizar la escuela';
        this.loadingEdicion = false;
        console.error(err);
      }
    });
  }

  // Confirmar eliminación
  confirmarEliminacion(): void {
    this.loadingEliminacion = true;

    this.directorService.eliminarEscuela(this.escuelaEliminando.idEscuela).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Eliminar de la lista local
          this.escuelas = this.escuelas.filter(e => e.idEscuela !== this.escuelaEliminando.idEscuela);
          this.cerrarModalEliminar();
          this.cargarEscuelas(); // Recargar lista
        } else {
          this.error = response.message || 'Error al eliminar la escuela';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar la escuela';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  // Cerrar modales
  cerrarModal(): void {
    this.mostrarModal = false;
    this.escuelaSeleccionada = null;
    this.error = '';
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.escuelaEditando = null;
    this.error = '';
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.escuelaEliminando = null;
    this.error = '';
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }
}