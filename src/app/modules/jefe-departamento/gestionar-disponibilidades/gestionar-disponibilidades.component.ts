import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Disponibilidad {
  idDisponibilidad: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  enabled: boolean;
}

interface DocenteDisponibilidades {
  idDocente: number;
  usuario: {
    nombre: string;
    apellido: string;
  };
  disponibilidad: Disponibilidad[];
  enabled: boolean;
}

@Component({
  selector: 'app-gestionar-disponibilidades',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gestionar-disponibilidades.component.html'
})
export class GestionarDisponibilidadesComponent implements OnInit {
  docentesDisponibilidades: DocenteDisponibilidades[] = [];
  ciclosAcademicos: any[] = [];
  cicloAcademicoSeleccionado: number = 0;
  loading = true;
  error = '';
  searchTerm = '';

  // Estados para modal de detalles
  docenteSeleccionado: DocenteDisponibilidades | null = null;
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
            this.cargarDisponibilidades();
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

  cargarDisponibilidades(): void {
    if (!this.cicloAcademicoSeleccionado) {
      this.error = 'Seleccione un ciclo académico';
      return;
    }

    this.loading = true;
    this.error = '';

    this.docenteService.getDisponibilidadesDocentes(this.cicloAcademicoSeleccionado).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.status === 200 && Array.isArray(response.data)) {
          this.docentesDisponibilidades = response.data;
        } else {
          this.error = response.message || 'Error al cargar las disponibilidades';
          this.docentesDisponibilidades = [];
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error de conexión: ' + (err.error?.message || '');
        this.docentesDisponibilidades = [];
        console.error(err);
      }
    });
  }

  onCicloAcademicoChange(): void {
    if (this.cicloAcademicoSeleccionado) {
      this.cargarDisponibilidades();
    }
  }

  // VER DETALLES
  verDetalles(docente: DocenteDisponibilidades): void {
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

  getNombreCompleto(docente: DocenteDisponibilidades): string {
    return `${docente.usuario.nombre} ${docente.usuario.apellido}`;
  }

  getCantidadDisponibilidades(docente: DocenteDisponibilidades): number {
    return docente.disponibilidad.filter(d => d.enabled).length;
  }

  getCicloNombre(): string {
    const ciclo = this.ciclosAcademicos.find(c => c.idCicloAcademico === this.cicloAcademicoSeleccionado);
    return ciclo ? ciclo.nombre : '';
  }

  // Formatear hora para mostrar
  formatearHora(hora: string): string {
    return hora.substring(0, 5); // Convierte "14:00:00" a "14:00"
  }

  // Obtener días de la semana en español
  getDiaSemana(dia: string): string {
    const dias: { [key: string]: string } = {
      'LUNES': 'Lunes',
      'MARTES': 'Martes',
      'MIERCOLES': 'Miércoles',
      'JUEVES': 'Jueves',
      'VIERNES': 'Viernes',
      'SABADO': 'Sábado',
      'DOMINGO': 'Domingo'
    };
    return dias[dia] || dia;
  }

  // Ordenar disponibilidades por día de la semana
  getDisponibilidadesOrdenadas(disponibilidades: Disponibilidad[]): Disponibilidad[] {
    const ordenDias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
    return [...disponibilidades].sort((a, b) => 
      ordenDias.indexOf(a.diaSemana) - ordenDias.indexOf(b.diaSemana)
    );
  }
}