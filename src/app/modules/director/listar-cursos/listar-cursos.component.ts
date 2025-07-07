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
  loading = true;
  error = '';

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCiclosAcademicos();
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

  editarCurso(id: number): void {
    this.router.navigate(['/director/editar-curso', id]);
  }

  getDiaNombre(dia: string): string {
    const diasMap: Record<string, string> = {
      'lunes': 'Lunes',
      'martes': 'Martes',
      'miércoles': 'Miércoles',
      'jueves': 'Jueves',
      'viernes': 'Viernes',
      'sábado': 'Sábado'
    };
    return diasMap[dia] || dia;
  }

  // Método para formatear la hora (elimina segundos si existen)
  formatHora(hora: string): string {
    return hora.substring(0, 5);
  }
}