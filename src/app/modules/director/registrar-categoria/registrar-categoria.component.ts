import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { Categoria, CategoriaRequest } from '../../../core/models/docente.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registrar-categoria',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registrar-categoria.component.html',
  styleUrls: ['./registrar-categoria.component.scss']
})
export class RegistrarCategoriaComponent implements OnInit {
  // Modo simple
  categoria: Categoria = {
    idCategoria: 0,
    nombre: '',
    descripcion: '',
    enabled: true
  };

  // Modo múltiple
  categoriasLista: CategoriaRequest[] = [];
  nuevaCategoria: CategoriaRequest = {
    nombre: '',
    descripcion: '',
    enabled: true
  };
  modoMultiple: boolean = false;

  // Estados
  formSubmitted = false;
  isEditing = false;
  isLoading = false;
  message = '';
  isError = false;
  asignaturaId?: number;

  constructor(
    private docenteService: DocenteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.asignaturaId = +id;
      this.cargarCategoria(this.asignaturaId);
    }
  }

  cargarCategoria(id: number): void {
    this.isLoading = true;
    this.docenteService.getCategoriaById(id).subscribe({
      next: (categoria) => {
        this.categoria = {
          idCategoria: categoria.idCategoria,
          nombre: categoria.nombre,
          descripcion: categoria.descripcion || '',
          enabled: categoria.enabled
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar categoría', true);
        this.isLoading = false;
        this.router.navigate(['/director/gestionar-categorias']);
      }
    });
  }

  // Métodos para modo múltiple
  agregarCategoria(): void {
    if (this.nuevaCategoria.nombre.trim()) {
      this.categoriasLista.push({
        nombre: this.nuevaCategoria.nombre.trim(),
        descripcion: this.nuevaCategoria.descripcion?.trim() || null,
        enabled: true
      });
      this.nuevaCategoria = { nombre: '', descripcion: '', enabled: true };
    }
  }

  eliminarCategoria(index: number): void {
    this.categoriasLista.splice(index, 1);
  }

  guardarCategoria() {
    this.formSubmitted = true;

    if (this.modoMultiple) {
      this.guardarMultiplesCategorias();
    } else {
      this.guardarCategoriaIndividual();
    }
  }

  private guardarCategoriaIndividual() {
    if (!this.validarCategoria()) return;

    this.isLoading = true;
    const categoriaData = {
      nombre: this.categoria.nombre,
      descripcion: this.categoria.descripcion || null
    };

    if (this.isEditing && this.asignaturaId) {
      this.docenteService.actualizarCategoria(this.asignaturaId, categoriaData)
        .subscribe({
          next: () => {
            this.showMessage('Categoría actualizada con éxito', false);
            setTimeout(() => this.router.navigate(['/director/gestionar-categorias']), 1500);
          },
          error: (err) => this.handleError(err)
        });
    } else {
      this.docenteService.addCategoria(categoriaData)
        .subscribe({
          next: () => {
            this.showMessage('Categoría registrada con éxito', false);
            setTimeout(() => this.router.navigate(['/director/gestionar-categorias']), 1500);
          },
          error: (err) => this.handleError(err)
        });
    }
  }

  private guardarMultiplesCategorias() {
    if (this.categoriasLista.length === 0) {
      this.showMessage('Debe agregar al menos una categoría', true);
      return;
    }

    this.isLoading = true;
    this.docenteService.registrarCategoriasMultiples(this.categoriasLista)
      .subscribe({
        next: (response) => {
          this.showMessage(response.message || 'Categorías registradas con éxito', false);
          setTimeout(() => this.router.navigate(['/director/gestionar-categorias']), 1500);
        },
        error: (err) => this.handleError(err)
      });
  }

  private validarCategoria(): boolean {
    if (!this.categoria.nombre?.trim()) {
      this.showMessage('El nombre de la categoría es obligatorio', true);
      return false;
    }
    return true;
  }

  private handleError(err: any): void {
    this.showMessage('Error: ' + (err.error?.message || 'Intente nuevamente'), true);
    console.error(err);
    this.isLoading = false;
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    this.isLoading = false;
    setTimeout(() => this.message = '', 5000);
  }
}