import { Component } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-planes-estudio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-planes-estudio.component.html'
})
export class ListarPlanesEstudioComponent {
  planes: any[] = [];
  loading = true;
  error = '';

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPlanes();
  }

  cargarPlanes(): void {
    this.loading = true;
    this.directorService.obtenerPlanesEstudio().subscribe({
      next: (response: any) => {
        this.planes = response.data || response; // Dependiendo de la estructura de tu API
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar planes de estudio';
        this.loading = false;
        console.error(err);
      }
    });
  }
}