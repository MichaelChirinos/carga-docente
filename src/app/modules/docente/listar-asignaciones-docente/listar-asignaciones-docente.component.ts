// listar-asignaciones.component.ts - VERSIÓN MODIFICADA
import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { AuthService } from '../../../core/services/auth.service';
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
  // Lista para ciclo académico (único filtro que mantiene el usuario)
  ciclosAcademicos: any[] = [];
  
  // Datos automáticos
  idDocenteActual: number = 0;
  idCargaPrincipal: number = 0;
  nombreDocenteActual: string = '';
  
  // Filtro seleccionado por el usuario
  idCicloAcademicoSeleccionado: number = 0;
  
  // Datos de asignaciones
  asignaciones: any[] = [];
  asignacionSeleccionada: any = null;
  
  // Estados
  loading = false;
  loadingCiclos = false;
  loadingDocente = false;
  loadingDetalle = false;
  loadingEliminacion = false;
  
  // Mensajes y modales
  error = '';
  message = '';
  isError = false;
  mostrarModalDetalle = false;
  mostrarModalEliminar = false;
  asignacionEliminando: any = null;

  // Cache para horarios
  horariosCache: Map<number, any[]> = new Map();

  constructor(
    private directorService: DirectorService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  private cargarDatosIniciales(): void {
    // 1. Cargar ciclos académicos
    this.cargarCiclosAcademicos();
    
    // 2. Obtener ID del docente a partir del usuario logueado
    this.obtenerIdDocente();
  }

  private cargarCiclosAcademicos(): void {
    this.loadingCiclos = true;
    
    this.directorService.obtenerCiclosAcademicos().subscribe({
      next: (response: any) => {
        const ciclos = response.data || response || [];
        this.ciclosAcademicos = ciclos;
        
        // Seleccionar ciclo activo por defecto
        const cicloActivo = ciclos.find((ciclo: any) => ciclo.enabled);
        if (cicloActivo) {
          this.idCicloAcademicoSeleccionado = cicloActivo.idCicloAcademico;
          this.cargarCargaPrincipal();
        } else if (ciclos.length > 0) {
          this.idCicloAcademicoSeleccionado = ciclos[0].idCicloAcademico;
          this.cargarCargaPrincipal();
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

  private obtenerIdDocente(): void {
    const usuario = this.authService.getCurrentUser();
    
    if (!usuario || !usuario.idUsuario) {
      this.showMessage('No se pudo obtener información del usuario', true);
      return;
    }
    
    this.loadingDocente = true;
    this.nombreDocenteActual = `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim();
    
    // Necesitamos obtener el idDocente desde el idUsuario
    // Primero intentar obtener docente por código (si el usuario tiene código)
    if (usuario.codigo) {
      this.buscarDocentePorCodigo(usuario.codigo);
    } else {
      // Si no hay código, buscar por email o nombre
      this.buscarDocentePorUsuario(usuario);
    }
  }

  private buscarDocentePorCodigo(codigo: string): void {
    this.directorService.obtenerDocentes().subscribe({
      next: (response: any) => {
        const docentes = response.data || response || [];
        const docente = docentes.find((d: any) => d.codigo === codigo);
        
        if (docente) {
          this.idDocenteActual = docente.idDocente;
          this.loadingDocente = false;
          
          // Si ya tenemos ciclo seleccionado, cargar asignaciones
          if (this.idCicloAcademicoSeleccionado && this.idCargaPrincipal) {
            this.cargarAsignaciones();
          }
        } else {
          // Si no se encuentra por código, buscar por usuario
          const usuario = this.authService.getCurrentUser();
          this.buscarDocentePorUsuario(usuario);
        }
      },
      error: (err) => {
        console.error('Error buscando docente por código:', err);
        this.loadingDocente = false;
      }
    });
  }

  private buscarDocentePorUsuario(usuario: any): void {
    // Buscar en la lista de docentes por nombre/email
    this.directorService.obtenerDocentes().subscribe({
      next: (response: any) => {
        const docentes = response.data || response || [];
        
        // Buscar por email o nombre completo
        const docente = docentes.find((d: any) => {
          const docenteEmail = d.usuario?.email?.toLowerCase();
          const usuarioEmail = usuario.email?.toLowerCase();
          
          const docenteNombre = `${d.usuario?.nombre || ''} ${d.usuario?.apellido || ''}`.toLowerCase().trim();
          const usuarioNombre = `${usuario.nombre || ''} ${usuario.apellido || ''}`.toLowerCase().trim();
          
          return (docenteEmail && usuarioEmail && docenteEmail === usuarioEmail) ||
                 (docenteNombre && usuarioNombre && docenteNombre === usuarioNombre);
        });
        
        if (docente) {
          this.idDocenteActual = docente.idDocente;
        } else {
          this.showMessage('No se encontró información del docente asociado a tu usuario', true);
        }
        
        this.loadingDocente = false;
        
        // Si ya tenemos ciclo seleccionado, cargar asignaciones
        if (this.idCicloAcademicoSeleccionado && this.idCargaPrincipal) {
          this.cargarAsignaciones();
        }
      },
      error: (err) => {
        console.error('Error buscando docente por usuario:', err);
        this.showMessage('Error al buscar información del docente', true);
        this.loadingDocente = false;
      }
    });
  }

  private cargarCargaPrincipal(): void {
    if (!this.idCicloAcademicoSeleccionado) return;

    this.directorService.obtenerCargaPrincipal(this.idCicloAcademicoSeleccionado).subscribe({
      next: (response: any) => {
        const cargaPrincipal = response.data;
        
        if (cargaPrincipal && cargaPrincipal.idCarga) {
          this.idCargaPrincipal = cargaPrincipal.idCarga;
          
          // Si ya tenemos el idDocente, cargar asignaciones
          if (this.idDocenteActual) {
            this.cargarAsignaciones();
          }
        } else {
          this.showMessage('No hay carga principal configurada para este ciclo académico', true);
        }
      },
      error: (err) => {
        console.error('Error cargando carga principal:', err);
        this.showMessage('Error al cargar la carga principal', true);
      }
    });
  }

  private cargarAsignaciones(): void {
    // Validar que tenemos todos los datos necesarios
    if (!this.idCicloAcademicoSeleccionado || !this.idCargaPrincipal || !this.idDocenteActual) {
      console.log('Faltan datos para cargar asignaciones:', {
        ciclo: this.idCicloAcademicoSeleccionado,
        carga: this.idCargaPrincipal,
        docente: this.idDocenteActual
      });
      return;
    }

    this.loading = true;
    this.asignaciones = [];
    this.horariosCache.clear();

    this.directorService.obtenerAsignacionesPorDocenteYCarga(
      this.idCargaPrincipal,
      this.idDocenteActual
    ).subscribe({
      next: (response: any) => {
        this.asignaciones = response.data || [];

        // Cargar horarios en background
        this.cargarHorariosEnBackground();
        
        this.loading = false;
        
        if (this.asignaciones.length === 0) {
          this.showMessage('No tienes asignaciones registradas para este ciclo académico', false);
        }
      },
      error: (err) => {
        this.error = 'Error al cargar tus asignaciones';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onCicloChange(): void {
    // Cuando cambia el ciclo, recargar carga principal y asignaciones
    this.cargarCargaPrincipal();
  }

  // ---------- MÉTODOS DE CACHE Y HORARIOS (se mantienen igual) ----------
  
  private cargarHorariosEnBackground(): void {
    this.asignaciones.forEach(asignacion => {
      if (asignacion.idAsignacion && !this.getHorarios(asignacion).length) {
        this.cargarHorariosIndividualEnBackground(asignacion.idAsignacion);
      }
    });
  }

  private cargarHorariosIndividualEnBackground(idAsignacion: number): void {
    this.directorService.obtenerAsignacionPorId(idAsignacion).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          const asignacionDetalle = response.data;
          const horariosDetalle = asignacionDetalle?.curso?.horarios || 
                                 asignacionDetalle?.curso?.cursoHorario || 
                                 asignacionDetalle?.horarios || 
                                 [];
          
          if (horariosDetalle.length > 0) {
            this.horariosCache.set(idAsignacion, horariosDetalle);
            
            const index = this.asignaciones.findIndex(a => a.idAsignacion === idAsignacion);
            if (index !== -1) {
              if (!this.asignaciones[index].curso) {
                this.asignaciones[index].curso = {};
              }
              this.asignaciones[index].curso.horarios = horariosDetalle;
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

  getHorarios(asignacion: any): any[] {
    const idAsignacion = asignacion.idAsignacion;
    
    if (this.horariosCache.has(idAsignacion)) {
      return this.horariosCache.get(idAsignacion) || [];
    }
    
    const horarios = asignacion?.curso?.horarios || 
                     asignacion?.curso?.cursoHorario || 
                     asignacion?.horarios || 
                     [];
    
    if (horarios.length > 0) {
      this.horariosCache.set(idAsignacion, horarios);
    }
    
    return horarios;
  }

  // ---------- MÉTODOS PARA INTERACCIÓN (se mantienen igual) ----------

  verDetalles(asignacion: any): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.error = '';

    this.directorService.obtenerAsignacionPorId(asignacion.idAsignacion).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.asignacionSeleccionada = response.data;
          
          const horariosDetalle = this.asignacionSeleccionada?.curso?.horarios || 
                                 this.asignacionSeleccionada?.curso?.cursoHorario || 
                                 this.asignacionSeleccionada?.horarios || 
                                 [];
          
          if (horariosDetalle.length > 0) {
            this.horariosCache.set(asignacion.idAsignacion, horariosDetalle);
            
            const index = this.asignaciones.findIndex(a => a.idAsignacion === asignacion.idAsignacion);
            if (index !== -1) {
              if (!this.asignaciones[index].curso) {
                this.asignaciones[index].curso = {};
              }
              this.asignaciones[index].curso.horarios = horariosDetalle;
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

  abrirEliminar(asignacion: any): void {
    this.asignacionEliminando = { ...asignacion };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  confirmarEliminacion(): void {
    this.loadingEliminacion = true;

    this.directorService.eliminarAsignacion(this.asignacionEliminando.idAsignacion).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showMessage('Asignación eliminada exitosamente', false);
          this.horariosCache.delete(this.asignacionEliminando.idAsignacion);
          this.cargarAsignaciones(); // Recargar asignaciones
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

  // ---------- MÉTODOS AUXILIARES ----------

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }

  getCicloSeleccionado(): string {
    const ciclo = this.ciclosAcademicos.find(c => c.idCicloAcademico === this.idCicloAcademicoSeleccionado);
    return ciclo ? ciclo.nombre : 'No seleccionado';
  }

  getNombreCargaPrincipal(): string {
    // Si quieres mostrar el nombre de la carga, necesitarías cargarlo
    return this.idCargaPrincipal ? `Carga Principal (ID: ${this.idCargaPrincipal})` : 'No disponible';
  }

  calcularTotalHoras(asignacion: any): number {
    const horarios = this.getHorarios(asignacion);
    if (!horarios || horarios.length === 0) return 0;
    
    let total = 0;
    horarios.forEach((horario: any) => {
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

  formatearHorarios(horarios: any[]): string {
    if (!horarios || horarios.length === 0) return 'Sin horarios';
    
    const horariosFormateados = horarios.map(horario => {
      const dia = horario.diaSemana || horario.dia || '';
      const horaInicio = horario.horaInicio || horario.hora_inicio || horario.inicio || '';
      const horaFin = horario.horaFin || horario.hora_fin || horario.fin || '';
      const tipo = horario.tipoSesion || horario.tipo_sesion || horario.tipo || '';
      
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

  getCursoInfo(asignacion: any): string {
    if (!asignacion.curso) return 'N/A';
    return `${asignacion.curso.asignatura?.nombre || 'Sin asignatura'} - ${asignacion.curso.grupo || 'Sin grupo'}`;
  }

  getTituloVista(): string {
    return `Mis Asignaciones - ${this.nombreDocenteActual}`;
  }

  getSubtituloVista(): string {
    return `Ciclo: ${this.getCicloSeleccionado()} | Carga: ${this.getNombreCargaPrincipal()} | Total: ${this.asignaciones.length} cursos`;
  }
}