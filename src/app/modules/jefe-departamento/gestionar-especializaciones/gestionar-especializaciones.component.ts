import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EspecializacionService } from '../services/especializacion.service';
import { EspecializacionRequest, EspecializacionResponse, EspecializacionDisplay } from '../../../core/models/especializacion.model';import { Docente } from '../../../core/models/docente.model';

@Component({
  selector: 'app-gestionar-especializaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gestionar-especializaciones.component.html'
})
export class GestionarEspecializacionesComponent implements OnInit {
  // Datos para la lista
  especializaciones: EspecializacionResponse[] = [];
  loading = false;
  error = '';
docenteFiltro: number | 'todos' = 'todos';
primeraCarga = true; 

  // Datos para los selects
  docentes: Docente[] = [];
  asignaturas: any[] = [];

  // Estados para modales
  especializacionSeleccionada: EspecializacionResponse | null = null;
  especializacionEditando: EspecializacionResponse | null = null;
  especializacionEliminando: EspecializacionResponse | null = null;
  
  // Estados de carga específicos
  loadingDetalle = false;
  loadingEdicion = false;
  loadingEliminacion = false;
  
  // Estados de modales
  mostrarModalDetalle = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;

  // Estado del modal de registro
  showModalRegistro = false;
  
  // Datos del formulario actual
  especializacionActual: EspecializacionRequest = {
    idAsignatura: 0,
    idDocente: 0
  };

  // Lista de especializaciones a registrar
  especializacionesParaRegistrar: EspecializacionDisplay [] = [];

  // Estados del formulario
  isLoadingForm = false;
  mensaje = '';
  errorForm = '';

  constructor(private especializacionService: EspecializacionService) {}

  ngOnInit() {
    this.cargarEspecializaciones();
    this.cargarDocentes();
    this.cargarAsignaturas();
  }
onDocenteFiltroChange(): void {
  // Siempre cambiar primeraCarga a false cuando se selecciona algo
  this.primeraCarga = false;
  
  if (this.docenteFiltro === 'todos') {
    // Cuando selecciona "todos", limpiar la lista y mostrar mensaje
    this.especializaciones = [];
    this.error = '';
  } else {
    // Cuando selecciona un docente, cargar sus especializaciones
    this.cargarEspecializacionesPorDocente(this.docenteFiltro);
  }
}
cargarEspecializacionesPorDocente(idDocente: number): void {
  this.loading = true;
  this.error = '';
  this.primeraCarga = false; // ← Asegurar que sea false aquí también

  this.especializacionService.obtenerEspecializacionesPorDocente(idDocente).subscribe({
    next: (response: any) => {
      this.loading = false;
      this.primeraCarga = false; // ← Y aquí también
      
      if (response.status === 200) {
        this.especializaciones = response.data;
      } else {
        this.error = response.message || 'Error al cargar las especializaciones del docente';
        this.especializaciones = [];
      }
    },
    error: (err) => {
      this.loading = false;
      this.primeraCarga = false; // ← Y aquí también
      this.error = 'Error de conexión: ' + (err.error?.message || '');
      this.especializaciones = [];
      console.error('Error:', err);
    }
  });
}
  cargarEspecializaciones() {
    this.loading = true;
    this.error = '';

    this.especializacionService.obtenerEspecializaciones().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 200) {
          this.especializaciones = response.data;
        } else {
          this.error = response.message || 'Error al cargar las especializaciones';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error de conexión: ' + (err.error?.message || '');
        console.error('Error:', err);
      }
    });
  }

  cargarDocentes() {
    this.especializacionService.obtenerDocentes().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.docentes = response.data;
        }
      },
      error: (err) => {
        console.error('Error al cargar docentes:', err);
      }
    });
  }

  cargarAsignaturas() {
    this.especializacionService.obtenerAsignaturas().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.asignaturas = response.data;
        }
      },
      error: (err) => {
        console.error('Error al cargar asignaturas:', err);
      }
    });
  }

  // VER DETALLES
  verDetalles(especializacion: EspecializacionResponse): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.error = '';

    this.especializacionService.obtenerEspecializacionPorId(especializacion.idEspecializacion).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.especializacionSeleccionada = response.data;
        } else {
          this.error = response.message || 'Especialización no encontrada';
          this.especializacionSeleccionada = null;
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles de la especialización';
        this.especializacionSeleccionada = null;
        this.loadingDetalle = false;
        console.error(err);
      }
    });
  }

  // EDITAR ESPECIALIZACIÓN
  abrirEditar(especializacion: EspecializacionResponse): void {
    this.especializacionEditando = { ...especializacion };
    this.mostrarModalEditar = true;
    this.error = '';
  }


onDocenteChange(idDocente: number): void {
  if (this.especializacionEditando) {
    // Si no existe el objeto docente, crearlo
    if (!this.especializacionEditando.docente) {
      this.especializacionEditando.docente = {
        idDocente: idDocente,
        codigo: '',
        usuario: {
          nombre: '',
          apellido: ''
        }
      };
    } else {
      // Si ya existe, solo actualizar el id
      this.especializacionEditando.docente.idDocente = idDocente;
    }
  }
}

guardarEdicion(): void {
  if (!this.especializacionEditando) return;

  this.loadingEdicion = true;
  this.error = '';

  // Verificar que docente no sea undefined
  if (!this.especializacionEditando.docente) {
    this.error = 'Error: Información del docente no disponible';
    this.loadingEdicion = false;
    return;
  }

  const datosActualizacion: EspecializacionRequest = {
    idAsignatura: this.especializacionEditando.asignatura.idAsignatura,
    idDocente: this.especializacionEditando.docente.idDocente // ← ahora seguro que existe
  };

  this.especializacionService.actualizarEspecializacion(this.especializacionEditando.idEspecializacion, datosActualizacion).subscribe({
    next: (response: any) => {
      if (response.status === 200) {
        // Actualizar la lista local
        const index = this.especializaciones.findIndex(e => e.idEspecializacion === this.especializacionEditando!.idEspecializacion);
        if (index !== -1) {
          this.especializaciones[index] = { ...this.especializaciones[index], ...response.data };
        }
        this.cerrarModalEditar();
        // Recargar las especializaciones del docente actual
        if (this.docenteFiltro !== 'todos') {
          this.cargarEspecializacionesPorDocente(this.docenteFiltro);
        }
      } else {
        this.error = response.message || 'Error al actualizar la especialización';
      }
      this.loadingEdicion = false;
    },
    error: (err) => {
      this.error = 'Error al actualizar la especialización';
      this.loadingEdicion = false;
      console.error(err);
    }
  });
}

  // ELIMINAR ESPECIALIZACIÓN
  abrirEliminar(especializacion: EspecializacionResponse): void {
    this.especializacionEliminando = { ...especializacion };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  confirmarEliminacion(): void {
    if (!this.especializacionEliminando) return;

    this.loadingEliminacion = true;

    this.especializacionService.eliminarEspecializacion(this.especializacionEliminando.idEspecializacion).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Eliminar de la lista local
          this.especializaciones = this.especializaciones.filter(e => e.idEspecializacion !== this.especializacionEliminando!.idEspecializacion);
          this.cerrarModalEliminar();
          this.cargarEspecializaciones(); // Recargar lista
        } else {
          this.error = response.message || 'Error al eliminar la especialización';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar la especialización';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  // CERRAR MODALES
  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.especializacionSeleccionada = null;
    this.error = '';
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.especializacionEditando = null;
    this.loadingEdicion = false;
    this.error = '';
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.especializacionEliminando = null;
    this.loadingEliminacion = false;
    this.error = '';
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }

  // MÉTODOS EXISTENTES PARA REGISTRO (se mantienen igual)
  agregarALista() {
    if (!this.validarEspecializacionActual()) {
      this.errorForm = 'Por favor complete todos los campos requeridos correctamente';
      return;
    }

    // Verificar si ya existe esta combinación en la lista
    const existe = this.especializacionesParaRegistrar.some(esp => 
      esp.idAsignatura === this.especializacionActual.idAsignatura && 
      esp.idDocente === this.especializacionActual.idDocente
    );

    if (existe) {
      this.errorForm = 'Esta combinación de docente y asignatura ya está en la lista';
      return;
    }

    // Obtener los elementos select del DOM para obtener el texto seleccionado
    const docenteSelect = document.querySelector('[name="idDocente"]') as HTMLSelectElement;
    const asignaturaSelect = document.querySelector('[name="idAsignatura"]') as HTMLSelectElement;

    const docenteTexto = docenteSelect?.options[docenteSelect.selectedIndex]?.text || 'N/A';
    const asignaturaTexto = asignaturaSelect?.options[asignaturaSelect.selectedIndex]?.text || 'N/A';

    // Extraer solo el nombre del docente (sin el código)
    const docenteNombre = docenteTexto.split(' - ')[0] || 'N/A';
    const docenteCodigo = docenteTexto.split(' - ')[1] || 'N/A';

    // Extraer solo el nombre de la asignatura
    const asignaturaNombre = asignaturaTexto.replace('Seleccionar asignatura', '').trim() || 'N/A';

    const nuevaEspecializacion: EspecializacionDisplay  = { 
      ...this.especializacionActual,
      docenteNombre: docenteNombre,
      docenteCodigo: docenteCodigo,
      asignaturaNombre: asignaturaNombre === 'Seleccionar asignatura' ? 'N/A' : asignaturaNombre
    };
    
    this.especializacionesParaRegistrar.push(nuevaEspecializacion);
    this.limpiarFormularioActual();
    this.errorForm = '';
  }

  eliminarDeLista(index: number) {
    this.especializacionesParaRegistrar.splice(index, 1);
  }

  openModal() {
    this.showModalRegistro = true;
    this.mensaje = '';
    this.errorForm = '';
    this.especializacionesParaRegistrar = [];
    this.limpiarFormularioActual();
  }

  closeModal() {
    this.showModalRegistro = false;
    this.isLoadingForm = false;
    this.mensaje = '';
    this.errorForm = '';
    this.especializacionesParaRegistrar = [];
  }

  registrarEspecializaciones() {
    if (this.especializacionesParaRegistrar.length === 0) {
      this.errorForm = 'Debe agregar al menos una especialización para registrar';
      return;
    }

    this.isLoadingForm = true;
    this.errorForm = '';
    this.mensaje = '';

    // Preparar datos para enviar (solo los campos requeridos)
    const datosParaEnviar = this.especializacionesParaRegistrar.map(esp => ({
      idAsignatura: esp.idAsignatura,
      idDocente: esp.idDocente
    }));

    // Registrar cada especialización individualmente
    const registros = datosParaEnviar.map(especializacion => 
      this.especializacionService.registrarEspecializacion(especializacion).toPromise()
    );

    // Esperar a que todos se registren
    Promise.all(registros).then(results => {
      this.isLoadingForm = false;
      const exitosos = results.filter(r => r?.status === 200).length;
      this.mensaje = `Se registraron ${exitosos} de ${this.especializacionesParaRegistrar.length} especializaciones correctamente`;
      
      // Recargar la lista y cerrar modal después de 2 segundos
      setTimeout(() => {
        this.cargarEspecializaciones();
        this.closeModal();
      }, 2000);
    }).catch(err => {
      this.isLoadingForm = false;
      this.errorForm = 'Error al registrar algunas especializaciones: ' + (err.error?.message || '');
      console.error('Error:', err);
    });
  }

  private validarEspecializacionActual(): boolean {
    if (this.especializacionActual.idAsignatura === 0) {
      this.errorForm = 'Debe seleccionar una asignatura';
      return false;
    }

    if (this.especializacionActual.idDocente === 0) {
      this.errorForm = 'Debe seleccionar un docente';
      return false;
    }

    return true;
  }

  private limpiarFormularioActual(): void {
    this.especializacionActual = {
      idAsignatura: 0,
      idDocente: 0
    };
  }

  // Helper function para la tabla
  getEstadoBadgeClass(enabled: boolean): string {
    return enabled 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }

getNombreDocenteSeleccionado(): string {
  if (this.docenteFiltro === 'todos') return 'Información no disponible';
  
  const docente = this.docentes.find(d => d.idDocente === this.docenteFiltro);
  return docente ? `${docente.usuario.nombre} ${docente.usuario.apellido}` : 'Docente no encontrado';
}

getCodigoDocenteSeleccionado(): string {
  if (this.docenteFiltro === 'todos') return 'N/A';
  
  const docente = this.docentes.find(d => d.idDocente === this.docenteFiltro);
  return docente ? docente.codigo : 'N/A'; // ✅ docente.codigo (NO usuario.codigo)
}
}