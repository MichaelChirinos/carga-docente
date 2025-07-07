import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-disponibilidad',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './listar-disponibilidad.component.html',
  styleUrls: ['./listar-disponibilidad.component.scss']
})
export class ListarDisponibilidadComponent implements OnInit {
formatHora(horaString: string): string {
  // Convierte "08:00:00" a "08:00"
  if (!horaString) return '';
  return horaString.substring(0, 5);
}
  disponibilidades: any[] = [];
  cargasElectivas: any[] = [];
  idCargaElectivaSeleccionada: number = 0;
  isLoading = true;
  idDocente: number | null = null;

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
      next: (docente) => {
        this.idDocente = docente.idDocente;
        this.cargarCargasElectivas();
      },
      error: (err) => {
        console.error('Error obteniendo docente:', err);
        this.isLoading = false;
      }
    });
  }

  cargarCargasElectivas() {
    this.docenteService.obtenerTodasCargasElectivas().subscribe({
      next: (cargas) => {
        this.cargasElectivas = cargas.data || [];
        if (this.cargasElectivas.length > 0) {
          // Seleccionar la primera carga electiva por defecto
          this.idCargaElectivaSeleccionada = this.cargasElectivas[0].idCargaElectiva;
          this.cargarDisponibilidades(this.idDocente!, this.idCargaElectivaSeleccionada);
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error cargando cargas electivas:', err);
        this.isLoading = false;
      }
    });
  }

  onCargaElectivaChange() {
    if (this.idCargaElectivaSeleccionada && this.idDocente) {
      this.cargarDisponibilidades(this.idDocente, this.idCargaElectivaSeleccionada);
    }
  }

  cargarDisponibilidades(idDocente: number, idCargaElectiva: number) {
    this.docenteService.getDisponibilidades(idDocente, idCargaElectiva).subscribe({
      next: (response: any) => {
        this.disponibilidades = response.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando disponibilidades:', err);
        this.isLoading = false;
      }
    });
  }

  editarDisponibilidad(id: number) {
    this.router.navigate(['/docente/editar-disponibilidad', id]);
  }
}