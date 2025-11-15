import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { Categoria, CategoriaRequest } from '../../../core/models/docente.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registrar-categoria',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule], // Agregar RouterModule
  templateUrl: './registrar-categoria.component.html'
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
  categoriaId?: number;

  constructor(
    private docenteService: DocenteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.categoriaId = +id;
      this.cargarCategoria(this.categoriaId);
    }
  }

  cargarCategoria(id: number): void {
    this.isLoading = true;
    this.docenteService.getCategoriaById(id).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.categoria = {
            idCategoria: response.data.idCategoria,
            nombre: response.data.nombre,
            descripcion: response.data.descripcion || '',
            enabled: response.data.enabled
          };
        } else {
          this.showMessage(response.message || 'Error al cargar categoría', true);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar categoría: ' + (err.error?.message || ''), true);
        this.isLoading = false;
        this.router.navigate(['/Escuela Profesional/gestionar-categorias']);
      }
    });
  }

  // Métodos para modo múltiple
agregarCategoria(): void {
  if (this.nuevaCategoria.nombre.trim()) {
    this.categoriasLista.push({
      nombre: this.nuevaCategoria.nombre.trim(),
      descripcion: this.nuevaCategoria.descripcion?.trim() || null,
      enabled: true  // Asegurar que siempre sea true
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
    const categoriaData: CategoriaRequest = {
      nombre: this.categoria.nombre.trim(),
      descripcion: this.categoria.descripcion?.trim() || null,
      enabled: this.categoria.enabled
    };

    if (this.isEditing && this.categoriaId) {
      this.docenteService.actualizarCategoria(this.categoriaId, categoriaData)
        .subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              this.showMessage('Categoría actualizada con éxito', false);
              setTimeout(() => this.router.navigate(['/Escuela Profesional/gestionar-categorias']), 1500);
            } else {
              this.showMessage(response.message || 'Error al actualizar categoría', true);
            }
          },
          error: (err) => this.handleError(err)
        });
    } else {
      this.docenteService.addCategoria(categoriaData)
        .subscribe({
          next: (response: any) => {
            if (response.status === 201) {
              this.showMessage('Categoría registrada con éxito', false);
              setTimeout(() => this.router.navigate(['/Escuela Profesional/gestionar-categorias']), 1500);
            } else {
              this.showMessage(response.message || 'Error al registrar categoría', true);
            }
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

  // Asegurarnos de que todas las categorías tengan enabled: true
  const categoriasParaEnviar = this.categoriasLista.map(categoria => ({
    ...categoria,
    enabled: true  // Forzar enabled: true para todas
  }));

  this.isLoading = true;
  this.docenteService.registrarCategoriasMultiples(categoriasParaEnviar)
    .subscribe({
      next: (response: any) => {
        if (response.status === 201) {
          this.showMessage('Categorías registradas con éxito', false);
          setTimeout(() => this.router.navigate(['/Escuela Profesional/gestionar-categorias']), 1500);
        } else {
          this.showMessage(response.message || 'Error al registrar categorías', true);
        }
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
    const errorMessage = err.error?.message || err.message || 'Error de conexión';
    this.showMessage('Error: ' + errorMessage, true);
    console.error('Error:', err);
    this.isLoading = false;
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    this.isLoading = false;
    setTimeout(() => this.message = '', 5000);
  }

  // Método para limpiar el formulario
  limpiarFormulario(): void {
    this.categoria = {
      idCategoria: 0,
      nombre: '',
      descripcion: '',
      enabled: true
    };
    this.categoriasLista = [];
    this.nuevaCategoria = { nombre: '', descripcion: '', enabled: true };
    this.formSubmitted = false;
  }
}