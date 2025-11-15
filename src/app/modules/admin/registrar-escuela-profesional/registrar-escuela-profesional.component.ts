// registrar-escuela-profesional.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DirectorService } from '../services/director.service';

@Component({
  selector: 'app-registrar-escuela-profesional',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registrar-escuela-profesional.component.html'
})
export class RegistrarEscuelaProfesionalComponent implements OnInit {
  escuelaData = {
    email: '',
    password: '',
    nombre: '',
    apellido: ''
  };

  isEditMode = false;
  escuelaId: number | null = null;
  isLoading = false;
  message = '';
  isError = false;

  constructor(
    private directorService: DirectorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.escuelaId = +params['id'];
        this.cargarEscuelaProfesional(this.escuelaId);
      }
    });
  }

  cargarEscuelaProfesional(id: number): void {
    this.isLoading = true;
    this.directorService.obtenerEscuelaProfesionalPorId(id).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          const escuela = response.data;
          this.escuelaData = {
            email: escuela.usuario.email,
            password: '', // No cargamos la contraseña por seguridad
            nombre: escuela.usuario.nombre,
            apellido: escuela.usuario.apellido
          };
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar la escuela profesional', true);
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.isLoading = true;

    if (this.isEditMode && this.escuelaId) {
      // Edición
      this.directorService.actualizarEscuelaProfesional(this.escuelaId, this.escuelaData).subscribe({
        next: (response: any) => {
          this.showMessage(response.message || 'Escuela profesional actualizada con éxito', false);
          setTimeout(() => this.router.navigate(['/Administrador/gestionar-escuelas-profesionales']), 1500);
        },
        error: (err) => {
          this.showMessage('Error: ' + (err.error?.message || 'No se pudo actualizar la escuela profesional'), true);
          this.isLoading = false;
        }
      });
    } else {
      // Registro
      this.directorService.registrarEscuelaProfesional(this.escuelaData).subscribe({
        next: (response: any) => {
          this.showMessage(response.message || 'Escuela profesional registrada con éxito', false);
          setTimeout(() => this.router.navigate(['/Administrador/gestionar-escuelas-profesionales']), 1500);
        },
        error: (err) => {
          this.showMessage('Error: ' + (err.error?.message || 'No se pudo registrar la escuela profesional'), true);
          this.isLoading = false;
        }
      });
    }
  }

  private validarFormulario(): boolean {
    if (!this.escuelaData.email?.trim()) {
      this.showMessage('El email es obligatorio', true);
      return false;
    }

    if (!this.escuelaData.nombre?.trim()) {
      this.showMessage('El nombre es obligatorio', true);
      return false;
    }

    if (!this.escuelaData.apellido?.trim()) {
      this.showMessage('El apellido es obligatorio', true);
      return false;
    }

    if (!this.isEditMode && !this.escuelaData.password?.trim()) {
      this.showMessage('La contraseña es obligatoria', true);
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.escuelaData.email)) {
      this.showMessage('El formato del email no es válido', true);
      return false;
    }

    return true;
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}