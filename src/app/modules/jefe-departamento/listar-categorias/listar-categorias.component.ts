// listar-categorias.component.ts
import { Component } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { Categoria } from '../../../core/models/docente.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-categorias',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-categorias.component.html'
})
export class ListarCategoriasComponent {
  categorias: Categoria[] = [];
  loading = true;
  error = '';

  constructor(
    private docenteService: DocenteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.loading = true;
    this.docenteService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar categorías';
        this.loading = false;
        console.error(err);
      }
    });
  }

  editarCategoria(id: number): void {
    this.router.navigate(['/Escuela Profesional/editar-categoria', id]);
  }
}