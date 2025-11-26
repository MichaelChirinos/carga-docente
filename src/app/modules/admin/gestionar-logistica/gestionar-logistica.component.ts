import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DirectorService } from '../services/director.service';
import { LogisticaRequest } from '../../../core/models/logistica.model';

@Component({
  selector: 'app-gestionar-logistica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-logistica.component.html'
})
export class GestionarLogisticaComponent implements OnInit {
  logisticas: any[] = [];
  loading: boolean = true;
  error: string = '';

  showModalRegistrar: boolean = false;
  showModalDetalles: boolean = false;
  showModalEditar: boolean = false;
  showModalEliminar: boolean = false;

  logisticaSeleccionada: any = null;
  logisticaEditando: any = null;
  logisticaEliminando: any = null;

  logisticaData: LogisticaRequest = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    cargo: 'logística de escuela'
  };
  
  isLoadingForm: boolean = false;
  loadingDetalles: boolean = false;
  loadingEdicion: boolean = false;
  loadingEliminacion: boolean = false;
  
  mensaje: string = '';
  errorForm: string = '';

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarLogisticas();
  }

  cargarLogisticas(): void {
    this.loading = true;
    this.directorService.obtenerLogisticas().subscribe({
      next: (response) => {
        this.logisticas = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el personal de logística';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  openModalRegistrar(): void {
    this.showModalRegistrar = true;
    this.mensaje = '';
    this.errorForm = '';
  }

  closeModalRegistrar(): void {
    this.showModalRegistrar = false;
    this.limpiarFormulario();
    this.mensaje = '';
    this.errorForm = '';
  }

  onSubmit(): void {
    if (!this.validarFormulario()) {
      this.errorForm = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.isLoadingForm = true;
    this.errorForm = '';
    this.mensaje = '';

    this.directorService.registrarLogistica(this.logisticaData).subscribe({
      next: (response) => {
        this.mensaje = response.message;
        this.isLoadingForm = false;
        this.limpiarFormulario();
        this.cargarLogisticas(); 
        
        setTimeout(() => {
          this.closeModalRegistrar();
        }, 2000);
      },
      error: (err) => {
        this.errorForm = 'Error al registrar logística: ' + (err.error?.message || '');
        this.isLoadingForm = false;
        console.error('Error:', err);
      }
    });
  }

  verDetalles(logistica: any): void {
    this.loadingDetalles = true;
    this.showModalDetalles = true;
    this.errorForm = '';

    this.directorService.obtenerLogisticaPorId(logistica.idLogistica).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.logisticaSeleccionada = response.data;
        } else {
          this.errorForm = response.message || 'Personal de logística no encontrado';
        }
        this.loadingDetalles = false;
      },
      error: (err) => {
        this.errorForm = 'Error al cargar los detalles';
        this.loadingDetalles = false;
        console.error(err);
      }
    });
  }

  closeModalDetalles(): void {
    this.showModalDetalles = false;
    this.logisticaSeleccionada = null;
  }

  abrirEditar(logistica: any): void {
    this.logisticaEditando = { ...logistica };
    this.showModalEditar = true;
    this.errorForm = '';
  }

  closeModalEditar(): void {
    this.showModalEditar = false;
    this.logisticaEditando = null;
    this.loadingEdicion = false;
  }

  guardarEdicion(): void {
    if (!this.validarFormularioEdicion()) {
      this.errorForm = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.loadingEdicion = true;
    this.errorForm = '';

    const datosActualizacion = {
      email: this.logisticaEditando.usuario.email,
      nombre: this.logisticaEditando.usuario.nombre,
      apellido: this.logisticaEditando.usuario.apellido,
      cargo: this.logisticaEditando.cargo
    };

    this.directorService.actualizarLogistica(this.logisticaEditando.idLogistica, datosActualizacion).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.cargarLogisticas(); 
          this.closeModalEditar();
        } else {
          this.errorForm = response.message || 'Error al actualizar';
        }
        this.loadingEdicion = false;
      },
      error: (err) => {
        this.errorForm = 'Error al actualizar el personal de logística';
        this.loadingEdicion = false;
        console.error(err);
      }
    });
  }

  abrirEliminar(logistica: any): void {
    this.logisticaEliminando = { ...logistica };
    this.showModalEliminar = true;
    this.errorForm = '';
  }

  closeModalEliminar(): void {
    this.showModalEliminar = false;
    this.logisticaEliminando = null;
    this.loadingEliminacion = false;
  }

  confirmarEliminacion(): void {
    this.loadingEliminacion = true;

    this.directorService.eliminarLogistica(this.logisticaEliminando.idLogistica).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.cargarLogisticas(); 
          this.closeModalEliminar();
        } else {
          this.errorForm = response.message || 'Error al eliminar';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.errorForm = 'Error al eliminar el personal de logística';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  private validarFormulario(): boolean {
    return this.logisticaData.email.trim() !== '' &&
           this.logisticaData.password.trim() !== '' &&
           this.logisticaData.nombre.trim() !== '' &&
           this.logisticaData.apellido.trim() !== '' &&
           this.logisticaData.cargo.trim() !== '';
  }

  private validarFormularioEdicion(): boolean {
    return this.logisticaEditando?.usuario?.email?.trim() !== '' &&
           this.logisticaEditando?.usuario?.nombre?.trim() !== '' &&
           this.logisticaEditando?.usuario?.apellido?.trim() !== '' &&
           this.logisticaEditando?.cargo?.trim() !== '';
  }

  private limpiarFormulario(): void {
    this.logisticaData = {
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      cargo: 'logística de escuela'
    };
  }


  getEstadoBadgeClass(enabled: boolean): string {
    return enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  getEstadoText(enabled: boolean): string {
    return enabled ? 'Activo' : 'Inactivo';
  }

  getIniciales(nombre: string, apellido: string): string {
    return (nombre?.charAt(0) || '') + (apellido?.charAt(0) || '');
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }
}