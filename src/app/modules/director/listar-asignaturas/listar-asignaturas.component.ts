// listar-asignaturas.component.ts
import { Component } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-asignaturas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-asignaturas.component.html'
})
export class ListarAsignaturasComponent {
  asignaturas: any[] = [];
  asignaturaSeleccionada: any = null;
  asignaturaEliminando: any = null;
  
  loading = true;
  loadingDetalle = false;
  loadingEliminacion = false;
  
  error = '';
  mostrarModalDetalle = false;
  mostrarModalEliminar = false;

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarAsignaturas();
  }

  cargarAsignaturas(): void {
    this.loading = true;
    this.directorService.obtenerAsignaturas().subscribe({
      next: (response: any) => {
        this.asignaturas = response.data || response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar asignaturas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // Ver detalles de la asignatura
  verDetalles(asignatura: any): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.error = '';

    this.directorService.obtenerAsignaturaPorId(asignatura.idAsignatura).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.asignaturaSeleccionada = response.data;
        } else {
          this.error = response.message || 'Asignatura no encontrada';
          this.asignaturaSeleccionada = null;
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles de la asignatura';
        this.asignaturaSeleccionada = null;
        this.loadingDetalle = false;
        console.error(err);
      }
    });
  }

  // Abrir modal para eliminar
  abrirEliminar(asignatura: any): void {
    this.asignaturaEliminando = { ...asignatura };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  // Confirmar eliminación
  confirmarEliminacion(): void {
    this.loadingEliminacion = true;

    this.directorService.eliminarAsignatura(this.asignaturaEliminando.idAsignatura).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Eliminar de la lista local
          this.asignaturas = this.asignaturas.filter(a => a.idAsignatura !== this.asignaturaEliminando.idAsignatura);
          this.cerrarModalEliminar();
          this.cargarAsignaturas(); // Recargar lista
        } else {
          this.error = response.message || 'Error al eliminar la asignatura';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar la asignatura';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  editarAsignatura(id: number): void {
    this.router.navigate(['/director/editar-asignatura', id]);
  }

  // Cerrar modales
  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.asignaturaSeleccionada = null;
    this.error = '';
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.asignaturaEliminando = null;
    this.error = '';
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }
}