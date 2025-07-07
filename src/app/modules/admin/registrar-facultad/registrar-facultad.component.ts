// registrar-facultad.component.ts
import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../services/director.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FacultadRequest } from '../../../core/models/facultad';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registrar-facultad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-facultad.component.html',
  styleUrls: ['./registrar-facultad.component.scss']
})
export class RegistrarFacultadComponent implements OnInit {
  facultadData: FacultadRequest = {
    nombre: ''
  };
  isEditing = false;
  facultadId?: number;

  isLoading = false;
  message = '';
  isError = false;
  formSubmitted = false;

  constructor(
    private directorService: DirectorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.facultadId = +id;
      this.cargarFacultad(this.facultadId);
    }
  }

  cargarFacultad(id: number): void {
    this.isLoading = true;
    this.directorService.obtenerFacultadById(id).subscribe({
      next: (response: any) => {
        const facultad = response.data || response;
        this.facultadData = {
          nombre: facultad.nombre
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar facultad', true);
        this.isLoading = false;
        this.router.navigate(['/admin/gestionar-facultades']);
      }
    });
  }

  submitForm(form: NgForm): void {
    this.formSubmitted = true;
    if (form.invalid) return;

    this.isLoading = true;

    if (this.isEditing && this.facultadId) {
      this.directorService.actualizarFacultad(this.facultadId, this.facultadData).subscribe({
        next: (response) => {
          this.showMessage('Facultad actualizada con éxito', false);
          setTimeout(() => this.router.navigate(['/admin/gestionar-facultades']), 1500);
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.directorService.crearFacultad(this.facultadData).subscribe({
        next: (response) => {
          this.showMessage('Facultad registrada con éxito', false);
          setTimeout(() => this.router.navigate(['/admin/gestionar-facultades']), 1500);
        },
        error: (err) => this.handleError(err)
      });
    }
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
    setTimeout(() => this.message = '', 3000);
  }
}