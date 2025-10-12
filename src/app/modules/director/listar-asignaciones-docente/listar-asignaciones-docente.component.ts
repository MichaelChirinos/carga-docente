// listar-asignaciones.component.ts
import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-asignaciones',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-asignaciones-docente.component.html'
})
export class ListarAsignacionesComponent implements OnInit {
  // Listas para los filtros
  docentes: any[] = [];
  cargasAcademicas: any[] = [];
  
  // Filtros seleccionados
  idDocenteSeleccionado: number = 0;
  idCargaSeleccionada: number = 0;
  
  // Datos de asignaciones
  asignaciones: any[] = [];
  asignacionSeleccionada: any = null;
  
  // Estados
  loading = false;
  loadingData = false;
  loadingDetalle = false;
  loadingEliminacion = false;
  
  // Mensajes y modales
  error = '';
  message = '';
  isError = false;
  mostrarModalDetalle = false;
  mostrarModalEliminar = false;
  asignacionEliminando: any = null;

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatosFiltros();
  }

  cargarDatosFiltros(): void {
    this.loadingData = true;

    // Cargar docentes
    this.directorService.obtenerDocentes().subscribe({
      next: (response) => {
        this.docentes = response.data || response || [];
      },
      error: (err) => console.error('Error cargando docentes:', err)
    });

    // Cargar cargas académicas
    this.directorService.obtenerCargasAcademicas().subscribe({
      next: (response) => {
        this.cargasAcademicas = response.data || response || [];
        this.loadingData = false;
      },
      error: (err) => {
        console.error('Error cargando cargas académicas:', err);
        this.loadingData = false;
      }
    });
  }

  buscarAsignaciones(): void {
    // Validar que ambos filtros estén seleccionados
    if (!this.idDocenteSeleccionado || !this.idCargaSeleccionada) {
      this.showMessage('Por favor seleccione un docente y una carga académica', true);
      return;
    }

    this.loading = true;
    this.asignaciones = [];

    this.directorService.obtenerAsignacionesPorDocenteYCarga(
      this.idDocenteSeleccionado, 
      this.idCargaSeleccionada
    ).subscribe({
      next: (response: any) => {
        this.asignaciones = response.data || [];
        this.loading = false;
        
        if (this.asignaciones.length === 0) {
          this.showMessage('No se encontraron asignaciones para los criterios seleccionados', false);
        }
      },
      error: (err) => {
        this.error = 'Error al cargar asignaciones';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // Ver detalles de la asignación
  verDetalles(asignacion: any): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.error = '';

    this.directorService.obtenerAsignacionPorId(asignacion.idAsignacion).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.asignacionSeleccionada = response.data;
        } else {
          this.error = response.message || 'Asignación no encontrada';
          this.asignacionSeleccionada = null;
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles de la asignación';
        this.asignacionSeleccionada = null;
        this.loadingDetalle = false;
        console.error(err);
      }
    });
  }

  // Abrir modal para eliminar
  abrirEliminar(asignacion: any): void {
    this.asignacionEliminando = { ...asignacion };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  // Confirmar eliminación
  confirmarEliminacion(): void {
    this.loadingEliminacion = true;

    this.directorService.eliminarAsignacion(this.asignacionEliminando.idAsignacion).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showMessage('Asignación eliminada exitosamente', false);
          // Eliminar de la lista local
          this.asignaciones = this.asignaciones.filter(a => a.idAsignacion !== this.asignacionEliminando.idAsignacion);
          this.cerrarModalEliminar();
        } else {
          this.error = response.message || 'Error al eliminar la asignación';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar la asignación';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  editarAsignacion(id: number): void {
    this.router.navigate(['/director/editar-asignacion', id]);
  }

  // Cerrar modales
  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.asignacionSeleccionada = null;
    this.error = '';
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.asignacionEliminando = null;
    this.error = '';
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }

  // Métodos auxiliares
  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }

  getDocenteSeleccionado(): string {
    const docente = this.docentes.find(d => d.idDocente === this.idDocenteSeleccionado);
    return docente ? `${docente.usuario?.nombre} ${docente.usuario?.apellido}` : '';
  }

  getCargaSeleccionada(): string {
    const carga = this.cargasAcademicas.find(c => c.idCarga === this.idCargaSeleccionada);
    return carga ? carga.nombre : '';
  }

  // Calcular total de horas por asignación
  calcularTotalHoras(asignacion: any): number {
    if (!asignacion.curso?.cursoHorario) return 0;
    return asignacion.curso.cursoHorario.reduce((total: number, horario: any) => total + horario.duracionHoras, 0);
  }

  // Calcular total general de horas
  calcularTotalGeneral(): number {
    return this.asignaciones.reduce((total, asignacion) => total + this.calcularTotalHoras(asignacion), 0);
  }

  // Formatear horarios para display
  formatearHorarios(horarios: any[]): string {
    if (!horarios || horarios.length === 0) return 'Sin horarios';
    
    return horarios.map(horario => 
      `${horario.diaSemana} ${horario.horaInicio}-${horario.horaFin} (${horario.tipoSesion})`
    ).join(', ');
  }

  // Métodos adicionales que pueden estar siendo usados en el template
  getCursoInfo(asignacion: any): string {
    if (!asignacion.curso) return 'N/A';
    return `${asignacion.curso.asignatura?.nombre} - ${asignacion.curso.grupo || 'Sin grupo'}`;
  }

  getDocenteInfo(asignacion: any): string {
    if (!asignacion.docente) return 'N/A';
    return `${asignacion.docente.usuario?.nombre} ${asignacion.docente.usuario?.apellido}`;
  }

  getCicloInfo(asignacion: any): string {
    if (!asignacion.cicloAcademico) return 'N/A';
    return asignacion.cicloAcademico.nombre;
  }

  // Para formatear fechas si es necesario
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    } catch {
      return dateString;
    }
  }
}