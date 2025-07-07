import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../services/director.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DirectorRequest, DirectorResponse } from '../../../core/models/director';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registrar-director',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-director.component.html',
  styleUrls: ['./registrar-director.component.scss']
})
export class RegistrarDirectorComponent implements OnInit {
  directorData: DirectorRequest = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    cargo: 'director de escuela',
    idFacultad: 0
  };

  facultades: any[] = [];
  isLoading = false;
  isEditing = false;
  idDirector: number | null = null;

  constructor(
    private directorService: DirectorService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  // Opción 1: Secuencial
ngOnInit() {
  const params = this.route.snapshot.params;
  if (params['id']) {
    this.isEditing = true;
    this.idDirector = +params['id'];
    this.cargarDirector();
  }
  this.cargarFacultades();
}

cargarDirector(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.isLoading = true;
    this.directorService.obtenerDirectorPorId(this.idDirector!).subscribe({
      next: (response: DirectorResponse) => {
        // Asignar correctamente los datos según la interfaz DirectorResponse
        this.directorData = {
          email: response.data.usuario.email,
          password: '', // No necesitamos la contraseña en edición
          nombre: response.data.usuario.nombre,
          apellido: response.data.usuario.apellido,
          cargo: response.data.cargo,
          idFacultad: response.data.facultad.idFacultad
        };
        this.isLoading = false;
        resolve();
      },
      error: (err) => {
        this.isLoading = false;
        reject(err);
      }
    });
  });
}

  cargarFacultades() {
    this.isLoading = true;
    this.directorService.obtenerFacultades().subscribe({
      next: (response) => {
        this.facultades = response.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar facultades:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (!this.validarFormulario()) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    this.isLoading = true;
    
    if (this.isEditing && this.idDirector) {
      this.actualizarDirector();
    } else {
      this.registrarDirector();
    }
  }

  private registrarDirector(): void {
    this.directorService.registrarDirector(this.directorData).subscribe({
      next: (response) => {
        alert(response.message);
        this.router.navigate(['/admin/listar-directores']);
      },
      error: (err) => {
        alert('Error al registrar director: ' + (err.error?.message || ''));
        console.error(err);
        this.isLoading = false;
      }
    });
  }

// registrar-director.component.ts
actualizarDirector(): void {
    this.isLoading = true;
    this.directorService.actualizarDirector(this.idDirector!, this.directorData)
      .subscribe({
        next: (response) => {
          alert('Director actualizado correctamente'); // Reemplazo simple
          this.isLoading = false;
          this.router.navigate(['/admin/listar-directores']);
        },
        error: (err) => {
          alert('Error al actualizar director: ' + (err.error?.message || '')); // Reemplazo simple
          console.error('Error al actualizar director:', err);
          this.isLoading = false;
        }
      });
  }
  private validarFormulario(): boolean {
    const camposRequeridos = this.isEditing ? 
      ['email', 'nombre', 'apellido', 'idFacultad'] : 
      ['email', 'password', 'nombre', 'apellido', 'idFacultad'];
    
    return camposRequeridos.every(field => {
      const value = this.directorData[field as keyof DirectorRequest];
      return typeof value === 'string' ? value.trim() !== '' : value > 0;
    });
  }
}