// gestionar-cargas.component.ts
import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gestionar-cargas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gestionar-cargas.component.html'
})
export class GestionarCargasComponent implements OnInit {
  ciclosAcademicos: any[] = [];
  cargasAcademicas: any[] = [];
  cargaPrincipal: any = null;
  idCicloAcademicoSeleccionado: number = 0;
  
  // Estados
  loading = false;
  loadingCiclos = false;
  loadingCargas = false;
  loadingPrincipal = false;
  
  // Modales
  mostrarModalDetalle = false;
  mostrarModalEliminar = false;
  mostrarModalPrincipal = false;
  
  // Datos seleccionados
  cargaSeleccionada: any = null;
  cargaEliminando: any = null;
  cargaMarcandoPrincipal: any = null;
  
  // Mensajes
  message = '';
  isError = false;
  errorDetalle = '';

  constructor(private directorService: DirectorService) {}

  ngOnInit(): void {
    this.cargarCiclosAcademicos();
  }

  cargarCiclosAcademicos(): void {
    this.loadingCiclos = true;
    this.directorService.obtenerCiclosAcademicos().subscribe({
      next: (response: any) => {
        const ciclos = response.data || response || [];
        this.ciclosAcademicos = ciclos;
        
        // Seleccionar ciclo activo por defecto
        const cicloActivo = ciclos.find((ciclo: any) => ciclo.enabled);
        if (cicloActivo) {
          this.idCicloAcademicoSeleccionado = cicloActivo.idCicloAcademico;
          this.cargarCargasAcademicas();
          this.cargarCargaPrincipal();
        } else if (ciclos.length > 0) {
          this.idCicloAcademicoSeleccionado = ciclos[0].idCicloAcademico;
          this.cargarCargasAcademicas();
          this.cargarCargaPrincipal();
        }
        
        this.loadingCiclos = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar ciclos académicos', true);
        this.loadingCiclos = false;
      }
    });
  }

  cargarCargasAcademicas(): void {
    if (!this.idCicloAcademicoSeleccionado) return;

    this.loadingCargas = true;
    this.directorService.obtenerCargasAcademicasPorCiclo(this.idCicloAcademicoSeleccionado).subscribe({
      next: (response: any) => {
        this.cargasAcademicas = response.data || response || [];
        this.loadingCargas = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar cargas académicas', true);
        this.loadingCargas = false;
      }
    });
  }

  cargarCargaPrincipal(): void {
    if (!this.idCicloAcademicoSeleccionado) return;

    this.loadingPrincipal = true;
    this.directorService.obtenerCargaPrincipal(this.idCicloAcademicoSeleccionado).subscribe({
      next: (response: any) => {
        this.cargaPrincipal = response.data || null;
        this.loadingPrincipal = false;
      },
      error: (err) => {
        this.cargaPrincipal = null;
        this.loadingPrincipal = false;
      }
    });
  }

  onCicloChange(): void {
    this.cargarCargasAcademicas();
    this.cargarCargaPrincipal();
  }

  // VER DETALLES
  verDetalles(carga: any): void {
    this.directorService.obtenerCargaPorId(carga.idCarga).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.cargaSeleccionada = response.data;
          this.mostrarModalDetalle = true;
        } else {
          this.showMessage('Carga no encontrada', true);
        }
      },
      error: (err) => {
        this.showMessage('Error al cargar los detalles de la carga', true);
      }
    });
  }

  // MARCAR COMO PRINCIPAL
  abrirMarcarPrincipal(carga: any): void {
    this.cargaMarcandoPrincipal = carga;
    this.mostrarModalPrincipal = true;
  }

  confirmarMarcarPrincipal(): void {
    if (!this.cargaMarcandoPrincipal || !this.idCicloAcademicoSeleccionado) return;

    this.directorService.asignarCargaPrincipal(
      this.idCicloAcademicoSeleccionado, 
      this.cargaMarcandoPrincipal.idCarga
    ).subscribe({
      next: (response: any) => {
        this.showMessage(response.message || 'Carga marcada como principal exitosamente', false);
        this.cerrarModalPrincipal();
        this.cargarCargaPrincipal(); // Recargar la carga principal
        this.cargarCargasAcademicas(); // Recargar lista para actualizar estados
      },
      error: (err) => {
        this.showMessage('Error al marcar la carga como principal', true);
      }
    });
  }

  // ELIMINAR CARGA
  abrirEliminar(carga: any): void {
    this.cargaEliminando = carga;
    this.mostrarModalEliminar = true;
  }

  confirmarEliminacion(): void {
    if (!this.cargaEliminando) return;

    this.directorService.eliminarCarga(this.cargaEliminando.idCarga).subscribe({
      next: (response: any) => {
        this.showMessage('Carga eliminada exitosamente', false);
        this.cerrarModalEliminar();
        this.cargarCargasAcademicas(); // Recargar lista
        this.cargarCargaPrincipal(); // Recargar principal por si era la principal
      },
      error: (err) => {
        this.showMessage('Error al eliminar la carga', true);
      }
    });
  }

  // CERRAR MODALES
  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.cargaSeleccionada = null;
  }

  cerrarModalPrincipal(): void {
    this.mostrarModalPrincipal = false;
    this.cargaMarcandoPrincipal = null;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.cargaEliminando = null;
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }

  // MÉTODOS AUXILIARES
  getCicloSeleccionado(): string {
    const ciclo = this.ciclosAcademicos.find(c => c.idCicloAcademico === this.idCicloAcademicoSeleccionado);
    return ciclo ? ciclo.nombre : '';
  }

  esCargaPrincipal(carga: any): boolean {
    return this.cargaPrincipal && this.cargaPrincipal.idCarga === carga.idCarga;
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  calcularPorcentaje(asignados: number, total: number): number {
    if (!total || total === 0) return 0;
    return Math.round((asignados / total) * 100);
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}