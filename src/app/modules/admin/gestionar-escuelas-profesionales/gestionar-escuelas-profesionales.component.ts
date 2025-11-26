import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DirectorService } from '../services/director.service';

@Component({
  selector: 'app-gestionar-escuelas-profesionales',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gestionar-escuelas-profesionales.component.html'
})
export class GestionarEscuelasProfesionalesComponent implements OnInit {
  escuelasProfesionales: any[] = [];
  escuelaSeleccionada: any = null;
  escuelaEliminando: any = null;
  
  loading = true;
  loadingDetalle = false;
  loadingEliminacion = false;
  
  error = '';
  mostrarModalDetalle = false;
  mostrarModalEliminar = false;

  constructor(
    private DirectorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEscuelasProfesionales();
  }

  cargarEscuelasProfesionales(): void {
    this.loading = true;
    this.DirectorService.obtenerEscuelasProfesionales().subscribe({
      next: (response: any) => {
        this.escuelasProfesionales = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar escuelas profesionales';
        this.loading = false;
        console.error(err);
      }
    });
  }

  verDetalles(escuela: any): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.error = '';

    this.DirectorService.obtenerEscuelaProfesionalPorId(escuela.idEscuelaProfesional).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.escuelaSeleccionada = response.data;
        } else {
          this.error = response.message || 'Escuela profesional no encontrada';
          this.escuelaSeleccionada = null;
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles';
        this.escuelaSeleccionada = null;
        this.loadingDetalle = false;
        console.error(err);
      }
    });
  }

  abrirEliminar(escuela: any): void {
    this.escuelaEliminando = { ...escuela };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  confirmarEliminacion(): void {
    this.loadingEliminacion = true;

    this.DirectorService.eliminarEscuelaProfesional(this.escuelaEliminando.idEscuelaProfesional).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.escuelasProfesionales = this.escuelasProfesionales.filter(
            e => e.idEscuelaProfesional !== this.escuelaEliminando.idEscuelaProfesional
          );
          this.cerrarModalEliminar();
          this.cargarEscuelasProfesionales();
        } else {
          this.error = response.message || 'Error al eliminar la escuela profesional';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar la escuela profesional';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  editarEscuela(id: number): void {
    this.router.navigate(['/Administrador/editar-escuela-profesional', id]);
  }

  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.escuelaSeleccionada = null;
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

  getEstadoBadgeClass(enabled: boolean): string {
    return enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getEstadoText(enabled: boolean): string {
    return enabled ? 'Activo' : 'Inactivo';
  }
}