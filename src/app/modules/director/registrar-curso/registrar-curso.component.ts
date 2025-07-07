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
    tipoSesion: 'Teoría',
    diaSemana: 'lunes',
    horaInicio: '08:00',
    horaFin: '10:00',
    aula: '',
    duracionHoras: 2
  };

  asignaturas: any[] = [];
  planesEstudio: any[] = [];
  escuelas: any[] = [];
  ciclosAcademicos: any[] = [];
  tiposSesion = ['Teoría', 'Práctica'];
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
        tipoSesion: 'Teoría',
        diaSemana: 'lunes',
        horaInicio: '08:00:00',
        horaFin: '10:00:00',
        aula: '',
        duracionHoras: 2
      }]
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
    this.cursosData[cursoIndex].cursoHorario.push({
      tipoSesion: 'Teoría',
      diaSemana: 'lunes',
      horaInicio: '08:00:00',
      horaFin: '10:00:00',
      aula: '',
      duracionHoras: 2
    });
  }

  removeHorario(cursoIndex: number, horarioIndex: number) {
    if (this.cursosData[cursoIndex].cursoHorario.length > 1) {
      this.cursosData[cursoIndex].cursoHorario.splice(horarioIndex, 1);
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
          tipoSesion: curso.tipoSesion,
          diaSemana: curso.diaSemana,
          horaInicio: curso.horaInicio.substring(0, 5), // Formato HH:MM
          horaFin: curso.horaFin.substring(0, 5),
          aula: curso.aula,
          duracionHoras: curso.duracionHoras
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
      next: (res) => {
        this.ciclosAcademicos = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando ciclos académicos:', err);
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

  calcularDuracionIndividual() {
    if (this.cursoIndividualData.horaInicio && this.cursoIndividualData.horaFin) {
      const inicio = this.parseTime(this.cursoIndividualData.horaInicio);
      const fin = this.parseTime(this.cursoIndividualData.horaFin);
      
      const diffMs = fin.getTime() - inicio.getTime();
      const diffHours = Math.round((diffMs / (1000 * 60 * 60)) * 10 / 10);
      
      if (diffHours > 0) {
        this.cursoIndividualData.duracionHoras = diffHours;
      } else {
        this.cursoIndividualData.duracionHoras = 0;
      }
    }
  }

  private parseTime(timeString: string): Date {
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
  if (form.invalid) {
    this.showMessage('Por favor complete todos los campos requeridos', true);
    return;
  }

  if (this.cursoIndividualData.duracionHoras <= 0) {
    this.showMessage('La hora de fin debe ser posterior a la hora de inicio', true);
    return;
  }

  this.isLoading = true;

  if (this.isEditing && this.cursoId) {
    // Para edición usamos el formato individual
    this.directorService.actualizarCurso(this.cursoId, this.cursoIndividualData).subscribe({
      next: (response) => {
        this.showMessage('Curso actualizado con éxito', false);
        setTimeout(() => this.router.navigate(['/director/gestionar-cursos']), 1500);
      },
      error: (err) => this.handleError(err)
    });
  } else {
    // Para creación nueva usamos el formato individual
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
          !horario.horaFin || !horario.aula || horario.duracionHoras <= 0) {
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