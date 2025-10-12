// registrar-director.component.ts
import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../services/director.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectorRequest } from '../../../core/models/director';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registrar-director',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registrar-director.component.html'
})
export class RegistrarDirectorComponent implements OnInit {
  directorData: DirectorRequest = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    idEscuela: 0  // Cambiado de 'cargo' a 'idEscuela'
  };

  // Agregar lista de escuelas
  escuelas: any[] = [];
  
  isLoading = false;
  isEditing = false;
  idDirector: number | null = null;
  errorMessage = '';
  isLoadingData = false;

  constructor(
    private directorService: DirectorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cargarEscuelas();
    
    const params = this.route.snapshot.params;
    if (params['id']) {
      this.isEditing = true;
      this.idDirector = +params['id'];
      this.cargarDirector();
    }
  }

  cargarEscuelas(): void {
    this.isLoadingData = true;
    this.directorService.obtenerEscuelas().subscribe({
      next: (response: any) => {
        this.escuelas = response.data || response || [];
        this.isLoadingData = false;
      },
      error: (err) => {
        console.error('Error cargando escuelas:', err);
        this.isLoadingData = false;
      }
    });
  }

  cargarDirector(): void {
    this.isLoading = true;
    this.directorService.obtenerDirectorPorId(this.idDirector!).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.directorData = {
            email: response.data.usuario.email,
            password: '', // No se carga la contraseña en edición
            nombre: response.data.usuario.nombre,
            apellido: response.data.usuario.apellido,
            idEscuela: response.data.escuela?.idEscuela || 0
          };
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar director';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (!this.validarFormulario()) {
      this.errorMessage = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    if (this.isEditing && this.idDirector) {
      this.actualizarDirector();
    } else {
      this.registrarDirector();
    }
  }

  private registrarDirector(): void {
    this.directorService.registrarDirector(this.directorData).subscribe({
      next: (response: any) => {
        if (response.status === 201) {
          this.router.navigate(['/admin/listar-directores']); 
        } else {
          this.errorMessage = response.message || 'Error al registrar director';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error: ' + (err.error?.message || 'No se pudo registrar el director');
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  actualizarDirector(): void {
    this.directorService.actualizarDirector(this.idDirector!, this.directorData)
      .subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.router.navigate(['/admin/listar-directores']); 
          } else {
            this.errorMessage = response.message || 'Error al actualizar director';
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Error: ' + (err.error?.message || 'No se pudo actualizar el director');
          this.isLoading = false;
          console.error('Error al actualizar director:', err);
        }
      });
  }

  private validarFormulario(): boolean {
    // Validación básica
    if (!this.directorData.email?.trim() || 
        !this.directorData.nombre?.trim() || 
        !this.directorData.apellido?.trim() ||
        !this.directorData.idEscuela) {
      return false;
    }

    // Solo validar password si no está editando
    if (!this.isEditing && !this.directorData.password?.trim()) {
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.directorData.email)) {
      this.errorMessage = 'Por favor ingrese un email válido';
      return false;
    }

    return true;
  }

  // Método auxiliar para obtener nombre de escuela
  getNombreEscuela(idEscuela: number): string {
    const escuela = this.escuelas.find(e => e.idEscuela === idEscuela);
    return escuela ? escuela.nombre : 'Escuela no encontrada';
  }
}