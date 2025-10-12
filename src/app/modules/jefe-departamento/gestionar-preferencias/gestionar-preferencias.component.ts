import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Preferencia {
  idPreferencia: number;
  asignatura: {
    idAsignatura: number;
    nombre: string;
  };
  enabled: boolean;
}

interface DocentePreferencias {
  idDocente: number;
  usuario: {
    nombre: string;
    apellido: string;
  };
  preferencias: Preferencia[];
  enabled: boolean;
}

@Component({
  selector: 'app-gestionar-preferencias',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gestionar-preferencias.component.html'
})
export class GestionarPreferenciasComponent implements OnInit {
  docentesPreferencias: DocentePreferencias[] = [];
  ciclosAcademicos: any[] = [];
  cicloAcademicoSeleccionado: number = 0;
  loading = true;
  error = '';
  searchTerm = '';

  // Estados para modal de detalles
  docenteSeleccionado: DocentePreferencias | null = null;
  mostrarModalDetalle = false;

  constructor(private docenteService: DocenteService) {}

  ngOnInit(): void {
    this.cargarCiclosAcademicos();
  }

  cargarCiclosAcademicos(): void {
    this.docenteService.getCiclosAcademicos().subscribe({
      next: (response: any) => {
        if (response.status === 200 && Array.isArray(response.data)) {
          this.ciclosAcademicos = response.data;
          // Seleccionar el primer ciclo activo por defecto
          const cicloActivo = this.ciclosAcademicos.find(c => c.enabled);
          this.cicloAcademicoSeleccionado = cicloActivo ? cicloActivo.idCicloAcademico : this.ciclosAcademicos[0]?.idCicloAcademico || 0;
          
          if (this.cicloAcademicoSeleccionado) {
            this.cargarPreferencias();
          }
        } else {
          this.error = 'No se pudieron cargar los ciclos académicos';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = 'Error al cargar ciclos académicos: ' + (err.error?.message || '');
        this.loading = false;
        console.error(err);
      }
    });
  }

  cargarPreferencias(): void {
    if (!this.cicloAcademicoSeleccionado) {
      this.error = 'Seleccione un ciclo académico';
      return;
    }

    this.loading = true;
    this.error = '';

    this.docenteService.getPreferenciasDocentes(this.cicloAcademicoSeleccionado).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.status === 200 && Array.isArray(response.data)) {
          this.docentesPreferencias = response.data;
        } else {
          this.error = response.message || 'Error al cargar las preferencias';
          this.docentesPreferencias = [];
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error de conexión: ' + (err.error?.message || '');
        this.docentesPreferencias = [];
        console.error(err);
      }
    });
  }

  onCicloAcademicoChange(): void {
    if (this.cicloAcademicoSeleccionado) {
      this.cargarPreferencias();
    }
  }

  // VER DETALLES
  verDetalles(docente: DocentePreferencias): void {
    this.docenteSeleccionado = docente;
    this.mostrarModalDetalle = true;
  }

  // CERRAR MODAL
  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.docenteSeleccionado = null;
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }

  // Helper functions
  getEstadoBadgeClass(enabled: boolean): string {
    return enabled 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }

  getNombreCompleto(docente: DocentePreferencias): string {
    return `${docente.usuario.nombre} ${docente.usuario.apellido}`;
  }

  getCantidadPreferencias(docente: DocentePreferencias): number {
    return docente.preferencias.filter(p => p.enabled).length;
  }

  getCicloNombre(): string {
    const ciclo = this.ciclosAcademicos.find(c => c.idCicloAcademico === this.cicloAcademicoSeleccionado);
    return ciclo ? ciclo.nombre : '';
  }
}