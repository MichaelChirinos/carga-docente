import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-asignacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asignacion.component.html'
})
export class AsignacionComponent implements OnInit {
  loading = false;
  error = false;
  success = false;
  message = '';
  ciclosAcademicos: any[] = [];
  cicloAcademicoSeleccionado: any = null;
  cicloAcademicoActivo: any = null;

  constructor(
    private docenteService: DocenteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerCiclosAcademicos();
  }

  obtenerCiclosAcademicos(): void {
    this.docenteService.obtenerCiclosAcademicos().subscribe({
      next: (response: any) => {
        const ciclos = response.data || response;
        this.ciclosAcademicos = ciclos;
        
        // Encontrar el ciclo académico activo para mostrar como sugerencia
        this.cicloAcademicoActivo = ciclos.find((ciclo: any) => ciclo.enabled);
        
        // Seleccionar automáticamente el ciclo activo si existe
        if (this.cicloAcademicoActivo) {
          this.cicloAcademicoSeleccionado = this.cicloAcademicoActivo.idCicloAcademico;
        }
        
        if (this.ciclosAcademicos.length === 0) {
          this.error = true;
          this.message = 'No hay ciclos académicos disponibles';
        }
      },
      error: (err) => {
        console.error('Error al obtener ciclos académicos:', err);
        this.error = true;
        this.message = 'Error al cargar ciclos académicos';
      }
    });
  }

  obtenerCicloSeleccionado(): any {
    return this.ciclosAcademicos.find(ciclo => 
      ciclo.idCicloAcademico === this.cicloAcademicoSeleccionado
    );
  }

  ejecutarAlgoritmo(): void {
    if (!this.cicloAcademicoSeleccionado) {
      this.error = true;
      this.message = 'Debe seleccionar un ciclo académico';
      return;
    }

    this.loading = true;
    this.error = false;
    this.success = false;

    this.docenteService.ejecutarAlgoritmoAsignacion(this.cicloAcademicoSeleccionado).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = true;
        this.message = response.message || 'Algoritmo ejecutado correctamente';
        setTimeout(() => {
          this.router.navigate(['/Departamento Academico/listar-asignaciones']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error al ejecutar algoritmo:', err);
        this.loading = false;
        this.error = true;
        this.message = err.error?.message || 'Error al ejecutar el algoritmo';
      }
    });
  }
}