// registrar-asignacion.component.ts
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
  isLoadingCursos = false;
  isLoadingCargas = false;
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

    // Cargar ciclos académicos
    this.directorService.obtenerCiclosAcademicos().subscribe({
      next: (response: any) => {
        const ciclos = response.data || response || [];
        this.ciclosAcademicos = ciclos;
        
        // Seleccionar ciclo activo por defecto si existe
        const cicloActivo = ciclos.find((ciclo: any) => ciclo.enabled);
        if (cicloActivo) {
          this.asignacionData.idCicloAcademico = cicloActivo.idCicloAcademico;
          this.cargarCursos();
          this.cargarCargasAcademicas();
        }
        
        this.isLoadingData = false;
      },
      error: (err) => {
        console.error('Error cargando ciclos académicos:', err);
        this.showMessage('Error al cargar ciclos académicos', true);
        this.isLoadingData = false;
      }
    });
  }

  onCicloChange(): void {
    if (this.asignacionData.idCicloAcademico) {
      this.cargarCursos();
      this.cargarCargasAcademicas();
    } else {
      this.cursos = [];
      this.cargasAcademicas = [];
      this.asignacionData.idCurso = 0;
      this.asignacionData.idCarga = 0;
    }
  }

  cargarCursos(): void {
    if (!this.asignacionData.idCicloAcademico) return;

    this.isLoadingCursos = true;
    this.cursos = [];
    this.asignacionData.idCurso = 0;

    this.directorService.obtenerCursosPorCicloAcademico(this.asignacionData.idCicloAcademico).subscribe({
      next: (response: any) => {
        this.cursos = response.data || response || [];
        this.isLoadingCursos = false;
        
        if (this.cursos.length === 0) {
          this.showMessage('No hay cursos disponibles para el ciclo académico seleccionado', false);
        }
      },
      error: (err) => {
        console.error('Error cargando cursos:', err);
        this.showMessage('Error al cargar cursos', true);
        this.isLoadingCursos = false;
      }
    });
  }

  cargarCargasAcademicas(): void {
    if (!this.asignacionData.idCicloAcademico) return;

    this.isLoadingCargas = true;
    this.cargasAcademicas = [];
    this.asignacionData.idCarga = 0;

    this.directorService.obtenerCargasAcademicasPorCiclo(this.asignacionData.idCicloAcademico).subscribe({
      next: (response: any) => {
        this.cargasAcademicas = response.data || response || [];
        this.isLoadingCargas = false;
        
        if (this.cargasAcademicas.length === 0) {
          this.showMessage('No hay cargas académicas disponibles para el ciclo académico seleccionado', false);
        }
      },
      error: (err) => {
        console.error('Error cargando cargas académicas:', err);
        this.showMessage('Error al cargar cargas académicas', true);
        this.isLoadingCargas = false;
      }
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
          this.router.navigate(['/Departamento Academico/listar-asignaciones']);
        }, 1500);
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.error?.data?.[0]?.message || 'Error al registrar asignación';
        this.showMessage(errorMessage, true);
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
    return `${curso.asignatura?.nombre} - ${curso.grupo || 'Sin grupo'} (${curso.codigo || 'Sin código'})`;
  }

  // Método auxiliar para mostrar información del docente
  getDocenteInfo(docenteId: number): string {
    const docente = this.docentes.find(d => d.idDocente === docenteId);
    if (!docente) return '';
    return `${docente.usuario?.nombre} ${docente.usuario?.apellido} (${docente.codigo})`;
  }

  // Método auxiliar para mostrar información del ciclo académico
  getCicloInfo(cicloId: number): string {
    const ciclo = this.ciclosAcademicos.find(c => c.idCicloAcademico === cicloId);
    if (!ciclo) return '';
    return ciclo.nombre;
  }

  // Método auxiliar para mostrar información de la carga académica
  getCargaInfo(cargaId: number): string {
    const carga = this.cargasAcademicas.find(c => c.idCarga === cargaId);
    if (!carga) return '';
    return carga.nombre || `Carga ${carga.idCarga}`;
  }
}