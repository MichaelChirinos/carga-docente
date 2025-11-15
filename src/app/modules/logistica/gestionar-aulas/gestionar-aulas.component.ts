import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AulaService } from '../services/aula.service';
import { AulaRequest, AulaResponse, Tipo, EstadoAula } from '../../../core/models/aula.model';

@Component({
  selector: 'app-gestionar-aulas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-aulas.component.html'
})
export class GestionarAulasComponent implements OnInit {
  aulas: AulaResponse[] = [];
  loading = false;
  error = '';

  aulaSeleccionada: AulaResponse | null = null;
  aulaEditando: AulaResponse | null = null;
  aulaEliminando: AulaResponse | null = null;
  
  loadingDetalle = false;
  loadingEdicion = false;
  loadingEliminacion = false;
  
  mostrarModalDetalle = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;

  showModalRegistro = false;
  
  aulaActual: AulaRequest = {
    tipo: Tipo.TEORIA,
    nombre: '', 
    piso: 1,
    capacidad: 0,
    estado: EstadoAula.DISPONIBLE
  };

  aulasParaRegistrar: AulaRequest[] = [];

  // Estados del formulario
  isLoadingForm = false;
  mensaje = '';
  errorForm = '';

  // Opciones para los selects
  tiposAula = Object.values(Tipo);
  estadosAula = Object.values(EstadoAula);
  pisos = [1, 2, 3, 4, 5, 6];

  constructor(private aulaService: AulaService) {}

  ngOnInit() {
    this.cargarAulas();
  }

  cargarAulas() {
    this.loading = true;
    this.error = '';

    this.aulaService.obtenerAulas().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 200) {
          this.aulas = response.data;
        } else {
          this.error = response.message || 'Error al cargar las aulas';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error de conexión: ' + (err.error?.message || '');
        console.error('Error:', err);
      }
    });
  }

  // VER DETALLES
  verDetalles(aula: AulaResponse): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.error = '';

    this.aulaService.obtenerAulaPorId(aula.idAula).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.aulaSeleccionada = response.data;
        } else {
          this.error = response.message || 'Aula no encontrada';
          this.aulaSeleccionada = null;
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles del aula';
        this.aulaSeleccionada = null;
        this.loadingDetalle = false;
        console.error(err);
      }
    });
  }

  // EDITAR AULA
  abrirEditar(aula: AulaResponse): void {
    this.aulaEditando = { ...aula };
    this.mostrarModalEditar = true;
    this.error = '';
  }
guardarEdicion(): void {
  if (!this.validarAulaParaEdicion()) {
    return;
  }

  this.loadingEdicion = true;
  this.error = '';

  // Convertir null a undefined para cumplir con AulaRequest
  const numeroEquipos = this.aulaEditando!.tipo === Tipo.LABORATORIO 
    ? (this.aulaEditando!.numeroEquipos || undefined)
    : undefined;

  const datosActualizacion: AulaRequest = {
    tipo: this.aulaEditando!.tipo,
    nombre: this.aulaEditando!.nombre.trim(),
    piso: this.aulaEditando!.piso,
    capacidad: this.aulaEditando!.capacidad,
    numeroEquipos: numeroEquipos, // Ahora es number | undefined, no number | null | undefined
    estado: this.aulaEditando!.estado
  };

  this.aulaService.actualizarAula(this.aulaEditando!.idAula, datosActualizacion).subscribe({
    next: (response: any) => {
      if (response.status === 200) {
        // Actualizar la lista local
        const index = this.aulas.findIndex(a => a.idAula === this.aulaEditando!.idAula);
        if (index !== -1) {
          this.aulas[index] = { ...this.aulas[index], ...response.data };
        }
        this.cerrarModalEditar();
        this.cargarAulas(); // Recargar para asegurar datos actualizados
      } else {
        this.error = response.message || 'Error al actualizar el aula';
      }
      this.loadingEdicion = false;
    },
    error: (err) => {
      this.error = 'Error al actualizar el aula';
      this.loadingEdicion = false;
      console.error(err);
    }
  });
}

  // ELIMINAR AULA
  abrirEliminar(aula: AulaResponse): void {
    this.aulaEliminando = { ...aula };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  confirmarEliminacion(): void {
    this.loadingEliminacion = true;

    this.aulaService.eliminarAula(this.aulaEliminando!.idAula).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Eliminar de la lista local
          this.aulas = this.aulas.filter(a => a.idAula !== this.aulaEliminando!.idAula);
          this.cerrarModalEliminar();
          this.cargarAulas(); // Recargar lista
        } else {
          this.error = response.message || 'Error al eliminar el aula';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar el aula';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  // CERRAR MODALES
  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.aulaSeleccionada = null;
    this.error = '';
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.aulaEditando = null;
    this.loadingEdicion = false;
    this.error = '';
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.aulaEliminando = null;
    this.loadingEliminacion = false;
    this.error = '';
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }

  // MÉTODOS EXISTENTES PARA REGISTRO (se mantienen igual)
  agregarALista() {
    if (!this.validarAulaActual()) {
      this.errorForm = 'Por favor complete todos los campos requeridos correctamente';
      return;
    }

    const nuevaAula: AulaRequest = { ...this.aulaActual };
    this.aulasParaRegistrar.push(nuevaAula);
    this.limpiarFormularioActual();
    this.errorForm = '';
  }

  eliminarDeLista(index: number) {
    this.aulasParaRegistrar.splice(index, 1);
  }

  openModal() {
    this.showModalRegistro = true;
    this.mensaje = '';
    this.errorForm = '';
    this.aulasParaRegistrar = [];
    this.limpiarFormularioActual();
  }

  closeModal() {
    this.showModalRegistro = false;
    this.isLoadingForm = false;
    this.mensaje = '';
    this.errorForm = '';
    this.aulasParaRegistrar = [];
  }

  registrarAulas() {
    if (this.aulasParaRegistrar.length === 0) {
      this.errorForm = 'Debe agregar al menos un aula para registrar';
      return;
    }

    this.isLoadingForm = true;
    this.errorForm = '';
    this.mensaje = '';

    const registros = this.aulasParaRegistrar.map(aula => 
      this.aulaService.registrarAula(aula).toPromise()
    );

    Promise.all(registros).then(results => {
      this.isLoadingForm = false;
      const exitosos = results.filter(r => r?.status === 201).length;
      this.mensaje = `Se registraron ${exitosos} de ${this.aulasParaRegistrar.length} aulas correctamente`;
      
      setTimeout(() => {
        this.cargarAulas();
        this.closeModal();
      }, 2000);
    }).catch(err => {
      this.isLoadingForm = false;
      this.errorForm = 'Error al registrar algunas aulas: ' + (err.error?.message || '');
      console.error('Error:', err);
    });
  }

  // VALIDACIONES
  private validarAulaActual(): boolean {
    if (!this.aulaActual.nombre.trim()) {
      this.errorForm = 'El código del aula es requerido';
      return false;
    }

    if (this.aulaActual.capacidad < 0) {
      this.errorForm = 'La capacidad no puede ser negativa';
      return false;
    }

    if (this.aulaActual.tipo === Tipo.LABORATORIO) {
      if ((this.aulaActual.numeroEquipos || 0) < 0) {
        this.errorForm = 'El número de equipos no puede ser negativo';
        return false;
      }
    }

    return true;
  }

  private validarAulaParaEdicion(): boolean {
    if (!this.aulaEditando?.nombre?.trim()) {
      this.error = 'El nombre del aula es requerido';
      return false;
    }

    if (this.aulaEditando.capacidad < 0) {
      this.error = 'La capacidad no puede ser negativa';
      return false;
    }

    if (this.aulaEditando.tipo === Tipo.LABORATORIO) {
      if ((this.aulaEditando.numeroEquipos || 0) < 0) {
        this.error = 'El número de equipos no puede ser negativo';
        return false;
      }
    }

    return true;
  }

  private limpiarFormularioActual(): void {
    this.aulaActual = {
      tipo: Tipo.TEORIA,
      nombre: '',
      piso: 1,
      capacidad: 0,
      estado: EstadoAula.DISPONIBLE
    };
  }

  // Helper functions para la tabla
  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case EstadoAula.DISPONIBLE:
        return 'bg-green-100 text-green-800';
      case EstadoAula.OCUPADO:
        return 'bg-red-100 text-red-800';
      case EstadoAula.MANTENIMIENTO:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTipoBadgeClass(tipo: string): string {
    return tipo === Tipo.LABORATORIO
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  }

  mostrarCampoEquipos(): boolean {
    return this.aulaActual.tipo === Tipo.LABORATORIO;
  }

  mostrarCampoEquiposEdicion(): boolean {
    return this.aulaEditando?.tipo === Tipo.LABORATORIO;
  }
}