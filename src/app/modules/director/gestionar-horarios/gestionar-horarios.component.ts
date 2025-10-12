import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-gestionar-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './gestionar-horarios.component.html'
})
export class GestionarHorariosComponent implements OnInit {
  idCurso!: number;
  horarios: any[] = [];
  aulas: any[] = [];
  
  nuevoHorario: any = {
    tipoSesion: 'Teoría',
    diaSemana: 'lunes',
    horaInicio: '08:00:00',
    horaFin: '10:00:00',
    duracionHoras: 2,
    idAula: 0
  };
  
  multiplesHorarios: any[] = [this.createEmptyHorario()];
  modoMultiple = false;
  
  // Para edición
  horarioEditando: any = null;
  mostrarModalEditar = false;
  
  // Para eliminación
  horarioEliminando: any = null;
  mostrarModalEliminar = false;
  loadingEliminacion = false;
  
  tiposSesion = ['Teoría', 'Práctica', 'Laboratorio'];
  diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  
  isLoading = false;
  message = '';
  isError = false;

  constructor(
    private directorService: DirectorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.idCurso = +this.route.snapshot.params['idCurso'];
    this.cargarDatos();
  }

  cargarDatos() {
    this.isLoading = true;
    
    // Cargar horarios del curso
    this.directorService.obtenerHorariosCurso(this.idCurso).subscribe({
      next: (response) => {
        this.horarios = response.data || response || [];
      },
      error: (err) => {
        this.showMessage('Error al cargar horarios', true);
      }
    });

    // Cargar aulas disponibles
    this.directorService.obtenerAulas().subscribe({
      next: (response) => {
        this.aulas = response.data || response || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar aulas', true);
        this.isLoading = false;
      }
    });
  }

  createEmptyHorario() {
    return {
      tipoSesion: 'Teoría',
      diaSemana: 'lunes', 
      horaInicio: '08:00:00',
      horaFin: '10:00:00',
      duracionHoras: 2,
      idAula: 0
    };
  }

  calcularDuracion(horario: any) {
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

  // INSERTAR UN SOLO HORARIO
  insertarHorarioIndividual() {
    if (!this.validarHorario(this.nuevoHorario)) return;

    this.isLoading = true;
    this.directorService.insertarHorarioCurso(this.idCurso, this.nuevoHorario).subscribe({
      next: (response) => {
        this.showMessage('Horario agregado exitosamente', false);
        this.nuevoHorario = this.createEmptyHorario();
        this.cargarDatos();
      },
      error: (err) => {
        this.showMessage('Error al agregar horario: ' + (err.error?.message || ''), true);
        this.isLoading = false;
      }
    });
  }

  // INSERTAR MÚLTIPLES HORARIOS
  agregarHorarioMultiple() {
    this.multiplesHorarios.push(this.createEmptyHorario());
  }

  removerHorarioMultiple(index: number) {
    if (this.multiplesHorarios.length > 1) {
      this.multiplesHorarios.splice(index, 1);
    }
  }

  insertarHorariosMultiples() {
    // Validar todos los horarios
    for (const horario of this.multiplesHorarios) {
      if (!this.validarHorario(horario)) return;
    }

    this.isLoading = true;
    this.directorService.insertarHorariosCurso(this.idCurso, this.multiplesHorarios).subscribe({
      next: (response) => {
        this.showMessage(`${this.multiplesHorarios.length} horarios agregados exitosamente`, false);
        this.multiplesHorarios = [this.createEmptyHorario()];
        this.modoMultiple = false;
        this.cargarDatos();
      },
      error: (err) => {
        this.showMessage('Error al agregar horarios: ' + (err.error?.message || ''), true);
        this.isLoading = false;
      }
    });
  }

  // EDITAR HORARIO
  iniciarEdicion(horario: any) {
    this.horarioEditando = { 
      ...horario,
      idAula: horario.aula?.idAula || 0
    };
    this.mostrarModalEditar = true;
  }

  cancelarEdicion() {
    this.horarioEditando = null;
    this.mostrarModalEditar = false;
  }

  actualizarHorario() {
    if (!this.validarHorario(this.horarioEditando)) return;

    this.isLoading = true;
    this.directorService.actualizarHorarioCurso(
      this.horarioEditando.idCursoHorario, 
      this.horarioEditando
    ).subscribe({
      next: (response) => {
        this.showMessage('Horario actualizado exitosamente', false);
        this.cancelarEdicion();
        this.cargarDatos();
      },
      error: (err) => {
        this.showMessage('Error al actualizar horario: ' + (err.error?.message || ''), true);
        this.isLoading = false;
      }
    });
  }

  // ELIMINAR HORARIO
  abrirEliminar(horario: any) {
    this.horarioEliminando = horario;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar() {
    this.horarioEliminando = null;
    this.mostrarModalEliminar = false;
    this.loadingEliminacion = false;
  }

  confirmarEliminacion() {
    if (!this.horarioEliminando) return;

    this.loadingEliminacion = true;
    this.directorService.eliminarHorarioCurso(this.horarioEliminando.idCursoHorario).subscribe({
      next: (response) => {
        this.showMessage('Horario eliminado exitosamente', false);
        this.cerrarModalEliminar();
        this.cargarDatos();
      },
      error: (err) => {
        this.showMessage('Error al eliminar horario: ' + (err.error?.message || ''), true);
        this.loadingEliminacion = false;
      }
    });
  }

  validarHorario(horario: any): boolean {
    if (!horario.tipoSesion || !horario.diaSemana || !horario.horaInicio || 
        !horario.horaFin || !horario.idAula || horario.duracionHoras <= 0) {
      this.showMessage('Todos los campos del horario son requeridos', true);
      return false;
    }
    return true;
  }

  toggleModo() {
    this.modoMultiple = !this.modoMultiple;
    if (this.modoMultiple && this.multiplesHorarios.length === 0) {
      this.multiplesHorarios = [this.createEmptyHorario()];
    }
  }

  prevenirCierre(event: Event) {
    event.stopPropagation();
  }

  getNombreAula(idAula: number): string {
    const aula = this.aulas.find(a => a.idAula === idAula);
    return aula ? `${aula.tipo} - ${aula.nombre || 'Sin nombre'}` : 'Aula no encontrada';
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    this.isLoading = false;
    setTimeout(() => this.message = '', 5000);
  }
}