import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CursoRequest, HorarioRequest } from '../../../core/models/curso';
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
  
  cursoIndividualData: CursoRequest = {
    idAsignatura: 0,
    planDeEstudios: [],
    idEscuela: 0,
    idCicloAcademico: 0,
    ciclo: 1, // Cambiado a 1 por defecto
    grupo: '',
    horarios: [{
      tipoSesion: 'TEORIA',
      diaSemana: 'lunes',
      horaInicio: '08:00:00',
      horaFin: '10:00:00',
      duracionHoras: 2
    }]
  };

  asignaturas: any[] = [];
  planesEstudio: any[] = [];
  escuelas: any[] = [];
  ciclosAcademicos: any[] = [];
  aulas: any[] = [];
  tiposSesion = ['TEORIA', 'LABORATORIO'];
  diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  
  // Variables para planes de estudio
  planEstudioSeleccionadoIndividual: string = '';
planEstudioSeleccionadoMultiple: string[] = [];
  
  isEditing = false;
  cursoId?: number;
  isLoading = false;
  message = '';
  isError = false;
  formSubmitted = false;

  // Array para ciclos del 1 al 10
  ciclos = Array.from({length: 10}, (_, i) => i + 1);

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
  
  // Inicializar el array para modo múltiple
  this.planEstudioSeleccionadoMultiple = [''];
}

  createEmptyCurso(): CursoRequest {
    return {
      idAsignatura: 0,
      planDeEstudios: [],
      idEscuela: 0,
      idCicloAcademico: 0,
      ciclo: 1, // Cambiado a 1 por defecto
      grupo: '',
      horarios: [{
        tipoSesion: 'TEORIA',
        diaSemana: 'lunes',
        horaInicio: '08:00:00',
        horaFin: '10:00:00',
        duracionHoras: 2
      }]
    };
  }

  createEmptyHorario(): HorarioRequest {
    return {
      tipoSesion: 'TEORIA',
      diaSemana: 'lunes',
      horaInicio: '08:00:00',
      horaFin: '10:00:00',
      duracionHoras: 2
    };
  }

addCurso() {
  this.cursosData.push(this.createEmptyCurso());
  this.planEstudioSeleccionadoMultiple.push(''); // Cambiado de null a ''
}
  removeCurso(index: number) {
    if (this.cursosData.length > 1) {
      this.cursosData.splice(index, 1);
      this.planEstudioSeleccionadoMultiple.splice(index, 1);
    }
  }

  addHorario(cursoIndex: number) {
    this.cursosData[cursoIndex].horarios.push(this.createEmptyHorario());
  }

  addHorarioIndividual() {
    this.cursoIndividualData.horarios.push(this.createEmptyHorario());
  }

  removeHorario(cursoIndex: number, horarioIndex: number) {
    if (this.cursosData[cursoIndex].horarios.length > 1) {
      this.cursosData[cursoIndex].horarios.splice(horarioIndex, 1);
    }
  }

  removeHorarioIndividual(horarioIndex: number) {
    if (this.cursoIndividualData.horarios.length > 1) {
      this.cursoIndividualData.horarios.splice(horarioIndex, 1);
    }
  }

toggleModo() {
  this.modoMultiple = !this.modoMultiple;
  if (this.modoMultiple && this.cursosData.length === 0) {
    this.cursosData = [this.createEmptyCurso()];
    this.planEstudioSeleccionadoMultiple = ['']; // Cambiado de null a ''
  }
}

  // Métodos para planes de estudio
agregarPlanDesdeSelect(): void {
  if (this.planEstudioSeleccionadoIndividual) {
    const nombrePlan = this.planEstudioSeleccionadoIndividual;
    if (!this.cursoIndividualData.planDeEstudios.includes(nombrePlan)) {
      this.cursoIndividualData.planDeEstudios.push(nombrePlan);
    }
    this.planEstudioSeleccionadoIndividual = '';
  }
}
agregarPlanDesdeSelectMultiple(cursoIndex: number): void {
  if (this.planEstudioSeleccionadoMultiple[cursoIndex]) {
    const nombrePlan = this.planEstudioSeleccionadoMultiple[cursoIndex];
    if (!this.cursosData[cursoIndex].planDeEstudios.includes(nombrePlan)) {
      this.cursosData[cursoIndex].planDeEstudios.push(nombrePlan);
    }
    this.planEstudioSeleccionadoMultiple[cursoIndex] = '';
  }
}

  agregarPlanDeEstudio(plan: string, index?: number): void {
    if (plan && plan.trim()) {
      if (this.modoMultiple && index !== undefined) {
        if (!this.cursosData[index].planDeEstudios.includes(plan)) {
          this.cursosData[index].planDeEstudios.push(plan);
        }
      } else {
        if (!this.cursoIndividualData.planDeEstudios.includes(plan)) {
          this.cursoIndividualData.planDeEstudios.push(plan);
        }
      }
    }
  }

  removerPlanDeEstudio(planIndex: number, cursoIndex?: number): void {
    if (this.modoMultiple && cursoIndex !== undefined) {
      this.cursosData[cursoIndex].planDeEstudios.splice(planIndex, 1);
    } else {
      this.cursoIndividualData.planDeEstudios.splice(planIndex, 1);
    }
  }

  cargarCurso(id: number): void {
    this.isLoading = true;
    this.directorService.obtenerCursoById(id).subscribe({
      next: (response: any) => {
        const curso = response.data || response;
        this.cursoIndividualData = {
          idAsignatura: curso.asignatura.idAsignatura,
          planDeEstudios: curso.planDeEstudios || [],
          idEscuela: curso.escuela.idEscuela,
          idCicloAcademico: curso.cicloAcademico.idCicloAcademico,
          ciclo: curso.ciclo,
          grupo: curso.grupo,
          horarios: curso.horarios.map((horario: any) => ({
            tipoSesion: horario.tipoSesion,
            diaSemana: horario.diaSemana,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            duracionHoras: horario.duracionHoras
          }))
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar curso', true);
        this.isLoading = false;
        this.router.navigate(['/Departamento Academico/gestionar-cursos']);
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

  calcularDuracion(horario: HorarioRequest) {
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
    let timeParts = timeString.split(':');
    if (timeParts.length === 2) {
      timeString = timeString + ':00';
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
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
    if (!this.cursoIndividualData.idAsignatura || 
        this.cursoIndividualData.planDeEstudios.length === 0 ||
        !this.cursoIndividualData.idEscuela || 
        !this.cursoIndividualData.idCicloAcademico ||
        !this.cursoIndividualData.ciclo ||
        !this.cursoIndividualData.grupo) {
      this.showMessage('Por favor complete todos los campos requeridos del curso', true);
      return;
    }

    // Validar horarios
    if (this.cursoIndividualData.horarios.length === 0) {
      this.showMessage('Debe agregar al menos un horario', true);
      return;
    }

    for (const horario of this.cursoIndividualData.horarios) {
      if (!horario.tipoSesion || !horario.diaSemana || !horario.horaInicio || 
          !horario.horaFin || horario.duracionHoras <= 0) {
        this.showMessage('Todos los horarios deben estar completos y con duración válida', true);
        return;
      }
    }

    this.isLoading = true;

    if (this.isEditing && this.cursoId) {
      this.directorService.actualizarCurso(this.cursoId, this.cursoIndividualData).subscribe({
        next: (response) => {
          this.showMessage('Curso actualizado con éxito', false);
          setTimeout(() => this.router.navigate(['/Departamento Academico/gestionar-cursos']), 1500);
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.directorService.registrarCurso(this.cursoIndividualData).subscribe({
        next: (response) => {
          this.showMessage('Curso registrado con éxito', false);
          setTimeout(() => this.router.navigate(['/Departamento Academico/gestionar-cursos']), 1500);
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  submitFormMultiple(form: NgForm): void {
    // Validar todos los cursos
    for (const curso of this.cursosData) {
      if (!curso.idAsignatura || curso.planDeEstudios.length === 0 ||
          !curso.idEscuela || !curso.idCicloAcademico || !curso.ciclo ||
          !curso.grupo || curso.horarios.length === 0) {
        this.showMessage('Todos los cursos deben tener los datos básicos completos', true);
        return;
      }

      for (const horario of curso.horarios) {
        if (!horario.tipoSesion || !horario.diaSemana || !horario.horaInicio || 
            !horario.horaFin || horario.duracionHoras <= 0) {
          this.showMessage('Todos los horarios deben estar completos y con duración válida', true);
          return;
        }
      }
    }

    this.isLoading = true;
    this.directorService.registrarCursosMultiples(this.cursosData).subscribe({
      next: (response) => {
        this.showMessage(`${this.cursosData.length} cursos registrados con éxito`, false);
        setTimeout(() => this.router.navigate(['/Departamento Academico/gestionar-cursos']), 1500);
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