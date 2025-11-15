import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { Dedicacion, DedicacionRequest } from '../../../core/models/docente.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registrar-dedicacion',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './registrar-dedicacion.component.html'
})
export class RegistrarDedicacionComponent implements OnInit {
  // Modo individual
  dedicacion: DedicacionRequest = {
    nombre: '',
    horasTotales: 0,
    horasMinLectivas: 0,
    horasMaxLectivas: 0,
    enabled: true
  };

  // Modo múltiple
  dedicacionesLista: DedicacionRequest[] = [];
  nuevaDedicacion: DedicacionRequest = {
    nombre: '',
    horasTotales: 0,
    horasMinLectivas: 0,
    horasMaxLectivas: 0,
    enabled: true
  };
  modoMultiple: boolean = true; // Por defecto en modo múltiple según tu HTML

  // Estados compartidos
  formSubmitted = false;
  isEditing = false;
  isLoading = false;
  message = '';
  isError = false;
  idDedicacion?: number;

  constructor(
    private docenteService: DocenteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.idDedicacion = +id;
      this.cargarDedicacion(this.idDedicacion);
    }
  }

  cargarDedicacion(id: number): void {
    this.isLoading = true;
    this.docenteService.getDedicacionById(id).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.dedicacion = {
            nombre: response.data.nombre,
            horasTotales: response.data.horasTotales,
            horasMinLectivas: response.data.horasMinLectivas,
            horasMaxLectivas: response.data.horasMaxLectivas,
            enabled: response.data.enabled
          };
        } else {
          this.showMessage(response.message || 'Error al cargar dedicación', true);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar dedicación: ' + (err.error?.message || ''), true);
        this.isLoading = false;
        this.router.navigate(['/Escuela Profesional/gestionar-dedicaciones']);
      }
    });
  }

  agregarDedicacion(): void {
    if (this.validarDedicacion(this.nuevaDedicacion)) {
      this.dedicacionesLista.push({
        nombre: this.nuevaDedicacion.nombre.trim(),
        horasTotales: Number(this.nuevaDedicacion.horasTotales),
        horasMinLectivas: Number(this.nuevaDedicacion.horasMinLectivas),
        horasMaxLectivas: Number(this.nuevaDedicacion.horasMaxLectivas),
        enabled: true
      });
      this.nuevaDedicacion = { 
        nombre: '', 
        horasTotales: 0, 
        horasMinLectivas: 0,
        horasMaxLectivas: 0,
        enabled: true 
      };
    }
  }

  eliminarDedicacion(index: number): void {
    this.dedicacionesLista.splice(index, 1);
  }

  guardarDedicacion() {
    this.formSubmitted = true;

    if (this.modoMultiple) {
      this.guardarMultiplesDedicaciones();
    } else {
      this.guardarDedicacionIndividual();
    }
  }

  private guardarDedicacionIndividual() {
    if (!this.validarDedicacion(this.dedicacion)) return;

    this.isLoading = true;
    const dedicacionData: DedicacionRequest = {
      nombre: this.dedicacion.nombre.trim(),
      horasTotales: Number(this.dedicacion.horasTotales),
      horasMinLectivas: Number(this.dedicacion.horasMinLectivas),
      horasMaxLectivas: Number(this.dedicacion.horasMaxLectivas),
      enabled: this.dedicacion.enabled
    };

    if (this.isEditing && this.idDedicacion) {
      this.docenteService.actualizarDedicacion(this.idDedicacion, dedicacionData)
        .subscribe({
          next: (response: any) => {
            if (response.status === 200) {
              this.showMessage('Dedicación actualizada con éxito', false);
              setTimeout(() => this.router.navigate(['/Escuela Profesional/gestionar-dedicaciones']), 1500);
            } else {
              this.showMessage(response.message || 'Error al actualizar dedicación', true);
            }
          },
          error: (err) => this.handleError(err)
        });
    } else {
      this.docenteService.addDedicacion(dedicacionData)
        .subscribe({
          next: (response: any) => {
            if (response.status === 201) {
              this.showMessage('Dedicación registrada con éxito', false);
              setTimeout(() => this.router.navigate(['/Escuela Profesional/gestionar-dedicaciones']), 1500);
            } else {
              this.showMessage(response.message || 'Error al registrar dedicación', true);
            }
          },
          error: (err) => this.handleError(err)
        });
    }
  }

  private guardarMultiplesDedicaciones() {
    if (this.dedicacionesLista.length === 0) {
      this.showMessage('Debe agregar al menos una dedicación', true);
      return;
    }

    this.isLoading = true;
    
    // Asegurar que todas tengan enabled: true
    const dedicacionesParaEnviar = this.dedicacionesLista.map(dedicacion => ({
      ...dedicacion,
      enabled: true
    }));

    this.docenteService.registrarDedicacionesMultiples(dedicacionesParaEnviar)
      .subscribe({
        next: (response: any) => {
          if (response.status === 201) {
            this.showMessage('Dedicaciones registradas con éxito', false);
            setTimeout(() => this.router.navigate(['/Escuela Profesional/gestionar-dedicaciones']), 1500);
          } else {
            this.showMessage(response.message || 'Error al registrar dedicaciones', true);
          }
        },
        error: (err) => this.handleError(err)
      });
  }

  private validarDedicacion(dedicacion: DedicacionRequest): boolean {
    if (!dedicacion.nombre?.trim()) {
      this.showMessage('El nombre de la dedicación es obligatorio', true);
      return false;
    }
    if (dedicacion.horasTotales <= 0) {
      this.showMessage('Las horas totales deben ser mayores a 0', true);
      return false;
    }
    if (dedicacion.horasMinLectivas <= 0) {
      this.showMessage('Las horas mínimas lectivas deben ser mayores a 0', true);
      return false;
    }
    if (dedicacion.horasMaxLectivas <= 0) {
      this.showMessage('Las horas máximas lectivas deben ser mayores a 0', true);
      return false;
    }
    if (dedicacion.horasMinLectivas > dedicacion.horasTotales) {
      this.showMessage('Las horas mínimas lectivas no pueden ser mayores que las horas totales', true);
      return false;
    }
    if (dedicacion.horasMaxLectivas > dedicacion.horasTotales) {
      this.showMessage('Las horas máximas lectivas no pueden ser mayores que las horas totales', true);
      return false;
    }
    if (dedicacion.horasMinLectivas > dedicacion.horasMaxLectivas) {
      this.showMessage('Las horas mínimas lectivas no pueden ser mayores que las horas máximas lectivas', true);
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

  // Método público para registrar desde el HTML
  registrarDedicaciones(): void {
    this.guardarMultiplesDedicaciones();
  }
}