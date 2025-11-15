import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DisponibilidadResponse } from '../../../core/models/disponibilidad';

@Component({
  selector: 'app-listar-disponibilidad',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './listar-disponibilidad.component.html'
})
export class ListarDisponibilidadComponent implements OnInit {
  
  disponibilidades: DisponibilidadResponse[] = [];
  ciclosAcademicos: any[] = [];
  idCicloAcademicoSeleccionado: number = 0;
  isLoading = true;
  idDocente: number | null = null;
  eliminandoId: number | null = null;
  message = '';
  isError = false;

  constructor(
    private docenteService: DocenteService,
    private authService: AuthService,
    private router: Router
  ) {}

  formatHora(horaString: string): string {
    if (!horaString) return '';
    return horaString.substring(0, 5);
  }

  ngOnInit() {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales() {
    const usuario = this.authService.getCurrentUser();
    if (!usuario?.idUsuario) {
      this.isLoading = false;
      this.showMessage('No se pudo identificar al docente', true);
      return;
    }

    this.isLoading = true;
    
    this.docenteService.getDocenteByUsuario(usuario.idUsuario).subscribe({
      next: (docente) => {
        this.idDocente = docente.idDocente;
        this.cargarCiclosAcademicos();
      },
      error: (err) => {
        console.error('Error obteniendo docente:', err);
        this.showMessage('Error al cargar datos del docente', true);
        this.isLoading = false;
      }
    });
  }

  cargarCiclosAcademicos() {
    this.docenteService.obtenerCiclosAcademicos().subscribe({
      next: (response) => {
        this.ciclosAcademicos = response.data || [];
        if (this.ciclosAcademicos.length > 0) {
          this.idCicloAcademicoSeleccionado = this.ciclosAcademicos[0].idCicloAcademico;
          this.cargarDisponibilidades(this.idDocente!, this.idCicloAcademicoSeleccionado);
        } else {
          this.isLoading = false;
          this.showMessage('No hay ciclos académicos disponibles', true);
        }
      },
      error: (err) => {
        console.error('Error cargando ciclos académicos:', err);
        this.showMessage('Error al cargar ciclos académicos', true);
        this.isLoading = false;
      }
    });
  }

  onCicloAcademicoChange() {
    if (this.idCicloAcademicoSeleccionado && this.idDocente) {
      this.cargarDisponibilidades(this.idDocente, this.idCicloAcademicoSeleccionado);
    }
  }

  cargarDisponibilidades(idDocente: number, idCicloAcademico: number) {
    this.isLoading = true;
    this.docenteService.getDisponibilidades(idDocente, idCicloAcademico).subscribe({
      next: (response) => {
        console.log('Respuesta completa del servicio:', response);
        console.log('Data recibida:', response.data);
        
        if (response.data && response.data.length > 0) {
          console.log('Primera disponibilidad:', response.data[0]);
          console.log('Ciclo académico de la primera:', response.data[0].cicloAcademico);
        }
        
        this.disponibilidades = response.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando disponibilidades:', err);
        this.showMessage('Error al cargar los horarios de disponibilidad', true);
        this.isLoading = false;
      }
    });
  }

  editarDisponibilidad(id: number) {
    this.router.navigate(['/Docente/editar-disponibilidad', id]);
  }

  eliminarDisponibilidad(id: number) {
    if (!confirm('¿Está seguro de que desea eliminar este horario de disponibilidad?')) {
      return;
    }

    this.eliminandoId = id;
    
    this.docenteService.eliminarDisponibilidad(id).subscribe({
      next: (response) => {
        this.showMessage(response.message || 'Horario eliminado correctamente', false);
        
        if (this.idDocente && this.idCicloAcademicoSeleccionado) {
          this.cargarDisponibilidades(this.idDocente, this.idCicloAcademicoSeleccionado);
        }
        
        this.eliminandoId = null;
      },
      error: (err) => {
        console.error('Error eliminando disponibilidad:', err);
        this.showMessage('Error al eliminar el horario: ' + (err.error?.message || ''), true);
        this.eliminandoId = null;
      }
    });
  }

  // Método helper para manejar cicloAcademico de forma segura
  getCicloAcademicoNombre(disponibilidad: DisponibilidadResponse): string {
    return disponibilidad.cicloAcademico?.nombre || 'N/A';
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}