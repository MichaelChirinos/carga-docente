import { Component } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-asignaturas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-asignaturas.component.html'
})
export class ListarAsignaturasComponent {
  asignaturas: any[] = [];
  loading = true;
  error = '';

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarAsignaturas();
  }

  cargarAsignaturas(): void {
    this.loading = true;
    this.directorService.obtenerAsignaturas().subscribe({
      next: (response: any) => {
        this.asignaturas = response.data || response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar asignaturas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  editarAsignatura(id: number): void {
    this.router.navigate(['/director/editar-asignatura', id]);
  }
}