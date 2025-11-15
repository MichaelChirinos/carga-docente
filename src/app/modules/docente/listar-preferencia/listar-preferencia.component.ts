import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreferenciaDocenteResponse, PreferenciaSimple } from '../../../core/models/preferencia.model';

@Component({
  selector: 'app-listar-preferencia',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './listar-preferencia.component.html'
})
export class ListarPreferenciaComponent implements OnInit {
  docentesConPreferencias: PreferenciaDocenteResponse[] = [];
  misPreferencias: PreferenciaSimple[] = [];
  ciclosAcademicos: any[] = [];
  idCicloAcademicoSeleccionado: number | null = null;
  isLoading = true;
  idDocente: number | null = null;
  nombreDocente: string = '';

  // Estados para modales
  preferenciaSeleccionada: PreferenciaSimple | null = null;
  preferenciaEliminando: PreferenciaSimple | null = null;
  
  // Estados de modales
  mostrarModalDetalle = false;
  mostrarModalEliminar = false;
  
  // Estados de carga específicos
  loadingDetalle = false;
  loadingEliminacion = false;

  constructor(
    private docenteService: DocenteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    const usuario = this.authService.getCurrentUser();
    if (!usuario?.idUsuario) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    
    this.docenteService.getDocenteByUsuario(usuario.idUsuario).subscribe({
      next: (docente: any) => {
        this.idDocente = docente.idDocente;
        this.nombreDocente = `${docente.usuario.nombre} ${docente.usuario.apellido}`;
        console.log('Docente actual:', this.idDocente, this.nombreDocente);
        this.cargarCiclosAcademicos();
      },
      error: (err) => {
        console.error('Error obteniendo docente:', err);
        this.isLoading = false;
      }
    });
  }

  cargarCiclosAcademicos() {
    this.docenteService.obtenerCiclosAcademicos().subscribe({
      next: (response: any) => {
        this.ciclosAcademicos = response.data || [];
        console.log('Ciclos académicos cargados:', this.ciclosAcademicos);
        
        if (this.ciclosAcademicos.length > 0) {
          this.idCicloAcademicoSeleccionado = this.ciclosAcademicos[0].idCicloAcademico;
          this.cargarPreferencias();
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error cargando ciclos académicos:', err);
        this.isLoading = false;
      }
    });
  }

  cargarPreferencias() {
    if (!this.idCicloAcademicoSeleccionado) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    
    this.docenteService.getPreferenciasDocentes(this.idCicloAcademicoSeleccionado).subscribe({
      next: (response: any) => {
        console.log('Respuesta completa del endpoint:', response);
        this.docentesConPreferencias = response.data || [];
        
        // Encontrar las preferencias del docente actual
        this.filtrarMisPreferencias();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando preferencias:', err);
        this.isLoading = false;
        this.misPreferencias = [];
      }
    });
  }

  onCicloAcademicoChange() {
    console.log('Ciclo seleccionado:', this.idCicloAcademicoSeleccionado);
    this.cargarPreferencias();
  }

  filtrarMisPreferencias() {
    if (!this.idDocente) {
      this.misPreferencias = [];
      return;
    }

    console.log('Buscando preferencias del docente:', this.idDocente);
    console.log('Total de docentes con preferencias:', this.docentesConPreferencias.length);

    // Buscar el docente actual en la lista
    const docenteActual = this.docentesConPreferencias.find(docente => 
      docente.idDocente === this.idDocente
    );

    if (docenteActual) {
      console.log('Docente encontrado:', docenteActual);
      this.misPreferencias = docenteActual.preferencias || [];
      this.nombreDocente = `${docenteActual.usuario.nombre} ${docenteActual.usuario.apellido}`;
    } else {
      console.log('No se encontraron preferencias para el docente actual');
      this.misPreferencias = [];
    }

    console.log('Mis preferencias:', this.misPreferencias);
  }

  // VER DETALLES DE PREFERENCIA
  verDetalles(preferencia: PreferenciaSimple): void {
    this.preferenciaSeleccionada = preferencia;
    this.mostrarModalDetalle = true;
  }

  // ELIMINAR PREFERENCIA
  abrirEliminar(preferencia: PreferenciaSimple): void {
    this.preferenciaEliminando = preferencia;
    this.mostrarModalEliminar = true;
  }

  confirmarEliminacion(): void {
    if (!this.preferenciaEliminando) return;

    this.loadingEliminacion = true;

    this.docenteService.eliminarPreferencia(this.preferenciaEliminando.idPreferencia).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          // Eliminar de la lista local
          this.misPreferencias = this.misPreferencias.filter(
            p => p.idPreferencia !== this.preferenciaEliminando!.idPreferencia
          );
          this.mostrarMensaje('Preferencia eliminada con éxito', false);
        } else {
          this.mostrarMensaje(response.message || 'Error al eliminar la preferencia', true);
        }
        this.cerrarModalEliminar();
        this.loadingEliminacion = false;
      },
      error: (err) => {
        console.error('Error eliminando preferencia:', err);
        this.mostrarMensaje('Error al eliminar la preferencia', true);
        this.loadingEliminacion = false;
        this.cerrarModalEliminar();
      }
    });
  }

  // CERRAR MODALES
  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.preferenciaSeleccionada = null;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.preferenciaEliminando = null;
    this.loadingEliminacion = false;
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }

  editarPreferencia(id: number) {
    this.router.navigate(['/Docente/editar-preferencia', id]);
  }

  // Helper function para mostrar mensajes
  private mostrarMensaje(mensaje: string, esError: boolean): void {
    console.log(mensaje);
    if (esError) {
      alert('Error: ' + mensaje);
    } else {
      alert(mensaje);
    }
  }

  // Helper para obtener el nombre del ciclo académico
  getCicloNombre(): string {
    if (!this.idCicloAcademicoSeleccionado) return '';
    const ciclo = this.ciclosAcademicos.find(c => c.idCicloAcademico === this.idCicloAcademicoSeleccionado);
    return ciclo ? ciclo.nombre : 'Ciclo no disponible';
  }

  // Método para recargar las preferencias
  recargarPreferencias() {
    this.cargarPreferencias();
  }
}