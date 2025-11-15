// listar-ciclos-academicos.component.ts
import { Component } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-ciclos-academicos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-ciclos-academicos.component.html'
})
export class ListarCiclosAcademicosComponent {
  ciclos: any[] = [];
  cicloSeleccionado: any = null;
  cicloEliminando: any = null;
  
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
    this.cargarCiclos();
  }

  cargarCiclos(): void {
    this.loading = true;
    this.directorService.obtenerCiclosAcademicos().subscribe({
      next: (response: any) => {
        this.ciclos = response.data || response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar ciclos académicos';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // Ver detalles del ciclo
  verDetalles(ciclo: any): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.error = '';

    this.directorService.obtenerCicloAcademicoPorId(ciclo.idCicloAcademico).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.cicloSeleccionado = response.data;
        } else {
          this.error = response.message || 'Ciclo académico no encontrado';
          this.cicloSeleccionado = null;
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles del ciclo académico';
        this.cicloSeleccionado = null;
        this.loadingDetalle = false;
        console.error(err);
      }
    });
  }

  // Abrir modal para eliminar
  abrirEliminar(ciclo: any): void {
    this.cicloEliminando = { ...ciclo };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  // Confirmar eliminación
  confirmarEliminacion(): void {
    this.loadingEliminacion = true;

    this.directorService.eliminarCicloAcademico(this.cicloEliminando.idCicloAcademico).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Eliminar de la lista local
          this.ciclos = this.ciclos.filter(c => c.idCicloAcademico !== this.cicloEliminando.idCicloAcademico);
          this.cerrarModalEliminar();
          this.cargarCiclos(); // Recargar lista
        } else {
          this.error = response.message || 'Error al eliminar el ciclo académico';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar el ciclo académico';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  editarCiclo(id: number): void {
    this.router.navigate(['/Departamento Academico/editar-ciclo-academico', id]);
  }

  // Cerrar modales
  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.cicloSeleccionado = null;
    this.error = '';
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.cicloEliminando = null;
    this.error = '';
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }

  // Añade este método para formatear fechas
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  // Método para obtener el nombre del periodo
  getPeriodoNombre(periodo: number): string {
    return periodo === 1 ? 'I' : 'II';
  }

  // Método para obtener el estado del ciclo
  getEstadoBadgeClass(enabled: boolean): string {
    return enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getEstadoText(enabled: boolean): string {
    return enabled ? 'Activo' : 'Inactivo';
  }
}