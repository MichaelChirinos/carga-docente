import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DirectorService } from '../services/director.service';

@Component({
  selector: 'app-gestionar-departamentos-academicos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gestionar-departamentos-academicos.component.html'
})
export class GestionarDepartamentosAcademicosComponent implements OnInit {
  departamentosAcademicos: any[] = [];
  departamentoSeleccionado: any = null;
  departamentoEliminando: any = null;
  
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
    this.cargarDepartamentosAcademicos();
  }

  cargarDepartamentosAcademicos(): void {
    this.loading = true;
    this.directorService.obtenerDepartamentosAcademicos().subscribe({
      next: (response: any) => {
        this.departamentosAcademicos = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar departamentos académicos';
        this.loading = false;
        console.error(err);
      }
    });
  }

  verDetalles(departamento: any): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.error = '';

    this.directorService.obtenerDepartamentoAcademicoPorId(departamento.idDepartamentoAcademico).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.departamentoSeleccionado = response.data;
        } else {
          this.error = response.message || 'Departamento académico no encontrado';
          this.departamentoSeleccionado = null;
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles';
        this.departamentoSeleccionado = null;
        this.loadingDetalle = false;
        console.error(err);
      }
    });
  }

  abrirEliminar(departamento: any): void {
    this.departamentoEliminando = { ...departamento };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  confirmarEliminacion(): void {
    this.loadingEliminacion = true;

    this.directorService.eliminarDepartamentoAcademico(this.departamentoEliminando.idDepartamentoAcademico).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.departamentosAcademicos = this.departamentosAcademicos.filter(
            d => d.idDepartamentoAcademico !== this.departamentoEliminando.idDepartamentoAcademico
          );
          this.cerrarModalEliminar();
          this.cargarDepartamentosAcademicos();
        } else {
          this.error = response.message || 'Error al eliminar el departamento académico';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar el departamento académico';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  editarDepartamento(id: number): void {
    this.router.navigate(['/Administrador/editar-director', id]);
  }

  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.departamentoSeleccionado = null;
    this.error = '';
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.departamentoEliminando = null;
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