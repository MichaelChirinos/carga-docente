// listar-facultades.component.ts
import { Component } from '@angular/core';
import { DirectorService } from '../services/director.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-facultades',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-facultades.component.html'
})
export class ListarFacultadesComponent {
  facultades: any[] = [];
  loading = true;
  error = '';

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarFacultades();
  }

  cargarFacultades(): void {
    this.loading = true;
    this.directorService.obtenerFacultades().subscribe({
      next: (response: any) => {
        this.facultades = response.data || response;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar facultades';
        this.loading = false;
        console.error(err);
      }
    });
  }

  editarFacultad(id: number): void {
    this.router.navigate(['/admin/editar-facultad', id]);
  }
}