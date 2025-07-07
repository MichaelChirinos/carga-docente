import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-preferencia',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './listar-preferencia.component.html',
  styleUrls: ['./listar-preferencia.component.scss']
})
export class ListarPreferenciaComponent implements OnInit {
  preferencias: any[] = [];
  cargasElectivas: any[] = [];
  idCargaElectivaSeleccionada: number | null = null;
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
          this.cargarPreferencias();
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
      this.cargarPreferencias();
    }
  }

  cargarPreferencias() {
    if (!this.idDocente || !this.idCargaElectivaSeleccionada) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    
    this.docenteService.getPreferenciasDocente(this.idDocente, this.idCargaElectivaSeleccionada).subscribe({
      next: (preferencias) => {
        this.preferencias = preferencias || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando preferencias:', err);
        this.isLoading = false;
      }
    });
  }

  editarPreferencia(id: number) {
    this.router.navigate(['/docente/editar-preferencia', id]);
  }

}