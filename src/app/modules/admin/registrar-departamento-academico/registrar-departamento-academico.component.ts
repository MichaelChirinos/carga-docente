// registrar-departamento-academico.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DirectorService } from '../services/director.service';  
@Component({
  selector: 'app-registrar-departamento-academico',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registrar-departamento-academico.component.html'
})
export class RegistrarDepartamentoAcademicoComponent implements OnInit {
  departamentoData = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    idEscuela: 0
  };

  escuelas: any[] = [];
  isEditMode = false;
  departamentoId: number | null = null;
  isLoading = false;
  message = '';
  isError = false;

  constructor(
    private directorService: DirectorService, // Para obtener escuelas
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarEscuelas();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.departamentoId = +params['id'];
        this.cargarDepartamentoAcademico(this.departamentoId);
      }
    });
  }

  cargarEscuelas(): void {
    this.directorService.obtenerEscuelas().subscribe({
      next: (response: any) => {
        this.escuelas = response.data || response || [];
      },
      error: (err) => {
        console.error('Error al cargar escuelas:', err);
      }
    });
  }

  cargarDepartamentoAcademico(id: number): void {
    this.isLoading = true;
    this.directorService.obtenerDepartamentoAcademicoPorId(id).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          const departamento = response.data;
          this.departamentoData = {
            email: departamento.usuario.email,
            password: '', // No cargamos la contraseña por seguridad
            nombre: departamento.usuario.nombre,
            apellido: departamento.usuario.apellido,
            idEscuela: 1 // Por defecto, ajustar según tu lógica
          };
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar el departamento académico', true);
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

    if (this.isEditMode && this.departamentoId) {
      // Edición
      this.directorService.actualizarDepartamentoAcademico(this.departamentoId, this.departamentoData).subscribe({
        next: (response: any) => {
          this.showMessage(response.message || 'Departamento académico actualizado con éxito', false);
          setTimeout(() => this.router.navigate(['/Administrador/listar-directores']), 1500);
        },
        error: (err) => {
          this.showMessage('Error: ' + (err.error?.message || 'No se pudo actualizar el departamento académico'), true);
          this.isLoading = false;
        }
      });
    } else {
      // Registro
      this.directorService.registrarDepartamentoAcademico(this.departamentoData).subscribe({
        next: (response: any) => {
          this.showMessage(response.message || 'Departamento académico registrado con éxito', false);
          setTimeout(() => this.router.navigate(['/Administrador/listar-directores']), 1500);
        },
        error: (err) => {
          this.showMessage('Error: ' + (err.error?.message || 'No se pudo registrar el departamento académico'), true);
          this.isLoading = false;
        }
      });
    }
  }

  private validarFormulario(): boolean {
    if (!this.departamentoData.email?.trim()) {
      this.showMessage('El email es obligatorio', true);
      return false;
    }

    if (!this.departamentoData.nombre?.trim()) {
      this.showMessage('El nombre es obligatorio', true);
      return false;
    }

    if (!this.departamentoData.apellido?.trim()) {
      this.showMessage('El apellido es obligatorio', true);
      return false;
    }

    if (!this.departamentoData.idEscuela || this.departamentoData.idEscuela === 0) {
      this.showMessage('Debe seleccionar una escuela', true);
      return false;
    }

    if (!this.isEditMode && !this.departamentoData.password?.trim()) {
      this.showMessage('La contraseña es obligatoria', true);
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.departamentoData.email)) {
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