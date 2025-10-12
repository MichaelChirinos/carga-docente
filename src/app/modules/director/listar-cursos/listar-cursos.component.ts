import { Component } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-cursos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-cursos.component.html'
})
export class ListarCursosComponent {
  cursos: any[] = [];
  ciclosAcademicos: any[] = [];
  cicloSeleccionado: number | 'todos' = 'todos';
  
  // Estados para modales
  cursoSeleccionado: any = null;
  cursoEditando: any = null;
  cursoEliminando: any = null;
  
  // Estados de carga
  loading = true;
  loadingDetalle = false;
  loadingEdicion = false;
  loadingEliminacion = false;
  
  // Estados de modales
  error = '';
  mostrarModalDetalle = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;

  // Para edición avanzada
  mostrarModalEditarCompleto = false;
  cursoEditandoCompleto: any = null;
  horariosEditando: any[] = [];
  aulas: any[] = [];
  tiposSesion = ['TEORIA', 'LABORATORIO'];
  diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCiclosAcademicos();
    this.cargarAulas(); // Cargar aulas para la edición
  }

  cargarAulas(): void {
    this.directorService.obtenerAulas().subscribe({
      next: (response: any) => {
        this.aulas = response.data || response || [];
      },
      error: (err) => {
        console.error('Error cargando aulas:', err);
      }
    });
  }

  cargarCiclosAcademicos(): void {
    this.directorService.obtenerCiclosAcademicos().subscribe({
      next: (response: any) => {
        this.ciclosAcademicos = response.data || response;
        this.cargarCursos();
      },
      error: (err) => {
        console.error('Error cargando ciclos académicos:', err);
        this.cargarCursos();
      }
    });
  }

  cargarCursos(): void {
    this.loading = true;
    
    if (this.cicloSeleccionado === 'todos') {
      this.directorService.obtenerCursos().subscribe({
        next: (response: any) => this.handleSuccess(response),
        error: (err) => this.handleError(err)
      });
    } else {
      this.directorService.obtenerCursosPorCiclo(this.cicloSeleccionado).subscribe({
        next: (response: any) => this.handleSuccess(response),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleSuccess(response: any): void {
    this.cursos = response.data || response;
    this.loading = false;
    this.error = '';
  }

  private handleError(err: any): void {
    this.error = 'Error al cargar cursos';
    this.loading = false;
    console.error(err);
  }

  onCicloChange(): void {
    this.cargarCursos();
  }

  // VER DETALLES
  verDetalles(curso: any): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.error = '';

    this.directorService.obtenerCursoPorId(curso.idCurso).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.cursoSeleccionado = response.data;
        } else {
          this.error = response.message || 'Curso no encontrado';
          this.cursoSeleccionado = null;
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles del curso';
        this.cursoSeleccionado = null;
        this.loadingDetalle = false;
        console.error(err);
      }
    });
  }

  // EDITAR CURSO SIMPLE (solo grupo)
  abrirEditar(curso: any): void {
    this.cursoEditando = { ...curso };
    this.mostrarModalEditar = true;
    this.error = '';
  }

  guardarEdicion(): void {
    if (!this.cursoEditando?.grupo?.trim()) {
      this.error = 'El grupo del curso es obligatorio';
      return;
    }

    this.loadingEdicion = true;
    this.error = '';

    const datosActualizacion = {
      grupo: this.cursoEditando.grupo.trim(),
      idAsignatura: this.cursoEditando.asignatura.idAsignatura,
      idPlanDeEstudio: this.cursoEditando.planDeEstudio.idPlanDeEstudio,
      idEscuela: this.cursoEditando.escuela.idEscuela,
      idCicloAcademico: this.cursoEditando.cicloAcademico.idCicloAcademico
    };

    this.directorService.actualizarCurso(this.cursoEditando.idCurso, datosActualizacion).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Actualizar la lista local
          const index = this.cursos.findIndex(c => c.idCurso === this.cursoEditando.idCurso);
          if (index !== -1) {
            this.cursos[index] = { ...this.cursos[index], ...response.data };
          }
          this.cerrarModalEditar();
          this.cargarCursos(); // Recargar para asegurar datos actualizados
        } else {
          this.error = response.message || 'Error al actualizar el curso';
        }
        this.loadingEdicion = false;
      },
      error: (err) => {
        this.error = 'Error al actualizar el curso';
        this.loadingEdicion = false;
        console.error(err);
      }
    });
  }

  // EDITAR CURSO COMPLETO (con horarios)
 // En ListarCursosComponent - VERIFICAR ESTE MÉTODO
abrirEditarCompleto(curso: any): void {
  this.loadingDetalle = true;
  this.mostrarModalEditarCompleto = true;
  this.error = '';

  this.directorService.obtenerCursoPorId(curso.idCurso).subscribe({
    next: (response: any) => {
      if (response.status === 200 && response.data) {
        this.cursoEditandoCompleto = { ...response.data };
        // PREPARAR HORARIOS CORRECTAMENTE
        this.horariosEditando = this.cursoEditandoCompleto.cursoHorario.map((horario: any) => ({
          idCursoHorario: horario.idCursoHorario, // ← ESTO ES CLAVE
          tipoSesion: horario.tipoSesion,
          diaSemana: horario.diaSemana,
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin,
  idAula: Number(horario.aula?.idAula) || 0, // ← CONVERTIR A NUMBER
          duracionHoras: horario.duracionHoras,
          enabled: horario.enabled,
          esNuevo: false // ← Los existentes no son nuevos
        }));
        console.log('Horarios cargados:', this.horariosEditando);
      } else {
        this.error = response.message || 'Curso no encontrado';
        this.cursoEditandoCompleto = null;
      }
      this.loadingDetalle = false;
    },
    error: (err) => {
      this.error = 'Error al cargar el curso para edición';
      this.cursoEditandoCompleto = null;
      this.loadingDetalle = false;
      console.error(err);
    }
  });
}
  guardarEdicionCompleta(): void {
    if (!this.cursoEditandoCompleto?.grupo?.trim()) {
      this.error = 'El grupo del curso es obligatorio';
      return;
    }
  // NORMALIZAR HORAS ANTES DE VALIDAR
  this.horariosEditando.forEach(horario => {
    horario.horaInicio = this.normalizarHora(horario.horaInicio);
    horario.horaFin = this.normalizarHora(horario.horaFin);
  });
    // Validar horarios
    for (const horario of this.horariosEditando) {
    if (!horario.tipoSesion || !horario.diaSemana || !horario.horaInicio || 
        !horario.horaFin || !horario.idAula || horario.duracionHoras <= 0) {
      this.error = 'Todos los horarios deben estar completos y con duración válida';
      return;
    }
  }

    this.loadingEdicion = true;
    this.error = '';

    // 1. Actualizar datos básicos del curso
    const datosCurso = {
      grupo: this.cursoEditandoCompleto.grupo.trim(),
      idAsignatura: this.cursoEditandoCompleto.asignatura.idAsignatura,
      idPlanDeEstudio: this.cursoEditandoCompleto.planDeEstudio.idPlanDeEstudio,
      idEscuela: this.cursoEditandoCompleto.escuela.idEscuela,
      idCicloAcademico: this.cursoEditandoCompleto.cicloAcademico.idCicloAcademico
    };

    this.directorService.actualizarCurso(this.cursoEditandoCompleto.idCurso, datosCurso).subscribe({
      next: (cursoResponse: any) => {
        // 2. Actualizar horarios uno por uno
        this.actualizarHorariosSecuencialmente(0);
      },
      error: (err) => {
        this.error = 'Error al actualizar los datos del curso';
        this.loadingEdicion = false;
        console.error(err);
      }
    });
  }

  private normalizarHora(hora: string): string {
  if (!hora) return hora;
  
  // Si ya está en formato HH:mm, dejarlo así
  if (hora.match(/^\d{1,2}:\d{2}$/)) {
    return hora;
  }
  
  // Si está en formato HH:mm:ss, quitar los segundos
  if (hora.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
    return hora.substring(0, 5);
  }
  
  // Para cualquier otro caso, intentar normalizar
  const parts = hora.split(':');
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  
  return hora;
}
// En ListarCursosComponent - CORREGIR ESTE MÉTODO
private actualizarHorariosSecuencialmente(index: number): void {
  if (index >= this.horariosEditando.length) {
    // Todos los horarios procesados
    this.loadingEdicion = false;
    this.cerrarModalEditarCompleto();
    this.cargarCursos(); // Recargar lista
    return;
  }

  const horario = this.horariosEditando[index];
  
  // PREPARAR DATOS DEL HORARIO (sin campos internos)
  const datosHorario = {
    tipoSesion: horario.tipoSesion,
    diaSemana: horario.diaSemana,
    horaInicio: this.normalizarHora(horario.horaInicio),
    horaFin: this.normalizarHora(horario.horaFin),
    idAula: Number(horario.idAula), // ← CONVERTIR A NUMBER
    duracionHoras: horario.duracionHoras
  };
  if (horario.idCursoHorario && !horario.esNuevo) {
    // HORARIO EXISTENTE: Actualizar
    this.directorService.actualizarHorarioCurso(horario.idCursoHorario, datosHorario).subscribe({
      next: (response: any) => {
        console.log('Horario actualizado:', response);
        this.actualizarHorariosSecuencialmente(index + 1);
      },
      error: (err) => {
        this.error = `Error al actualizar el horario ${index + 1}: ${err.error?.message || err.message}`;
        this.loadingEdicion = false;
        console.error('Error actualizando horario:', err);
      }
    });
  } else {
    // HORARIO NUEVO: Crear
    this.directorService.insertarHorarioCurso(this.cursoEditandoCompleto.idCurso, datosHorario).subscribe({
      next: (response: any) => {
        console.log('Horario creado:', response);
        this.actualizarHorariosSecuencialmente(index + 1);
      },
      error: (err) => {
        this.error = `Error al crear el horario ${index + 1}: ${err.error?.message || err.message}`;
        this.loadingEdicion = false;
        console.error('Error creando horario:', err);
      }
    });
  }
}

  // Métodos auxiliares para horarios
  // En ListarCursosComponent
agregarHorario(): void {
  this.horariosEditando.push({
    idCursoHorario: null, // ← Los nuevos no tienen ID
    tipoSesion: 'TEORIA',
    diaSemana: 'lunes',
    horaInicio: '08:00:00',
    horaFin: '10:00:00',
    idAula: 0,
    duracionHoras: 2,
    esNuevo: true // ← Marcar como nuevo
  });
}

  // En ListarCursosComponent
eliminarHorario(index: number): void {
  const horario = this.horariosEditando[index];
  
  if (horario.idCursoHorario && !horario.esNuevo) {
    // Si tiene ID y no es nuevo, eliminar del backend
    this.directorService.eliminarHorarioCurso(horario.idCursoHorario).subscribe({
      next: (response: any) => {
        this.horariosEditando.splice(index, 1);
      },
      error: (err) => {
        this.error = 'Error al eliminar el horario: ' + (err.error?.message || err.message);
        console.error(err);
      }
    });
  } else {
    // Si es nuevo, solo quitarlo del array
    this.horariosEditando.splice(index, 1);
  }
}
  calcularDuracion(horario: any): void {
    if (horario.horaInicio && horario.horaFin) {
      const inicio = this.parseTime(horario.horaInicio);
      const fin = this.parseTime(horario.horaFin);
      
      const diffMs = fin.getTime() - inicio.getTime();
      const diffHours = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
      
      horario.duracionHoras = diffHours > 0 ? diffHours : 0;
    }
  }

  private parseTime(timeString: string): Date {
    let timeParts = timeString.split(':');
    if (timeParts.length === 2) timeString = timeString + ':00';
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  filtrarAulasPorTipo(tipoSesion: string): any[] {
    if (tipoSesion === 'TEORIA') {
      return this.aulas.filter(aula => aula.tipo === 'TEORIA');
    } else if (tipoSesion === 'LABORATORIO') {
      return this.aulas.filter(aula => aula.tipo === 'LABORATORIO');
    }
    return this.aulas;
  }

  // ELIMINAR CURSO
  abrirEliminar(curso: any): void {
    this.cursoEliminando = { ...curso };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  confirmarEliminacion(): void {
    this.loadingEliminacion = true;

    this.directorService.eliminarCurso(this.cursoEliminando.idCurso).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Eliminar de la lista local
          this.cursos = this.cursos.filter(c => c.idCurso !== this.cursoEliminando.idCurso);
          this.cerrarModalEliminar();
          this.cargarCursos(); // Recargar lista
        } else {
          this.error = response.message || 'Error al eliminar el curso';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar el curso';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  // CERRAR MODALES
  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.cursoSeleccionado = null;
    this.error = '';
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.cursoEditando = null;
    this.loadingEdicion = false;
    this.error = '';
  }

  cerrarModalEditarCompleto(): void {
    this.mostrarModalEditarCompleto = false;
    this.cursoEditandoCompleto = null;
    this.horariosEditando = [];
    this.loadingEdicion = false;
    this.error = '';
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.cursoEliminando = null;
    this.loadingEliminacion = false;
    this.error = '';
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }

  // MÉTODOS AUXILIARES
  getDiaNombre(dia: string): string {
    const diasMap: Record<string, string> = {
      'LUNES': 'Lunes',
      'MARTES': 'Martes',
      'MIERCOLES': 'Miércoles',
      'JUEVES': 'Jueves',
      'VIERNES': 'Viernes',
      'SÁBADO': 'Sábado',
      'lunes': 'Lunes',
      'martes': 'Martes',
      'miércoles': 'Miércoles',
      'miercoles': 'Miércoles',
      'jueves': 'Jueves',
      'viernes': 'Viernes',
      'sábado': 'Sábado'
    };
    return diasMap[dia] || dia;
  }

  formatHora(hora: string): string {
    return hora.substring(0, 5);
  }

  getTipoSesionNombre(tipo: string): string {
    const tiposMap: Record<string, string> = {
      'TEORIA': 'Teoría',
      'LABORATORIO': 'Laboratorio',
      'T': 'Teoría',
      'L': 'Laboratorio'
    };
    return tiposMap[tipo] || tipo;
  }
}