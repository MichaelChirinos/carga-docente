// listar-asignaciones.component.ts - VERSIÓN CORREGIDA CON CACHE DE HORARIOS
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
  ciclosAcademicos: any[] = [];
  cargasAcademicas: any[] = [];
  
  // Filtros seleccionados
  idCicloAcademicoSeleccionado: number = 0;
  idDocenteSeleccionado: number = 0;
  idCargaSeleccionada: number = 0;
  
  // Datos de asignaciones
  asignacionesPorDocente: any[] = []; // Para vista "todas"
  asignaciones: any[] = []; // Para asignaciones filtradas
  asignacionSeleccionada: any = null;
  
  // Estados
  loading = false;
  loadingData = false;
  loadingCiclos = false;
  loadingCargas = false;
  loadingDetalle = false;
  loadingEliminacion = false;
  loadingTodas = false;
  
  // Mensajes y modales
  error = '';
  message = '';
  isError = false;
  mostrarModalDetalle = false;
  mostrarModalEliminar = false;
  asignacionEliminando: any = null;

  // Modo de vista
  modoVista: 'filtrado' | 'todas' = 'todas';

  // Cache para horarios
  horariosCache: Map<number, any[]> = new Map();

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
        this.loadingData = false;
      },
      error: (err) => {
        console.error('Error cargando docentes:', err);
        this.showMessage('Error al cargar la lista de docentes', true);
        this.docentes = [];
        this.loadingData = false;
      }
    });

    // Cargar ciclos académicos
    this.directorService.obtenerCiclosAcademicos().subscribe({
      next: (response: any) => {
        const ciclos = response.data || response || [];
        this.ciclosAcademicos = ciclos;
        
        // Seleccionar ciclo activo por defecto si existe
        const cicloActivo = ciclos.find((ciclo: any) => ciclo.enabled);
        if (cicloActivo) {
          this.idCicloAcademicoSeleccionado = cicloActivo.idCicloAcademico;
          this.cargarCargasAcademicas();
        } else if (ciclos.length > 0) {
          this.idCicloAcademicoSeleccionado = ciclos[0].idCicloAcademico;
          this.cargarCargasAcademicas();
        }
      },
      error: (err) => {
        console.error('Error cargando ciclos académicos:', err);
        this.showMessage('Error al cargar ciclos académicos', true);
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
    // Limpiar resultados cuando cambia el ciclo
    this.asignaciones = [];
    this.asignacionesPorDocente = [];
    this.horariosCache.clear(); // Limpiar cache
  }

  // Cargar todas las asignaciones por carga académica
  cargarTodasLasAsignaciones(): void {
    if (!this.idCicloAcademicoSeleccionado || !this.idCargaSeleccionada) {
      this.showMessage('Por favor seleccione un ciclo académico y una carga académica', true);
      return;
    }

    this.modoVista = 'todas';
    this.loadingTodas = true;
    this.asignacionesPorDocente = [];
    this.asignaciones = [];
    this.horariosCache.clear(); // Limpiar cache al cargar nuevas

    this.directorService.obtenerAsignacionesPorCarga(this.idCargaSeleccionada).subscribe({
      next: (response: any) => {
        this.asignacionesPorDocente = response.data || [];
        
        // Aplanar las asignaciones para mantener compatibilidad
        this.asignaciones = this.asignacionesPorDocente.flatMap((docente: any) => 
          docente.asignaciones.map((asignacion: any) => ({
            ...asignacion,
            docente: {
              idDocente: docente.idDocente,
              codigo: docente.codigo,
              usuario: docente.usuario
            }
          }))
        );
        
        // Cargar horarios en background para todas las asignaciones
        this.cargarHorariosEnBackground();
        
        this.loadingTodas = false;
        
        if (this.asignacionesPorDocente.length === 0) {
          this.showMessage('No se encontraron asignaciones para la carga académica seleccionada', false);
        } else {
          const totalAsignaciones = this.asignaciones.length;
          const totalDocentes = this.asignacionesPorDocente.length;
          this.showMessage(`Se cargaron ${totalAsignaciones} asignaciones de ${totalDocentes} docentes`, false);
        }
      },
      error: (err) => {
        this.error = 'Error al cargar las asignaciones';
        this.loadingTodas = false;
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

  // Buscar asignaciones por docente
  buscarAsignaciones(): void {
    // Validar que todos los filtros estén seleccionados
    if (!this.idCicloAcademicoSeleccionado || !this.idDocenteSeleccionado || !this.idCargaSeleccionada) {
      this.showMessage('Por favor seleccione un ciclo académico, un docente y una carga académica', true);
      return;
    }

    this.modoVista = 'filtrado';
    this.loading = true;
    this.asignaciones = [];
    this.horariosCache.clear(); // Limpiar cache

    this.directorService.obtenerAsignacionesPorDocenteYCarga(
      this.idCargaSeleccionada,    // idCarga primero
      this.idDocenteSeleccionado   // idDocente segundo
    ).subscribe({
      next: (response: any) => {
        this.asignaciones = response.data || [];

        // Asociar datos del docente
        const docenteSeleccionado = this.docentes.find(d => d.idDocente === this.idDocenteSeleccionado);
        if (docenteSeleccionado) {
          this.asignaciones = this.asignaciones.map(asignacion => ({
            ...asignacion,
            docente: {
              idDocente: docenteSeleccionado.idDocente,
              codigo: docenteSeleccionado.codigo,
              usuario: docenteSeleccionado.usuario
            }
          }));
        }
        
        // Cargar horarios en background
        this.cargarHorariosEnBackground();
        
        this.loading = false;
        
        if (this.asignaciones.length === 0) {
          this.showMessage('No se encontraron asignaciones para el docente seleccionado', false);
        }
      },
      error: (err) => {
        this.error = 'Error al cargar asignaciones del docente';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // Obtener horarios de una asignación (con cache)
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

  // Ver detalles de la asignación (también actualiza cache)
  verDetalles(asignacion: any): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.error = '';

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
          // Eliminar del cache
          this.horariosCache.delete(this.asignacionEliminando.idAsignacion);
          
          // Recargar según el modo de vista
          if (this.modoVista === 'todas') {
            this.cargarTodasLasAsignaciones();
          } else {
            this.buscarAsignaciones();
          }
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
    this.router.navigate(['/Departamento Academico/editar-asignacion', id]);
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

  getCicloSeleccionado(): string {
    const ciclo = this.ciclosAcademicos.find(c => c.idCicloAcademico === this.idCicloAcademicoSeleccionado);
    return ciclo ? ciclo.nombre : '';
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

  // Calcular total general de horas
  calcularTotalGeneral(): number {
    return this.asignaciones.reduce((total, asignacion) => total + this.calcularTotalHoras(asignacion), 0);
  }

  // Calcular total de horas por docente (para vista "todas")
  calcularTotalHorasDocente(docente: any): number {
    if (!docente.asignaciones) return 0;
    return docente.asignaciones.reduce((total: number, asignacion: any) => 
      total + this.calcularTotalHoras(asignacion), 0);
  }

  // Formatear horarios para display
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

  // Métodos para template
  getCursoInfo(asignacion: any): string {
    if (!asignacion.curso) return 'N/A';
    return `${asignacion.curso.asignatura?.nombre || 'Sin asignatura'} - ${asignacion.curso.grupo || 'Sin grupo'}`;
  }

  getDocenteInfo(asignacion: any): string {
    if (!asignacion.docente) return 'N/A';
    return `${asignacion.docente.usuario?.nombre || ''} ${asignacion.docente.usuario?.apellido || ''}`.trim() || 'N/A';
  }

  // Método para obtener el título según el modo de vista
  getTituloVista(): string {
    if (this.modoVista === 'todas') {
      return `Todas las Asignaciones - ${this.getCargaSeleccionada()}`;
    } else {
      return `Asignaciones de: ${this.getDocenteSeleccionado()}`;
    }
  }

  // Método para obtener subtítulo según el modo de vista
  getSubtituloVista(): string {
    if (this.modoVista === 'todas') {
      const totalDocentes = this.asignacionesPorDocente.length;
      const totalAsignaciones = this.asignaciones.length;
      return `Ciclo: ${this.getCicloSeleccionado()} - ${totalDocentes} docentes - ${totalAsignaciones} asignaciones`;
    } else {
      return `Ciclo: ${this.getCicloSeleccionado()} - Carga: ${this.getCargaSeleccionada()} - ${this.asignaciones.length} cursos asignados`;
    }
  }

  // Obtener docentes que tienen asignaciones (para el dropdown)
  getDocentesConAsignaciones(): any[] {
    return this.asignacionesPorDocente.filter(docente => 
      docente.asignaciones && docente.asignaciones.length > 0
    );
  }
}