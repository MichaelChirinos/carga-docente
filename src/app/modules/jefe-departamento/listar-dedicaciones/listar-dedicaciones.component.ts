import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { Dedicacion } from '../../../core/models/docente.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-dedicaciones',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-dedicaciones.component.html'
})
export class ListarDedicacionesComponent implements OnInit {
  dedicaciones: Dedicacion[] = [];
  loading = true;
  error = '';

  // Estados para modales
  dedicacionSeleccionada: Dedicacion | null = null;
  dedicacionEliminando: Dedicacion | null = null;
  
  // Estados de carga específicos
  loadingDetalle = false;
  loadingEliminacion = false;
  
  // Estados de modales
  mostrarModalDetalle = false;
  mostrarModalEliminar = false;

  constructor(
    private docenteService: DocenteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDedicaciones();
  }

  cargarDedicaciones(): void {
    this.loading = true;
    this.error = '';

    this.docenteService.getDedicaciones().subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.status === 200) {
          this.dedicaciones = response.data;
        } else {
          this.error = response.message || 'Error al cargar las dedicaciones';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error de conexión: ' + (err.error?.message || '');
        console.error(err);
      }
    });
  }

  // VER DETALLES
  verDetalles(dedicacion: Dedicacion): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.error = '';

    this.docenteService.getDedicacionById(dedicacion.idDedicacion).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.dedicacionSeleccionada = response.data;
        } else {
          this.error = response.message || 'Dedicación no encontrada';
          this.dedicacionSeleccionada = null;
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles de la dedicación';
        this.dedicacionSeleccionada = null;
        this.loadingDetalle = false;
        console.error(err);
      }
    });
  }

  // ELIMINAR DEDICACIÓN
  abrirEliminar(dedicacion: Dedicacion): void {
    this.dedicacionEliminando = { ...dedicacion };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  confirmarEliminacion(): void {
    if (!this.dedicacionEliminando) return;

    this.loadingEliminacion = true;

    this.docenteService.eliminarDedicacion(this.dedicacionEliminando.idDedicacion).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Eliminar de la lista local
          this.dedicaciones = this.dedicaciones.filter(d => d.idDedicacion !== this.dedicacionEliminando!.idDedicacion);
          this.cerrarModalEliminar();
          this.cargarDedicaciones(); // Recargar lista
        } else {
          this.error = response.message || 'Error al eliminar la dedicación';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar la dedicación';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  // CERRAR MODALES
  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.dedicacionSeleccionada = null;
    this.error = '';
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.dedicacionEliminando = null;
    this.loadingEliminacion = false;
    this.error = '';
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }

  editarDedicacion(id: number): void {
    this.router.navigate(['/jefe-departamento/editar-dedicacion', id]);
  }

  // Helper function para la tabla
  getEstadoBadgeClass(enabled: boolean): string {
    return enabled 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }
}