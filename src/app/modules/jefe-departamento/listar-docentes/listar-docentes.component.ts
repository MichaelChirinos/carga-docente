import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { Docente } from '../../../core/models/docente.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-docentes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-docentes.component.html'
})
export class ListarDocentesComponent implements OnInit {
  docentes: Docente[] = [];
  docentesFiltrados: Docente[] = [];
  loading = true;
  error = '';
  searchTerm = '';

  // Estados para modales
  docenteSeleccionado: Docente | null = null;
  docenteEliminando: Docente | null = null;
  
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
    this.cargarDocentes();
  }

  cargarDocentes(): void {
    this.loading = true;
    this.error = '';

    this.docenteService.getDocentes().subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.status === 200 && Array.isArray(response.data)) {
          this.docentes = response.data;
          this.docentesFiltrados = [...this.docentes];
        } else {
          this.error = response.message || 'Error al cargar los docentes';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error de conexión: ' + (err.error?.message || '');
        console.error(err);
      }
    });
  }

  // FILTRAR DOCENTES
  filtrarDocentes(): void {
    if (!this.searchTerm.trim()) {
      this.docentesFiltrados = [...this.docentes];
      return;
    }

    const termino = this.searchTerm.toLowerCase().trim();
    this.docentesFiltrados = this.docentes.filter(docente => 
      docente.usuario.nombre.toLowerCase().includes(termino) ||
      docente.usuario.apellido.toLowerCase().includes(termino) ||
      docente.usuario.email.toLowerCase().includes(termino) ||
      docente.usuario.codigo.toLowerCase().includes(termino) ||
      docente.dedicacion.nombre.toLowerCase().includes(termino) ||
      docente.categoria.nombre.toLowerCase().includes(termino)
    );
  }

  // VER DETALLES
  verDetalles(docente: Docente): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.error = '';

    this.docenteService.getDocenteById(docente.idDocente).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.docenteSeleccionado = response.data;
        } else {
          this.error = response.message || 'Docente no encontrado';
          this.docenteSeleccionado = null;
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles del docente';
        this.docenteSeleccionado = null;
        this.loadingDetalle = false;
        console.error(err);
      }
    });
  }

  // ELIMINAR DOCENTE
  abrirEliminar(docente: Docente): void {
    this.docenteEliminando = { ...docente };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  confirmarEliminacion(): void {
    if (!this.docenteEliminando) return;

    this.loadingEliminacion = true;

    this.docenteService.eliminarDocente(this.docenteEliminando.idDocente).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Eliminar de la lista local
          this.docentes = this.docentes.filter(d => d.idDocente !== this.docenteEliminando!.idDocente);
          this.docentesFiltrados = this.docentesFiltrados.filter(d => d.idDocente !== this.docenteEliminando!.idDocente);
          this.cerrarModalEliminar();
          this.cargarDocentes(); // Recargar lista
        } else {
          this.error = response.message || 'Error al eliminar el docente';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar el docente';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  // CERRAR MODALES
  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.docenteSeleccionado = null;
    this.error = '';
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.docenteEliminando = null;
    this.loadingEliminacion = false;
    this.error = '';
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }

  editarDocente(id: number): void {
    this.router.navigate(['/jefe-departamento/editar-docente', id]);
  }

  // Helper functions
  getEstadoBadgeClass(enabled: boolean): string {
    return enabled 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }

  getNombreCompleto(docente: Docente): string {
    return `${docente.usuario.nombre} ${docente.usuario.apellido}`;
  }
}