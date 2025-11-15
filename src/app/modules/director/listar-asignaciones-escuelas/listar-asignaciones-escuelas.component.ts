// listar-asignaciones-escuela.component.ts
import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-asignaciones-escuela',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './listar-asignaciones-escuelas.component.html'
})
export class ListarAsignacionesEscuelaComponent implements OnInit {
  ciclosAcademicos: any[] = [];
  escuelas: any[] = [];
  cargasAcademicas: any[] = [];
  idCicloAcademicoSeleccionado: number = 0;
  idEscuelaSeleccionada: number = 0;
  idCargaSeleccionada: number = 0;
  asignaciones: any[] = [];
  loading = false;
  loadingCiclos = false;
  loadingEscuelas = false;
  loadingCargas = false;
  message = '';
  isError = false;
  mostrarModalDetalle = false;
  asignacionSeleccionada: any = null;
  loadingDetalle = false;
  errorDetalle = '';

  constructor(private directorService: DirectorService) {}

  ngOnInit(): void {
    this.cargarCiclosAcademicos();
    this.cargarEscuelas();
  }

  cargarCiclosAcademicos(): void {
    this.loadingCiclos = true;
    this.directorService.obtenerCiclosAcademicos().subscribe({
      next: (response: any) => {
        const ciclos = response.data || response || [];
        this.ciclosAcademicos = ciclos;
        
        // Seleccionar ciclo activo por defecto, o el primero
        const cicloActivo = ciclos.find((ciclo: any) => ciclo.enabled);
        if (cicloActivo) {
          this.idCicloAcademicoSeleccionado = cicloActivo.idCicloAcademico;
          this.cargarCargasAcademicas();
        } else if (ciclos.length > 0) {
          this.idCicloAcademicoSeleccionado = ciclos[0].idCicloAcademico;
          this.cargarCargasAcademicas();
        }
        
        this.loadingCiclos = false;
      },
      error: (err) => {
        console.error('Error cargando ciclos académicos:', err);
        this.showMessage('Error al cargar ciclos académicos', true);
        this.loadingCiclos = false;
      }
    });
  }

  cargarEscuelas(): void {
    this.loadingEscuelas = true;
    this.directorService.obtenerEscuelas().subscribe({
      next: (response) => {
        this.escuelas = response.data || response || [];
        if (this.escuelas.length > 0) {
          this.idEscuelaSeleccionada = this.escuelas[0].idEscuela;
        }
        this.loadingEscuelas = false;
      },
      error: (err) => {
        console.error('Error cargando escuelas:', err);
        this.showMessage('Error al cargar escuelas', true);
        this.loadingEscuelas = false;
      }
    });
  }

  cargarCargasAcademicas(): void {
    if (!this.idCicloAcademicoSeleccionado) {
      this.cargasAcademicas = [];
      return;
    }

    this.loadingCargas = true;
    this.cargasAcademicas = [];
    this.idCargaSeleccionada = 0;

    this.directorService.obtenerCargasAcademicasPorCiclo(this.idCicloAcademicoSeleccionado).subscribe({
      next: (response: any) => {
        this.cargasAcademicas = response.data || response || [];
        if (this.cargasAcademicas.length > 0) {
          this.idCargaSeleccionada = this.cargasAcademicas[0].idCarga;
        }
        this.loadingCargas = false;
      },
      error: (err) => {
        console.error('Error cargando cargas académicas:', err);
        this.showMessage('Error al cargar cargas académicas', true);
        this.loadingCargas = false;
      }
    });
  }

  onCicloChange(): void {
    this.cargarCargasAcademicas();
  }
// Agrega este método antes de calcularTotalHoras
getHorarios(asignacion: any): any[] {
  return asignacion.curso?.horarios || asignacion.curso?.cursoHorario || [];
}
  buscarAsignaciones(): void {
    if (!this.idCicloAcademicoSeleccionado || !this.idCargaSeleccionada || !this.idEscuelaSeleccionada) {
      this.showMessage('Por favor seleccione un ciclo académico, una carga académica y una escuela', true);
      return;
    }

    this.loading = true;
    this.asignaciones = [];

    this.directorService.obtenerAsignacionesPorCargaYEscuela(
      this.idCargaSeleccionada, 
      this.idEscuelaSeleccionada
    ).subscribe({
      next: (response: any) => {
        this.asignaciones = response.data || [];
        this.loading = false;
        
        if (this.asignaciones.length === 0) {
          this.showMessage('No se encontraron asignaciones para los criterios seleccionados', false);
        } else {
          this.showMessage(`Se encontraron ${this.asignaciones.length} asignaciones`, false);
        }
      },
      error: (err) => {
        this.showMessage('Error al cargar las asignaciones', true);
        this.loading = false;
        console.error(err);
      }
    });
  }

  verDetalles(asignacion: any): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.errorDetalle = '';

    this.directorService.obtenerAsignacionPorId(asignacion.idAsignacion).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.asignacionSeleccionada = response.data;
        } else {
          this.errorDetalle = response.message || 'Asignación no encontrada';
          this.asignacionSeleccionada = null;
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        this.errorDetalle = 'Error al cargar los detalles de la asignación';
        this.asignacionSeleccionada = null;
        this.loadingDetalle = false;
        console.error(err);
      }
    });
  }

  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.asignacionSeleccionada = null;
    this.errorDetalle = '';
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }

  getCicloSeleccionado(): string {
    const ciclo = this.ciclosAcademicos.find(c => c.idCicloAcademico === this.idCicloAcademicoSeleccionado);
    return ciclo ? ciclo.nombre : '';
  }

  getCargaSeleccionada(): string {
    const carga = this.cargasAcademicas.find(c => c.idCarga === this.idCargaSeleccionada);
    return carga ? carga.nombre : '';
  }

  getEscuelaSeleccionada(): string {
    const escuela = this.escuelas.find(e => e.idEscuela === this.idEscuelaSeleccionada);
    return escuela ? escuela.nombre : '';
  }

calcularTotalHoras(asignacion: any): number {
  const horarios = this.getHorarios(asignacion);
  return horarios.reduce((total: number, horario: any) => total + horario.duracionHoras, 0);
}
  calcularTotalGeneral(): number {
    return this.asignaciones.reduce((total, asignacion) => total + this.calcularTotalHoras(asignacion), 0);
  }

  getDocenteInfo(asignacion: any): string {
    if (!asignacion.docente) return 'N/A';
    return `${asignacion.docente.usuario?.nombre} ${asignacion.docente.usuario?.apellido}`;
  }

  getCursoInfo(asignacion: any): string {
    if (!asignacion.curso) return 'N/A';
    return `${asignacion.curso.asignatura?.nombre} - ${asignacion.curso.grupo || 'Sin grupo'}`;
  }

formatearHorarios(horarios: any[]): string {
  if (!horarios || horarios.length === 0) return 'Sin horarios';
  
  return horarios.map(horario => 
    `${horario.diaSemana} ${horario.horaInicio}-${horario.horaFin} (${horario.tipoSesion})`
  ).join(', ');
}

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}