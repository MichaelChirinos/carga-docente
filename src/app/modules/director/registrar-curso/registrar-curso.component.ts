import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CursoRequest, CursoIndividualRequest } from '../../../core/models/curso';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registrar-curso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-curso.component.html',
  styleUrls: ['./registrar-curso.component.scss']
})
export class RegistrarCursoComponent implements OnInit {
  modoMultiple = false;
  cursosData: CursoRequest[] = [this.createEmptyCurso()];
cursoIndividualData: CursoIndividualRequest = {
  idAsignatura: 0,
  idPlanDeEstudio: 0,
  idEscuela: 0,
  idCicloAcademico: 0,
  grupo: '',
  cursoHorario: [{
    tipoSesion: 'TEORIA',
    diaSemana: 'lunes',
    horaInicio: '08:00:00',
    horaFin: '10:00:00',
    idAula: 0, // CAMBIADO: de 'aula' a 'idAula'
    duracionHoras: 2
  }]
};
  asignaturas: any[] = [];
  planesEstudio: any[] = [];
  escuelas: any[] = [];
  ciclosAcademicos: any[] = [];
  aulas: any[] = []; // NUEVO: Lista de aulas
  tiposSesion = ['TEORIA', 'LABORATORIO']; // CORREGIDO
  diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  
  isEditing = false;
  cursoId?: number;
  isLoading = false;
  message = '';
  isError = false;
  formSubmitted = false;

  constructor(
    private directorService: DirectorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.cursoId = +id;
      this.cargarCurso(this.cursoId);
    }
    this.cargarDatos();
  }

createEmptyCurso(): CursoRequest {
  return {
    idAsignatura: 0,
    idPlanDeEstudio: 0,
    idEscuela: 0,
    idCicloAcademico: 0,
    grupo: '',
    cursoHorario: [{
      tipoSesion: 'TEORIA',
      diaSemana: 'lunes',
      horaInicio: '08:00:00',
      horaFin: '10:00:00',
      idAula: 0, // CAMBIADO: de 'aula' a 'idAula'
      duracionHoras: 2
    }]
  };
}

 createEmptyHorario() {
  return {
    tipoSesion: 'TEORIA',
    diaSemana: 'lunes',
    horaInicio: '08:00:00',
    horaFin: '10:00:00',
    idAula: 0, // CAMBIADO: de 'aula' a 'idAula'
    duracionHoras: 2
  };
}

  addCurso() {
    this.cursosData.push(this.createEmptyCurso());
  }

  removeCurso(index: number) {
    if (this.cursosData.length > 1) {
      this.cursosData.splice(index, 1);
    }
  }

  addHorario(cursoIndex: number) {
    this.cursosData[cursoIndex].cursoHorario.push(this.createEmptyHorario());
  }

  addHorarioIndividual() {
    this.cursoIndividualData.cursoHorario.push(this.createEmptyHorario());
  }

  removeHorario(cursoIndex: number, horarioIndex: number) {
    if (this.cursosData[cursoIndex].cursoHorario.length > 1) {
      this.cursosData[cursoIndex].cursoHorario.splice(horarioIndex, 1);
    }
  }

  removeHorarioIndividual(horarioIndex: number) {
    if (this.cursoIndividualData.cursoHorario.length > 1) {
      this.cursoIndividualData.cursoHorario.splice(horarioIndex, 1);
    }
  }

  toggleModo() {
    this.modoMultiple = !this.modoMultiple;
    if (this.modoMultiple && this.cursosData.length === 0) {
      this.cursosData = [this.createEmptyCurso()];
    }
  }

  cargarCurso(id: number): void {
  this.isLoading = true;
  this.directorService.obtenerCursoById(id).subscribe({
    next: (response: any) => {
      const curso = response.data || response;
      this.cursoIndividualData = {
        idAsignatura: curso.asignatura.idAsignatura,
        idPlanDeEstudio: curso.planDeEstudio.idPlanDeEstudio,
        idEscuela: curso.escuela.idEscuela,
        idCicloAcademico: curso.cicloAcademico.idCicloAcademico,
        grupo: curso.grupo,
        cursoHorario: curso.cursoHorario.map((horario: any) => ({
          tipoSesion: horario.tipoSesion,
          diaSemana: horario.diaSemana,
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin,
          idAula: horario.aula?.idAula || 0, // IMPORTANTE: usar idAula del aula
          duracionHoras: horario.duracionHoras
        }))
      };
      this.isLoading = false;
    },
    error: (err) => {
      this.showMessage('Error al cargar curso', true);
      this.isLoading = false;
      this.router.navigate(['/director/gestionar-cursos']);
    }
  });
}

  cargarDatos() {
    this.isLoading = true;
    
    this.directorService.obtenerAsignaturas().subscribe({
      next: (res) => this.asignaturas = res.data || [],
      error: (err) => console.error('Error cargando asignaturas:', err)
    });

    this.directorService.obtenerPlanesEstudio().subscribe({
      next: (res) => this.planesEstudio = res.data || [],
      error: (err) => console.error('Error cargando planes de estudio:', err)
    });

    this.directorService.obtenerEscuelas().subscribe({
      next: (res) => this.escuelas = res.data || [],
      error: (err) => console.error('Error cargando escuelas:', err)
    });

    this.directorService.obtenerCiclosAcademicos().subscribe({
      next: (res) => this.ciclosAcademicos = res.data || [],
      error: (err) => console.error('Error cargando ciclos académicos:', err)
    });

    // NUEVO: Cargar aulas
    this.directorService.obtenerAulas().subscribe({
      next: (res) => {
        this.aulas = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando aulas:', err);
        this.isLoading = false;
      }
    });
  }

  calcularDuracion(horario: any) {
    if (horario.horaInicio && horario.horaFin) {
      const inicio = this.parseTime(horario.horaInicio);
      const fin = this.parseTime(horario.horaFin);
      
      const diffMs = fin.getTime() - inicio.getTime();
      const diffHours = Math.round((diffMs / (1000 * 60 * 60)) * 10 / 10);
      
      if (diffHours > 0) {
        horario.duracionHoras = diffHours;
      } else {
        horario.duracionHoras = 0;
      }
    }
  }

  private parseTime(timeString: string): Date {
    // Asegurar formato HH:MM:SS
    let timeParts = timeString.split(':');
    if (timeParts.length === 2) {
      timeString = timeString + ':00';
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  // NUEVO: Filtrar aulas por tipo de sesión
  filtrarAulasPorTipo(tipoSesion: string): any[] {
    if (tipoSesion === 'TEORIA') {
      return this.aulas.filter(aula => aula.tipo === 'TEORIA');
    } else if (tipoSesion === 'LABORATORIO') {
      return this.aulas.filter(aula => aula.tipo === 'LABORATORIO');
    }
    return this.aulas;
  }

  // NUEVO: Obtener nombre del aula
  getNombreAula(idAula: number): string {
    const aula = this.aulas.find(a => a.idAula === idAula);
    return aula ? `${aula.nombre} (${aula.tipo})` : 'Aula no encontrada';
  }

  submitForm(form: NgForm): void {
    this.formSubmitted = true;
    
    if (this.isEditing) {
      this.submitFormIndividual(form);
    } else if (this.modoMultiple) {
      this.submitFormMultiple(form);
    } else {
      this.submitFormIndividual(form);
    }
  }

  submitFormIndividual(form: NgForm): void {
    // Validar datos básicos del curso
    if (!this.cursoIndividualData.idAsignatura || !this.cursoIndividualData.idPlanDeEstudio || 
        !this.cursoIndividualData.idEscuela || !this.cursoIndividualData.idCicloAcademico || 
        !this.cursoIndividualData.grupo) {
      this.showMessage('Por favor complete todos los campos requeridos del curso', true);
      return;
    }

    // Validar horarios
    if (this.cursoIndividualData.cursoHorario.length === 0) {
      this.showMessage('Debe agregar al menos un horario', true);
      return;
    }

    for (const horario of this.cursoIndividualData.cursoHorario) {
      if (!horario.tipoSesion || !horario.diaSemana || !horario.horaInicio || 
          !horario.horaFin || !horario.idAula || horario.duracionHoras <= 0) {
        this.showMessage('Todos los horarios deben estar completos y con duración válida', true);
        return;
      }
    }

    this.isLoading = true;

    if (this.isEditing && this.cursoId) {
      this.directorService.actualizarCurso(this.cursoId, this.cursoIndividualData).subscribe({
        next: (response) => {
          this.showMessage('Curso actualizado con éxito', false);
          setTimeout(() => this.router.navigate(['/director/gestionar-cursos']), 1500);
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.directorService.registrarCurso(this.cursoIndividualData).subscribe({
        next: (response) => {
          this.showMessage('Curso registrado con éxito', false);
          setTimeout(() => this.router.navigate(['/director/gestionar-cursos']), 1500);
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  submitFormMultiple(form: NgForm): void {
    // Validar todos los cursos
    for (const curso of this.cursosData) {
      if (!curso.idAsignatura || !curso.idPlanDeEstudio || !curso.idEscuela || 
          !curso.idCicloAcademico || !curso.grupo || curso.cursoHorario.length === 0) {
        this.showMessage('Todos los cursos deben tener los datos básicos completos', true);
        return;
      }

      for (const horario of curso.cursoHorario) {
        if (!horario.tipoSesion || !horario.diaSemana || !horario.horaInicio || 
            !horario.horaFin || !horario.idAula || horario.duracionHoras <= 0) {
          this.showMessage('Todos los horarios deben estar completos y con duración válida', true);
          return;
        }
      }
    }

    this.isLoading = true;
    this.directorService.registrarCursosMultiples(this.cursosData).subscribe({
      next: (response) => {
        this.showMessage(`${this.cursosData.length} cursos registrados con éxito`, false);
        setTimeout(() => this.router.navigate(['/director/gestionar-cursos']), 1500);
      },
      error: (err) => this.handleError(err)
    });
  }

  private handleError(err: any): void {
    this.showMessage('Error: ' + (err.error?.message || 'Intente nuevamente'), true);
    console.error(err);
    this.isLoading = false;
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    this.isLoading = false;
    setTimeout(() => this.message = '', 3000);
  }
}