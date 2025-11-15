import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AsignaturaRequest } from '../../../core/models/asignatura';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registrar-asignatura',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-asignatura.component.html',
  styleUrls: ['./registrar-asignatura.component.scss']
})
export class RegistrarAsignaturaComponent implements OnInit {
  asignaturaData: AsignaturaRequest = {
    nombre: ''
  };
  asignaturasLista: AsignaturaRequest[] = []; // Para almacenar múltiples asignaturas
  nuevaAsignatura: string = ''; // Para el input de múltiples asignaturas
  isEditing = false;
  asignaturaId?: number;
  modoMultiple: boolean = false; // Para alternar entre modos

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
      this.asignaturaId = +id;
      this.cargarAsignatura(this.asignaturaId);
    }
  }

  cargarAsignatura(id: number): void {
    this.isLoading = true;
    this.directorService.obtenerAsignaturaById(id).subscribe({
      next: (response: any) => {
        const asignatura = response.data || response;
        this.asignaturaData = {
          nombre: asignatura.nombre
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar asignatura', true);
        this.isLoading = false;
        this.router.navigate(['/Departamento Academico/gestionar-asignaturas']);
      }
    });
  }

  agregarAsignatura(): void {
    if (this.nuevaAsignatura.trim()) {
      this.asignaturasLista.push({ nombre: this.nuevaAsignatura.trim() });
      this.nuevaAsignatura = '';
    }
  }

  eliminarAsignatura(index: number): void {
    this.asignaturasLista.splice(index, 1);
  }

  submitForm(form: NgForm): void {
    this.formSubmitted = true;
    
    if (this.modoMultiple) {
      if (this.asignaturasLista.length === 0) {
        this.showMessage('Debe agregar al menos una asignatura', true);
        return;
      }
    } else {
      if (form.invalid) return;
    }

    this.isLoading = true;

    if (this.isEditing && this.asignaturaId) {
      this.directorService.actualizarAsignatura(this.asignaturaId, this.asignaturaData).subscribe({
        next: (response) => {
          this.showMessage('Asignatura actualizada con éxito', false);
          setTimeout(() => this.router.navigate(['/Departamento Academico/gestionar-asignaturas']), 1500);
        },
        error: (err) => this.handleError(err)
      });
    } else {
      if (this.modoMultiple) {
        this.directorService.registrarAsignaturas(this.asignaturasLista).subscribe({
          next: (response) => {
            this.showMessage(`${response.message}`, false);
            setTimeout(() => this.router.navigate(['/Departamento Academico/gestionar-asignaturas']), 1500);
          },
          error: (err) => this.handleError(err)
        });
      } else {
        this.directorService.registrarAsignatura(this.asignaturaData).subscribe({
          next: (response) => {
            this.showMessage('Asignatura registrada con éxito', false);
            setTimeout(() => this.router.navigate(['/Departamento Academico/gestionar-asignaturas']), 1500);
          },
          error: (err) => this.handleError(err)
        });
      }
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