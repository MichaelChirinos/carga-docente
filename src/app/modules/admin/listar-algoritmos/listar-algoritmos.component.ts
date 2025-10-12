// listar-algoritmos.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DirectorService } from '../services/director.service';
import { Algoritmo } from '../../../core/models/algoritmo.model';

@Component({
  selector: 'app-listar-algoritmos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-algoritmos.component.html'
})
export class ListarAlgoritmosComponent implements OnInit {
  algoritmos: Algoritmo[] = [];
  algoritmoSeleccionado: any = null;
  algoritmoEditando: any = null;
  algoritmoEliminando: any = null;
  
  loading: boolean = true;
  loadingDetalles: boolean = false;
  loadingEdicion: boolean = false;
  loadingEliminacion: boolean = false;
  
  error: string = '';
  errorForm: string = '';
  
  mostrarModalDetalles: boolean = false;
  mostrarModalEditar: boolean = false;
  mostrarModalEliminar: boolean = false;

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarAlgoritmos();
  }

  cargarAlgoritmos(): void {
    this.loading = true;
    this.directorService.obtenerAlgoritmos().subscribe({
      next: (response) => {
        this.algoritmos = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los algoritmos';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  // Ver detalles
  verDetalles(algoritmo: any): void {
    this.loadingDetalles = true;
    this.mostrarModalDetalles = true;
    this.errorForm = '';

    this.directorService.obtenerAlgoritmoPorId(algoritmo.idAlgoritmo).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.algoritmoSeleccionado = response.data;
        } else {
          this.errorForm = response.message || 'Algoritmo no encontrado';
        }
        this.loadingDetalles = false;
      },
      error: (err) => {
        this.errorForm = 'Error al cargar los detalles';
        this.loadingDetalles = false;
        console.error(err);
      }
    });
  }

  closeModalDetalles(): void {
    this.mostrarModalDetalles = false;
    this.algoritmoSeleccionado = null;
  }

  // Editar
  abrirEditar(algoritmo: any): void {
    this.algoritmoEditando = { ...algoritmo };
    this.mostrarModalEditar = true;
    this.errorForm = '';
  }

  closeModalEditar(): void {
    this.mostrarModalEditar = false;
    this.algoritmoEditando = null;
    this.loadingEdicion = false;
  }

  guardarEdicion(): void {
    if (!this.validarFormularioEdicion()) {
      this.errorForm = 'Por favor complete todos los campos requeridos';
      return;
    }

    this.loadingEdicion = true;
    this.errorForm = '';

    const datosActualizacion = {
      poblacion: this.algoritmoEditando.poblacion,
      generacionGa: this.algoritmoEditando.generacionGa,
      probCruzamientos: this.algoritmoEditando.probCruzamientos,
      probMutacion: this.algoritmoEditando.probMutacion,
      elitismo: this.algoritmoEditando.elitismo,
      enjambrePso: this.algoritmoEditando.enjambrePso,
      iteracionesPso: this.algoritmoEditando.iteracionesPso,
      inerciaInicial: this.algoritmoEditando.inerciaInicial,
      inerciaFinal: this.algoritmoEditando.inerciaFinal,
      cUno: this.algoritmoEditando.cUno,
      cDos: this.algoritmoEditando.cDos,
      velocidadMaxima: this.algoritmoEditando.velocidadMaxima,
      cicloHibridos: this.algoritmoEditando.cicloHibridos
    };

    this.directorService.actualizarAlgoritmo(this.algoritmoEditando.idAlgoritmo, datosActualizacion).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.cargarAlgoritmos(); // Recargar lista
          this.closeModalEditar();
        } else {
          this.errorForm = response.message || 'Error al actualizar';
        }
        this.loadingEdicion = false;
      },
      error: (err) => {
        this.errorForm = 'Error al actualizar el algoritmo';
        this.loadingEdicion = false;
        console.error(err);
      }
    });
  }

  // Eliminar
  abrirEliminar(algoritmo: any): void {
    this.algoritmoEliminando = { ...algoritmo };
    this.mostrarModalEliminar = true;
    this.errorForm = '';
  }

  closeModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.algoritmoEliminando = null;
    this.loadingEliminacion = false;
  }

  confirmarEliminacion(): void {
    this.loadingEliminacion = true;

    this.directorService.eliminarAlgoritmo(this.algoritmoEliminando.idAlgoritmo).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.cargarAlgoritmos(); // Recargar lista
          this.closeModalEliminar();
        } else {
          this.errorForm = response.message || 'Error al eliminar';
        }
        this.loadingEliminacion = false;
      },
      error: (err) => {
        this.errorForm = 'Error al eliminar el algoritmo';
        this.loadingEliminacion = false;
        console.error(err);
      }
    });
  }

  marcarComoPrincipal(id: number): void {
    if (confirm('¿Está seguro de marcar esta configuración como principal?')) {
      this.directorService.marcarAlgoritmoComoPrincipal(id).subscribe({
        next: (response) => {
          alert(response.message);
          this.cargarAlgoritmos();
        },
        error: (err) => {
          alert('Error al marcar como principal: ' + (err.error?.message || ''));
          console.error('Error:', err);
        }
      });
    }
  }

  private validarFormularioEdicion(): boolean {
    return this.algoritmoEditando?.poblacion > 0 &&
           this.algoritmoEditando?.generacionGa > 0 &&
           this.algoritmoEditando?.probCruzamientos >= 0 &&
           this.algoritmoEditando?.probMutacion >= 0 &&
           this.algoritmoEditando?.elitismo >= 0 &&
           this.algoritmoEditando?.enjambrePso > 0 &&
           this.algoritmoEditando?.iteracionesPso > 0 &&
           this.algoritmoEditando?.inerciaInicial >= 0 &&
           this.algoritmoEditando?.inerciaFinal >= 0 &&
           this.algoritmoEditando?.cUno >= 0 &&
           this.algoritmoEditando?.cDos >= 0 &&
           this.algoritmoEditando?.velocidadMaxima >= 0 &&
           this.algoritmoEditando?.cicloHibridos > 0;
  }

  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  prevenirCierre(event: Event): void {
    event.stopPropagation();
  }

  // Helper para formatear números
  formatearNumero(valor: number): string {
    return valor.toFixed(2);
  }

  // Helper para formatear porcentaje
  formatearPorcentaje(valor: number): string {
    return (valor * 100).toFixed(1) + '%';
  }
}