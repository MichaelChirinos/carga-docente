import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreMatriculaService } from '../services/pre-matricula.service';
import { PreMatriculaConNombres, PreMatriculaRequest, PreMatriculaResponse } from '../../../core/models/pre-matricula.model';

@Component({
  selector: 'app-gestionar-pre-matricula',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-pre-matricula.component.html'
})

export class GestionarPreMatriculaComponent implements OnInit {
  // Datos para la lista
  preMatriculas: PreMatriculaResponse[] = [];
  loading = false;
  error = '';
cicloFiltro: number | 'todos' = 'todos';

  // Datos para los selects
  ciclosAcademicos: any[] = [];
  asignaturas: any[] = [];

  // Estados para modales
  preMatriculaSeleccionada: PreMatriculaResponse | null = null;
  preMatriculaEditando: PreMatriculaResponse | null = null;
  preMatriculaEliminando: PreMatriculaResponse | null = null;
  
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
  preMatriculaActual: PreMatriculaRequest = {
    idCicloAcademico: 0,
    idAsignatura: 0,
    cantidad: 0
  };

  // Lista de pre-matrículas a registrar
preMatriculasParaRegistrar: PreMatriculaConNombres[] = [];

  // Estados del formulario
  isLoadingForm = false;
  mensaje = '';
  errorForm = '';

  constructor(private preMatriculaService: PreMatriculaService) {}

  ngOnInit() {
    this.cargarPreMatriculas();
    this.cargarCiclosAcademicos();
    this.cargarAsignaturas();
  }
  // En el componente, modifica el openModal para asegurar que los datos estén cargados
async openModal() {
  console.log('Ciclos cargados:', this.ciclosAcademicos); // Debug
  console.log('Asignaturas cargadas:', this.asignaturas); // Debug
  
  // Asegurarnos de que los datos estén cargados antes de abrir el modal
  if (this.ciclosAcademicos.length === 0 || this.asignaturas.length === 0) {
    console.log('Cargando datos para modal...');
    await this.cargarDatosParaModal();
  }
  
  this.showModalRegistro = true;
  this.mensaje = '';
  this.errorForm = '';
  this.preMatriculasParaRegistrar = [];
  this.limpiarFormularioActual();
}
onCicloFiltroChange(): void {
  if (this.cicloFiltro === 'todos') {
    this.cargarPreMatriculas();
  } else {
    this.cargarPreMatriculasPorCiclo(this.cicloFiltro);
  }
}
cargarPreMatriculasPorCiclo(idCicloAcademico: number): void {
  this.loading = true;
  this.error = '';

  this.preMatriculaService.obtenerPreMatriculasPorCiclo(idCicloAcademico).subscribe({
    next: (response: any) => {
      this.loading = false;
      if (response.status === 200) {
        this.preMatriculas = response.data;
      } else {
        this.error = response.message || 'Error al cargar las pre-matrículas del ciclo';
      }
    },
    error: (err) => {
      this.loading = false;
      this.error = 'Error de conexión: ' + (err.error?.message || '');
      console.error('Error:', err);
    }
  });
}
private cargarDatosParaModal(): Promise<void> {
  return new Promise((resolve) => {
    let ciclosCargados = false;
    let asignaturasCargadas = false;

    const checkIfLoaded = () => {
      if (ciclosCargados && asignaturasCargadas) {
        resolve();
      }
    };

    // Cargar ciclos académicos
    this.preMatriculaService.obtenerCiclosAcademicos().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.ciclosAcademicos = response.data;
        }
        ciclosCargados = true;
        checkIfLoaded();
      },
      error: (err) => {
        console.error('Error al cargar ciclos académicos:', err);
        ciclosCargados = true;
        checkIfLoaded();
      }
    });

    // Cargar asignaturas
    this.preMatriculaService.obtenerAsignaturas().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.asignaturas = response.data;
        }
        asignaturasCargadas = true;
        checkIfLoaded();
      },
      error: (err) => {
        console.error('Error al cargar asignaturas:', err);
        asignaturasCargadas = true;
        checkIfLoaded();
      }
    });
  });
}

  cargarPreMatriculas() {
    this.loading = true;
    this.error = '';

    this.preMatriculaService.obtenerPreMatriculas().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 200) {
          this.preMatriculas = response.data;
        } else {
          this.error = response.message || 'Error al cargar las pre-matrículas';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error de conexión: ' + (err.error?.message || '');
        console.error('Error:', err);
      }
    });
  }

  cargarCiclosAcademicos() {
    this.preMatriculaService.obtenerCiclosAcademicos().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.ciclosAcademicos = response.data;
        }
      },
      error: (err) => {
        console.error('Error al cargar ciclos académicos:', err);
      }
    });
  }

  cargarAsignaturas() {
    this.preMatriculaService.obtenerAsignaturas().subscribe({
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
  verDetalles(preMatricula: PreMatriculaResponse): void {
    this.loadingDetalle = true;
    this.mostrarModalDetalle = true;
    this.error = '';

    this.preMatriculaService.obtenerPreMatriculaPorId(preMatricula.idPreMatricula).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.preMatriculaSeleccionada = response.data;
        } else {
          this.error = response.message || 'Pre-matrícula no encontrada';
          this.preMatriculaSeleccionada = null;
        }
        this.loadingDetalle = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles de la pre-matrícula';
        this.preMatriculaSeleccionada = null;
        this.loadingDetalle = false;
        console.error(err);
      }
    });
  }

  // EDITAR PRE-MATRÍCULA
  abrirEditar(preMatricula: PreMatriculaResponse): void {
    this.preMatriculaEditando = { ...preMatricula };
    this.mostrarModalEditar = true;
    this.error = '';
  }

  guardarEdicion(): void {
    if (!this.validarPreMatriculaParaEdicion()) {
      return;
    }

    this.loadingEdicion = true;
    this.error = '';

    const datosActualizacion: PreMatriculaRequest = {
      idCicloAcademico: this.preMatriculaEditando!.cicloAcademico.idCicloAcademico,
      idAsignatura: this.preMatriculaEditando!.asignatura.idAsignatura,
      cantidad: this.preMatriculaEditando!.cantidad
    };

    this.preMatriculaService.actualizarPreMatricula(this.preMatriculaEditando!.idPreMatricula, datosActualizacion).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Actualizar la lista local
          const index = this.preMatriculas.findIndex(p => p.idPreMatricula === this.preMatriculaEditando!.idPreMatricula);
          if (index !== -1) {
            this.preMatriculas[index] = { ...this.preMatriculas[index], ...response.data };
          }
          this.cerrarModalEditar();
          this.cargarPreMatriculas(); // Recargar para asegurar datos actualizados
        } else {
          this.error = response.message || 'Error al actualizar la pre-matrícula';
        }
        this.loadingEdicion = false;
      },
      error: (err) => {
        this.error = 'Error al actualizar la pre-matrícula';
        this.loadingEdicion = false;
        console.error(err);
      }
    });
  }

  // ELIMINAR PRE-MATRÍCULA
  abrirEliminar(preMatricula: PreMatriculaResponse): void {
    this.preMatriculaEliminando = { ...preMatricula };
    this.mostrarModalEliminar = true;
    this.error = '';
  }

  confirmarEliminacion(): void {
    this.loadingEliminacion = true;

    this.preMatriculaService.eliminarPreMatricula(this.preMatriculaEliminando!.idPreMatricula).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Eliminar de la lista local
          this.preMatriculas = this.preMatriculas.filter(p => p.idPreMatricula !== this.preMatriculaEliminando!.idPreMatricula);
          this.cerrarModalEliminar();
          this.cargarPreMatriculas(); // Recargar lista
        } else {
          this.error = response.message || 'Error al eliminar la pre-matrícula';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.error = 'Error al eliminar la pre-matrícula';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  // CERRAR MODALES
  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.preMatriculaSeleccionada = null;
    this.error = '';
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.preMatriculaEditando = null;
    this.loadingEdicion = false;
    this.error = '';
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.preMatriculaEliminando = null;
    this.loadingEliminacion = false;
    this.error = '';
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }

  // MÉTODOS EXISTENTES PARA REGISTRO (se mantienen igual)
// SOLUCIÓN TEMPORAL - Usar los nombres de los selects directamente
agregarALista() {
  if (!this.validarPreMatriculaActual()) {
    this.errorForm = 'Por favor complete todos los campos requeridos correctamente';
    return;
  }

  // Obtener los textos directamente de los elementos select
  const cicloSelect = document.querySelector('[name="idCicloAcademico"]') as HTMLSelectElement;
  const asignaturaSelect = document.querySelector('[name="idAsignatura"]') as HTMLSelectElement;
  
  const cicloNombre = cicloSelect ? cicloSelect.options[cicloSelect.selectedIndex].text : 'Ciclo no encontrado';
  const asignaturaNombre = asignaturaSelect ? asignaturaSelect.options[asignaturaSelect.selectedIndex].text : 'Asignatura no encontrada';

  const nuevaPreMatricula: PreMatriculaConNombres = { 
    ...this.preMatriculaActual,
    cicloNombre: cicloNombre,
    asignaturaNombre: asignaturaNombre
  };
  
  this.preMatriculasParaRegistrar.push(nuevaPreMatricula);
  this.limpiarFormularioActual();
  this.errorForm = '';
}

  eliminarDeLista(index: number) {
    this.preMatriculasParaRegistrar.splice(index, 1);
  }

   closeModal() {
    this.showModalRegistro = false;
    this.isLoadingForm = false;
    this.mensaje = '';
    this.errorForm = '';
    this.preMatriculasParaRegistrar = [];
  }

  registrarPreMatriculas() {
    if (this.preMatriculasParaRegistrar.length === 0) {
      this.errorForm = 'Debe agregar al menos una pre-matrícula para registrar';
      return;
    }

    this.isLoadingForm = true;
    this.errorForm = '';
    this.mensaje = '';

    const registros = this.preMatriculasParaRegistrar.map(preMatricula => 
      this.preMatriculaService.registrarPreMatricula(preMatricula).toPromise()
    );

    Promise.all(registros).then(results => {
      this.isLoadingForm = false;
      const exitosos = results.filter(r => r?.status === 201).length;
      this.mensaje = `Se registraron ${exitosos} de ${this.preMatriculasParaRegistrar.length} pre-matrículas correctamente`;
      
      setTimeout(() => {
        this.cargarPreMatriculas();
        this.closeModal();
      }, 2000);
    }).catch(err => {
      this.isLoadingForm = false;
      this.errorForm = 'Error al registrar algunas pre-matrículas: ' + (err.error?.message || '');
      console.error('Error:', err);
    });
  }

  // VALIDACIONES
  private validarPreMatriculaActual(): boolean {
    if (this.preMatriculaActual.idCicloAcademico === 0) {
      this.errorForm = 'Debe seleccionar un ciclo académico';
      return false;
    }

    if (this.preMatriculaActual.idAsignatura === 0) {
      this.errorForm = 'Debe seleccionar una asignatura';
      return false;
    }

    if (this.preMatriculaActual.cantidad <= 0) {
      this.errorForm = 'La cantidad debe ser mayor a 0';
      return false;
    }

    return true;
  }

  private validarPreMatriculaParaEdicion(): boolean {
    if (!this.preMatriculaEditando) {
      this.error = 'No hay pre-matrícula seleccionada para editar';
      return false;
    }

    if (this.preMatriculaEditando.cantidad <= 0) {
      this.error = 'La cantidad debe ser mayor a 0';
      return false;
    }

    return true;
  }

  private limpiarFormularioActual(): void {
    this.preMatriculaActual = {
      idCicloAcademico: 0,
      idAsignatura: 0,
      cantidad: 0
    };
  }

  // Helper functions para obtener nombres
  getNombreCiclo(idCiclo: number): string {
    const ciclo = this.ciclosAcademicos.find(c => c.idCicloAcademico === idCiclo);
    return ciclo ? ciclo.nombre : 'N/A';
  }

  getNombreAsignatura(idAsignatura: number): string {
    const asignatura = this.asignaturas.find(a => a.idAsignatura === idAsignatura);
    return asignatura ? `${asignatura.codigo} - ${asignatura.nombre}` : 'N/A';
  }

  // Helper function para la tabla
  getEstadoBadgeClass(enabled: boolean): string {
    return enabled 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }
  // En el componente, agrega estas funciones:
// En el componente, asegúrate de que las funciones sean así:
getCicloNombreById(idCiclo: number): string {
  if (!idCiclo || idCiclo === 0) return 'No seleccionado';
  const ciclo = this.ciclosAcademicos.find(c => c.idCicloAcademico === idCiclo);
  console.log('Buscando ciclo:', idCiclo, 'Encontrado:', ciclo); // Para debug
  return ciclo ? ciclo.nombre : `Ciclo #${idCiclo}`;
}

getAsignaturaNombreById(idAsignatura: number): string {
  if (!idAsignatura || idAsignatura === 0) return 'No seleccionada';
  const asignatura = this.asignaturas.find(a => a.idAsignatura === idAsignatura);
  console.log('Buscando asignatura:', idAsignatura, 'Encontrado:', asignatura); // Para debug
  return asignatura ? `${asignatura.codigo} - ${asignatura.nombre}` : `Asignatura #${idAsignatura}`;
}
}