// listar-escuelas.component.ts
import { Component } from '@angular/core';
import { DirectorService } from '../services/director.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-escuelas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-escuelas.component.html'
})
export class ListarEscuelasComponent {
  escuelas: any[] = [];
  loading = true;
  error = '';

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEscuelas();
  }

  cargarEscuelas(): void {
    this.loading = true;
    this.directorService.obtenerEscuelas().subscribe({
      next: (response: any) => {
        this.escuelas = response.data || response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar escuelas';
        this.loading = false;
        console.error(err);
      }
    });
  }

  editarEscuela(id: number): void {
    this.router.navigate(['/admin/editar-escuela', id]);
  }
}