import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AsignacionRequest } from '../../../core/models/asignacion';

@Component({
  selector: 'app-registrar-asignacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registrar-asignacion.component.html'
})
export class RegistrarAsignacionComponent implements OnInit {
  asignacionData: AsignacionRequest = {
    idDocente: 0,
    idCurso: 0,
    idCicloAcademico: 0,
    idCarga: 0
  };

  // Listas para los selects
  docentes: any[] = [];
  cursos: any[] = [];
  ciclosAcademicos: any[] = [];
  cargasAcademicas: any[] = [];

  // Estados
  isLoading = false;
  isLoadingData = false;
  message = '';
  isError = false;

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.isLoadingData = true;

    // Cargar docentes
    this.directorService.obtenerDocentes().subscribe({
      next: (response) => {
        this.docentes = response.data || response || [];
      },
      error: (err) => console.error('Error cargando docentes:', err)
    });

    // Cargar cursos
    this.directorService.obtenerCursos().subscribe({
      next: (response) => {
        this.cursos = response.data || response || [];
      },
      error: (err) => console.error('Error cargando cursos:', err)
    });

    // Cargar ciclos académicos
    this.directorService.obtenerCiclosAcademicos().subscribe({
      next: (response) => {
        this.ciclosAcademicos = response.data || response || [];
        this.isLoadingData = false;
      },
      error: (err) => {
        console.error('Error cargando ciclos académicos:', err);
        this.isLoadingData = false;
      }
    });

    // Cargar cargas académicas
    this.directorService.obtenerCargasAcademicas().subscribe({
      next: (response) => {
        this.cargasAcademicas = response.data || response || [];
      },
      error: (err) => console.error('Error cargando cargas académicas:', err)
    });
  }

  submitForm(): void {
    // Validar que todos los campos estén seleccionados
    if (!this.asignacionData.idDocente || !this.asignacionData.idCurso || 
        !this.asignacionData.idCicloAcademico || !this.asignacionData.idCarga) {
      this.showMessage('Por favor complete todos los campos', true);
      return;
    }

    this.isLoading = true;

    this.directorService.crearAsignacion(this.asignacionData).subscribe({
      next: (response) => {
        this.showMessage('Asignación registrada exitosamente', false);
        setTimeout(() => {
          this.router.navigate(['/director/listar-asignaciones']);
        }, 1500);
      },
      error: (err) => {
        this.showMessage('Error al registrar asignación: ' + (err.error?.message || ''), true);
        this.isLoading = false;
      }
    });
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    this.isLoading = false;
    setTimeout(() => this.message = '', 5000);
  }

  // Método auxiliar para mostrar información del curso
  getCursoInfo(cursoId: number): string {
    const curso = this.cursos.find(c => c.idCurso === cursoId);
    if (!curso) return '';
    return `${curso.asignatura?.nombre} - ${curso.grupo}`;
  }

  // Método auxiliar para mostrar información del docente
  getDocenteInfo(docenteId: number): string {
    const docente = this.docentes.find(d => d.idDocente === docenteId);
    if (!docente) return '';
    return `${docente.usuario?.nombre} ${docente.usuario?.apellido} (${docente.codigo})`;
  }
}