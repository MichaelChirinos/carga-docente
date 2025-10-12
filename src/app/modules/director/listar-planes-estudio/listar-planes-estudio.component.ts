// listar-planes-estudio.component.ts
import { Component } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-planes-estudio',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-planes-estudio.component.html'
})
export class ListarPlanesEstudioComponent {
  planes: any[] = [];
  planSeleccionado: any = null;
  planEditando: any = null;
  planEliminando: any = null;
  
  loading = true;
  loadingDetalle = false;
  loadingEdicion = false;
  loadingEliminacion = false;
  
  error = '';
  mostrarModalDetalle = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPlanes();
  }

  cargarPlanes(): void {
    this.loading = true;
    this.directorService.obtenerPlanesEstudio().subscribe({
      next: (response: any) => {
        this.planes = response.data || response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar planes de estudio';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // Ver detalles del plan
  verDetalles(plan: any): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.error = '';

    this.directorService.obtenerPlanEstudioPorId(plan.idPlanDeEstudio).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.planSeleccionado = response.data;
        } else {
          this.error = response.message || 'Plan de estudio no encontrado';
          this.planSeleccionado = null;
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles del plan de estudio';
        this.planSeleccionado = null;
        this.loadingDetalle = false;
        console.error(err);
      }
    });
  }

  // Abrir modal para editar
  abrirEditar(plan: any): void {
    this.planEditando = { ...plan };
    this.mostrarModalEditar = true;
    this.error = '';
  }

  // Guardar cambios de edición
  guardarEdicion(): void {
    if (!this.planEditando?.nombre?.trim()) {
      this.error = 'El nombre del plan de estudio es obligatorio';
      return;
    }

    this.loadingEdicion = true;
    this.error = '';

    const datosActualizacion = {
      nombre: this.planEditando.nombre.trim()
    };

    this.directorService.actualizarPlanEstudio(this.planEditando.idPlanDeEstudio, datosActualizacion).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Actualizar la lista local
          const index = this.planes.findIndex(p => p.idPlanDeEstudio === this.planEditando.idPlanDeEstudio);
          if (index !== -1) {
            this.planes[index] = { ...this.planes[index], ...response.data };
          }
          this.cerrarModalEditar();
          this.cargarPlanes(); // Recargar para asegurar datos actualizados
        } else {
          this.error = response.message || 'Error al actualizar el plan de estudio';
        }
        this.loadingEdicion = false;
      },
      error: (err) => {
        this.error = 'Error al actualizar el plan de estudio';
        this.loadingEdicion = false;
        console.error(err);
      }
    });
  }

  // Abrir modal para eliminar
  abrirEliminar(plan: any): void {
    this.planEliminando = { ...plan };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  // Confirmar eliminación
  confirmarEliminacion(): void {
    this.loadingEliminacion = true;

    this.directorService.eliminarPlanEstudio(this.planEliminando.idPlanDeEstudio).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Eliminar de la lista local
          this.planes = this.planes.filter(p => p.idPlanDeEstudio !== this.planEliminando.idPlanDeEstudio);
          this.cerrarModalEliminar();
          this.cargarPlanes(); // Recargar lista
        } else {
          this.error = response.message || 'Error al eliminar el plan de estudio';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar el plan de estudio';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  // Cerrar modales
  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.planSeleccionado = null;
    this.error = '';
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.planEditando = null;
    this.loadingEdicion = false;
    this.error = '';
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.planEliminando = null;
    this.loadingEliminacion = false;
    this.error = '';
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }
}