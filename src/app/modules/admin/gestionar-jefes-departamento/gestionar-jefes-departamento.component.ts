import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JefeDepartamentoRequest, JefeDepartamentoResponse } from '../../../core/models/jefe-departamento.model';
import { DirectorService } from '../services/director.service';

@Component({
  selector: 'app-gestionar-jefes-departamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-jefes-departamento.component.html'
})
export class GestionarJefesDepartamentoComponent implements OnInit {
  jefesDepartamento: JefeDepartamentoResponse[] = [];
  loading = false;
  error = '';

  showModalRegistrar = false;
  showModalDetalles = false;
  showModalEditar = false;
  showModalEliminar = false;
  
  jefeSeleccionado: any = null;
  jefeEditando: any = null;
  jefeEliminando: any = null;

  jefeData: JefeDepartamentoRequest = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    cargo: 'jefe de departamento de escuela de ciencias de la computación'
  };

  isLoadingForm = false;
  loadingDetalles = false;
  loadingEdicion = false;
  loadingEliminacion = false;
  mensaje = '';
  errorForm = '';

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarJefesDepartamento();
  }

  cargarJefesDepartamento() {
    this.loading = true;
    this.error = '';

    this.directorService.obtenerJefesDepartamento().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 200) {
          this.jefesDepartamento = response.data;
        } else {
          this.error = response.message || 'Error al cargar los jefes de departamento';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error de conexión: ' + (err.error?.message || '');
        console.error('Error:', err);
      }
    });
  }

  openModalRegistrar() {
    this.showModalRegistrar = true;
    this.mensaje = '';
    this.errorForm = '';
    this.limpiarFormulario();
  }

  closeModalRegistrar() {
    this.showModalRegistrar = false;
    this.isLoadingForm = false;
    this.mensaje = '';
    this.errorForm = '';
  }

  verDetalles(jefe: any) {
    this.loadingDetalles = true;
    this.showModalDetalles = true;
    this.errorForm = '';

    this.directorService.obtenerJefeDepartamentoPorId(jefe.idJefeDepartamento).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.jefeSeleccionado = response.data;
        } else {
          this.errorForm = response.message || 'Jefe de departamento no encontrado';
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

  closeModalDetalles() {
    this.showModalDetalles = false;
    this.jefeSeleccionado = null;
  }

  abrirEditar(jefe: any) {
    this.jefeEditando = { ...jefe };
    this.showModalEditar = true;
    this.errorForm = '';
  }

  closeModalEditar() {
    this.showModalEditar = false;
    this.jefeEditando = null;
    this.loadingEdicion = false;
  }

  guardarEdicion() {
    if (!this.validarFormularioEdicion()) {
      this.errorForm = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.loadingEdicion = true;
    this.errorForm = '';

    const datosActualizacion = {
      email: this.jefeEditando.usuario.email,
      nombre: this.jefeEditando.usuario.nombre,
      apellido: this.jefeEditando.usuario.apellido,
      cargo: this.jefeEditando.cargo
    };

    this.directorService.actualizarJefeDepartamento(this.jefeEditando.idJefeDepartamento, datosActualizacion).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.cargarJefesDepartamento();
          this.closeModalEditar();
        } else {
          this.errorForm = response.message || 'Error al actualizar';
        }
        this.loadingEdicion = false;
      },
      error: (err) => {
        this.errorForm = 'Error al actualizar el jefe de departamento';
        this.loadingEdicion = false;
        console.error(err);
      }
    });
  }

  abrirEliminar(jefe: any) {
    this.jefeEliminando = { ...jefe };
    this.showModalEliminar = true;
    this.errorForm = '';
  }

  closeModalEliminar() {
    this.showModalEliminar = false;
    this.jefeEliminando = null;
    this.loadingEliminacion = false;
  }

  confirmarEliminacion() {
    this.loadingEliminacion = true;

    this.directorService.eliminarJefeDepartamento(this.jefeEliminando.idJefeDepartamento).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.cargarJefesDepartamento(); 
          this.closeModalEliminar();
        } else {
          this.errorForm = response.message || 'Error al eliminar';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.errorForm = 'Error al eliminar el jefe de departamento';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (!this.validarFormulario()) {
      this.errorForm = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.isLoadingForm = true;
    this.errorForm = '';
    this.mensaje = '';

    this.directorService.registrarJefeDepartamento(this.jefeData).subscribe({
      next: (response) => {
        this.mensaje = response.message;
        this.isLoadingForm = false;
        
        setTimeout(() => {
          this.cargarJefesDepartamento();
          this.closeModalRegistrar();
        }, 2000);
      },
      error: (err) => {
        this.errorForm = 'Error al registrar jefe de departamento: ' + (err.error?.message || '');
        this.isLoadingForm = false;
        console.error('Error:', err);
      }
    });
  }

  private validarFormulario(): boolean {
    return this.jefeData.email.trim() !== '' &&
           this.jefeData.password.trim() !== '' &&
           this.jefeData.nombre.trim() !== '' &&
           this.jefeData.apellido.trim() !== '' &&
           this.jefeData.cargo.trim() !== '';
  }

  private validarFormularioEdicion(): boolean {
    return this.jefeEditando?.usuario?.email?.trim() !== '' &&
           this.jefeEditando?.usuario?.nombre?.trim() !== '' &&
           this.jefeEditando?.usuario?.apellido?.trim() !== '' &&
           this.jefeEditando?.cargo?.trim() !== '';
  }

  private limpiarFormulario(): void {
    this.jefeData = {
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      cargo: 'jefe de departamento de escuela de ciencias de la computación'
    };
  }

  getEstadoBadgeClass(enabled: boolean): string {
    return enabled 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }

  getEstadoText(enabled: boolean): string {
    return enabled ? 'Activo' : 'Inactivo';
  }

  getIniciales(nombre: string, apellido: string): string {
    return (nombre.charAt(0) + apellido.charAt(0)).toUpperCase();
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }
}