import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { DocenteListResponse } from '../../../core/models/docente.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // <-- Añadir Router

@Component({
  selector: 'app-listar-docentes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-docentes.component.html'
})
export class ListarDocentesComponent implements OnInit {
  docentes: any[] = [];
  loading = true;
  error = '';

  constructor(
    private docenteService: DocenteService,
    private router: Router // <-- Inyectar Router
  ) {}

  ngOnInit(): void {
    this.loadDocentes();
  }

  loadDocentes(): void {
    this.loading = true;
    this.docenteService.getDocentes().subscribe({
      next: (response) => {
        this.docentes = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los docentes';
        this.loading = false;
        console.error(err);
      }
    });
  }

  editarDocente(id: number): void {
    this.router.navigate(['/director/editar-docente', id]); // <-- Ahora funciona
  }
}