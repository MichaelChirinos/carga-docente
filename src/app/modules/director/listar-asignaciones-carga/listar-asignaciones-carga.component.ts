// listar-asignaciones-carga.component.ts - VERSIÓN CORREGIDA
import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-asignaciones-carga',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './listar-asignaciones-carga.component.html'
})
export class ListarAsignacionesCargaComponent implements OnInit {
  ciclosAcademicos: any[] = [];
  cargasAcademicas: any[] = [];
  idCicloAcademicoSeleccionado: number = 0;
  idCargaSeleccionada: number = 0;
  asignaciones: any[] = [];
  loading = false;
  loadingCiclos = false;
  loadingCargas = false;
  message = '';
  isError = false;
  mostrarModalDetalle = false;
  asignacionSeleccionada: any = null;
  loadingDetalle = false;
  errorDetalle = '';

  // Cache para horarios
  horariosCache: Map<number, any[]> = new Map();

  constructor(private directorService: DirectorService) {}

  ngOnInit(): void {
    this.cargarCiclosAcademicos();
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

  getHorarios(asignacion: any): any[] {
    const idAsignacion = asignacion.idAsignacion;
    
    // 1. Verificar si tenemos cache
    if (this.horariosCache.has(idAsignacion)) {
      return this.horariosCache.get(idAsignacion) || [];
    }
    
    // 2. Buscar en las estructuras comunes
    const horarios = asignacion?.curso?.horarios || 
                     asignacion?.curso?.cursoHorario || 
                     asignacion?.horarios || 
                     [];
    
    // 3. Si hay horarios en la estructura, guardarlos en cache
    if (horarios.length > 0) {
      this.horariosCache.set(idAsignacion, horarios);
    }
    
    return horarios;
  }

  cargarCargasAcademicas(): void {
    if (!this.idCicloAcademicoSeleccionado) {
      this.cargasAcademicas = [];
      return;
    }

    this.loadingCargas = true;
    this.cargasAcademicas = [];
    this.idCargaSeleccionada = 0;
    this.horariosCache.clear(); // Limpiar cache

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
    // Limpiar resultados cuando cambia el ciclo
    this.asignaciones = [];
    this.horariosCache.clear();
  }

  buscarAsignaciones(): void {
    if (!this.idCicloAcademicoSeleccionado || !this.idCargaSeleccionada) {
      this.showMessage('Por favor seleccione un ciclo académico y una carga académica', true);
      return;
    }

    this.loading = true;
    this.asignaciones = [];
    this.horariosCache.clear(); // Limpiar cache

    this.directorService.obtenerAsignacionesPorCargaAcademica(this.idCargaSeleccionada).subscribe({
      next: (response: any) => {
        this.asignaciones = response.data || [];
        
        // Cargar horarios en background para todas las asignaciones
        this.cargarHorariosEnBackground();
        
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

  // Cargar horarios en background para todas las asignaciones
  cargarHorariosEnBackground(): void {
    this.asignaciones.forEach(asignacion => {
      if (asignacion.idAsignacion && !this.getHorarios(asignacion).length) {
        this.cargarHorariosIndividualEnBackground(asignacion.idAsignacion);
      }
    });
  }

  // Cargar horarios para una asignación específica
  cargarHorariosIndividualEnBackground(idAsignacion: number): void {
    this.directorService.obtenerAsignacionPorId(idAsignacion).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          const asignacionDetalle = response.data;
          
          // Extraer horarios del detalle
          const horariosDetalle = asignacionDetalle?.curso?.horarios || 
                                 asignacionDetalle?.curso?.cursoHorario || 
                                 asignacionDetalle?.horarios || 
                                 [];
          
          if (horariosDetalle.length > 0) {
            // Guardar en cache
            this.horariosCache.set(idAsignacion, horariosDetalle);
            
            // Actualizar la asignación en la lista
            const index = this.asignaciones.findIndex(a => a.idAsignacion === idAsignacion);
            if (index !== -1) {
              if (!this.asignaciones[index].curso) {
                this.asignaciones[index].curso = {};
              }
              this.asignaciones[index].curso.horarios = horariosDetalle;
              
              // Forzar detección de cambios
              this.asignaciones = [...this.asignaciones];
            }
          }
        }
      },
      error: (err) => {
        console.error('Error cargando horarios en background:', err);
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
          
          // Extraer horarios del detalle y guardar en cache
          const horariosDetalle = this.asignacionSeleccionada?.curso?.horarios || 
                                 this.asignacionSeleccionada?.curso?.cursoHorario || 
                                 this.asignacionSeleccionada?.horarios || 
                                 [];
          
          if (horariosDetalle.length > 0) {
            this.horariosCache.set(asignacion.idAsignacion, horariosDetalle);
            
            // Actualizar la asignación en la lista
            const index = this.asignaciones.findIndex(a => a.idAsignacion === asignacion.idAsignacion);
            if (index !== -1) {
              if (!this.asignaciones[index].curso) {
                this.asignaciones[index].curso = {};
              }
              this.asignaciones[index].curso.horarios = horariosDetalle;
              
              // Forzar detección de cambios
              this.asignaciones = [...this.asignaciones];
            }
          }
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

  calcularTotalHoras(asignacion: any): number {
    const horarios = this.getHorarios(asignacion);
    if (!horarios || horarios.length === 0) return 0;
    
    let total = 0;
    horarios.forEach((horario: any) => {
      // Intentar diferentes nombres de propiedad
      const duracion = horario.duracionHoras || 
                       horario.duracion_horas || 
                       horario.duracion || 
                       horario.duracionTotal ||
                       0;
      
      if (typeof duracion === 'number') {
        total += duracion;
      } else if (typeof duracion === 'string') {
        const num = parseFloat(duracion);
        if (!isNaN(num)) total += num;
      }
    });
    
    return total;
  }

  calcularTotalGeneral(): number {
    return this.asignaciones.reduce((total, asignacion) => total + this.calcularTotalHoras(asignacion), 0);
  }

  getDocenteInfo(asignacion: any): string {
    if (!asignacion.docente) return 'N/A';
    return `${asignacion.docente.usuario?.nombre || ''} ${asignacion.docente.usuario?.apellido || ''}`.trim() || 'N/A';
  }

  getCursoInfo(asignacion: any): string {
    if (!asignacion.curso) return 'N/A';
    return `${asignacion.curso.asignatura?.nombre || 'Sin asignatura'} - ${asignacion.curso.grupo || 'Sin grupo'}`;
  }

  formatearHorarios(horarios: any[]): string {
    if (!horarios || horarios.length === 0) return 'Sin horarios';
    
    const horariosFormateados = horarios.map(horario => {
      // Extraer información con diferentes nombres de propiedad
      const dia = horario.diaSemana || horario.dia || '';
      const horaInicio = horario.horaInicio || horario.hora_inicio || horario.inicio || '';
      const horaFin = horario.horaFin || horario.hora_fin || horario.fin || '';
      const tipo = horario.tipoSesion || horario.tipo_sesion || horario.tipo || '';
      
      // Formatear según la información disponible
      if (dia && horaInicio && horaFin) {
        return `${dia} ${horaInicio}-${horaFin}${tipo ? ` (${tipo})` : ''}`;
      } else if (dia && tipo) {
        return `${dia} (${tipo})`;
      } else if (dia) {
        return dia;
      } else {
        return 'Horario';
      }
    });
    
    return horariosFormateados.join(', ');
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}