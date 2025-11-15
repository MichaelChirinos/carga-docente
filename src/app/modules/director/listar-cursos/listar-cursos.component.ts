import { Component, OnInit } from '@angular/core';
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
export class ListarCursosComponent implements OnInit {
  cursos: any[] = [];
  ciclosAcademicos: any[] = [];
  cicloAcademicoSeleccionado: number = 0;
  
  cursoSeleccionado: any = null;
  cursoEditando: any = null;
  cursoEliminando: any = null;
  
  loading = false;
  loadingCiclos = false;
  loadingDetalle = false;
  loadingEdicion = false;
  loadingEliminacion = false;
  
  error = '';
  mostrarModalDetalle = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCiclosAcademicos();
  }

  cargarCiclosAcademicos(): void {
    this.loadingCiclos = true;
    this.directorService.obtenerCiclosAcademicos().subscribe({
      next: (response: any) => {
        this.ciclosAcademicos = response.data || response;
        this.loadingCiclos = false;
        // Seleccionar el primer ciclo académico activo por defecto
        const cicloActivo = this.ciclosAcademicos.find((c: any) => c.enabled);
        if (cicloActivo) {
          this.cicloAcademicoSeleccionado = cicloActivo.idCicloAcademico;
          this.cargarCursos();
        }
      },
      error: (err) => {
        this.error = 'Error al cargar ciclos académicos';
        this.loadingCiclos = false;
        console.error(err);
      }
    });
  }

  cargarCursos(): void {
    if (!this.cicloAcademicoSeleccionado) {
      this.cursos = [];
      return;
    }

    this.loading = true;
    this.directorService.obtenerCursosPorCicloAcademico(this.cicloAcademicoSeleccionado).subscribe({
      next: (response: any) => {
        this.cursos = response.data || response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar cursos';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onCicloAcademicoChange(): void {
    this.cargarCursos();
  }

  // Ver detalles del curso
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

  // Abrir modal para editar
  abrirEditar(curso: any): void {
    this.cursoEditando = { ...curso };
    this.mostrarModalEditar = true;
    this.error = '';
  }

  // Guardar cambios de edición
  guardarEdicion(): void {
    if (!this.cursoEditando) return;

    this.loadingEdicion = true;
    this.error = '';

    const datosActualizacion = {
      idAsignatura: this.cursoEditando.asignatura.idAsignatura,
      planDeEstudios: this.cursoEditando.planDeEstudios,
      idEscuela: this.cursoEditando.escuela.idEscuela,
      idCicloAcademico: this.cursoEditando.cicloAcademico.idCicloAcademico,
      ciclo: this.cursoEditando.ciclo,
      grupo: this.cursoEditando.grupo
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

  // Abrir modal para eliminar
  abrirEliminar(curso: any): void {
    this.cursoEliminando = { ...curso };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  // Confirmar eliminación
  confirmarEliminacion(): void {
    if (!this.cursoEliminando) return;

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

  // Cerrar modales
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

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.cursoEliminando = null;
    this.loadingEliminacion = false;
    this.error = '';
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }

  // Helper para mostrar planes de estudios como string
  getPlanesEstudiosString(planes: string[]): string {
    return planes.join(', ');
  }

  // Helper para mostrar horarios resumidos
  getHorariosResumidos(horarios: any[]): string {
    if (!horarios || horarios.length === 0) return 'Sin horarios';
    
    return horarios.map(h => 
      `${h.diaSemana} ${h.horaInicio}-${h.horaFin}`
    ).join(', ');
  }

  // Helper para contar horarios
  contarHorarios(horarios: any[]): number {
    return horarios ? horarios.length : 0;
  }
}