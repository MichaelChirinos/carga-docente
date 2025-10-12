// listar-directores.component.ts
import { Component } from '@angular/core';
import { DirectorService } from '../services/director.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-directores',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-directores.component.html'
})
export class ListarDirectoresComponent {
  directores: any[] = [];
  directorSeleccionado: any = null;
  directorEliminando: any = null;
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
    this.cargarDirectores();
  }

  cargarDirectores(): void {
    this.directorService.listarDirectores().subscribe({
      next: (res: any) => {
        this.directores = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar directores';
        this.loading = false;
        console.error('Error al cargar directores', err);
      }
    });
  }

  // Ver detalles del director
  verDetalles(director: any): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.error = '';

    this.directorService.obtenerDirectorPorId(director.idDirector).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.directorSeleccionado = response.data;
        } else {
          this.error = response.message || 'Director no encontrado';
          this.directorSeleccionado = null;
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles del director';
        this.directorSeleccionado = null;
        this.loadingDetalle = false;
        console.error(err);
      }
    });
  }

  // Abrir modal para eliminar
  abrirEliminar(director: any): void {
    this.directorEliminando = { ...director };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  // Confirmar eliminación
  confirmarEliminacion(): void {
    this.loadingEliminacion = true;

    this.directorService.eliminarDirector(this.directorEliminando.idDirector).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Eliminar de la lista local
          this.directores = this.directores.filter(d => d.idDirector !== this.directorEliminando.idDirector);
          this.cerrarModalEliminar();
          this.cargarDirectores(); // Recargar lista
        } else {
          this.error = response.message || 'Error al eliminar el director';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar el director';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  editarDirector(id: number): void {
    this.router.navigate(['/admin/editar-director', id]);
  }

  // Cerrar modales
  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.directorSeleccionado = null;
    this.error = '';
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.directorEliminando = null;
    this.error = '';
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }

  // Método para obtener iniciales
  getIniciales(nombre: string, apellido: string): string {
    return (nombre?.charAt(0) || '') + (apellido?.charAt(0) || '');
  }
}