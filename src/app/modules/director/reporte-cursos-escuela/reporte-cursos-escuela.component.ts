// reporte-cursos-escuela.component.ts - VERSIÓN SIMPLIFICADA
import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reporte-cursos-escuela',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reporte-cursos-escuela.component.html'
})
export class ReporteCursosEscuelaComponent implements OnInit {
  ciclosAcademicos: any[] = [];
  escuelas: any[] = [];
  cargasAcademicas: any[] = [];
  idCicloAcademicoSeleccionado: number = 0;
  idEscuelaSeleccionada: number = 0;
  idCargaSeleccionada: number = 0;
  
  loadingCiclos = false;
  loadingEscuelas = false;
  loadingCargas = false;
  loadingReporte = false;
  
  message = '';
  isError = false;

  constructor(private directorService: DirectorService) {}

  ngOnInit(): void {
    this.cargarCiclosAcademicos();
    this.cargarEscuelas();
  }

  cargarCiclosAcademicos(): void {
    this.loadingCiclos = true;
    this.directorService.obtenerCiclosAcademicos().subscribe({
      next: (response: any) => {
        const ciclos = response.data || response || [];
        this.ciclosAcademicos = ciclos;
        
        const cicloActivo = ciclos.find((ciclo: any) => ciclo.enabled);
        if (cicloActivo) {
          this.idCicloAcademicoSeleccionado = cicloActivo.idCicloAcademico;
          this.cargarCargasAcademicas();
        } else if (ciclos.length > 0) {
          this.idCicloAcademicoSeleccionado = ciclos[0].idCicloAcademico;
          this.cargarCargasAcademicas();
        }
        
        this.loadingCiclos = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar ciclos académicos', true);
        this.loadingCiclos = false;
      }
    });
  }

  cargarEscuelas(): void {
    this.loadingEscuelas = true;
    this.directorService.obtenerEscuelas().subscribe({
      next: (response: any) => {
        this.escuelas = response.data || response || [];
        if (this.escuelas.length > 0) {
          this.idEscuelaSeleccionada = this.escuelas[0].idEscuela;
        }
        this.loadingEscuelas = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar escuelas', true);
        this.loadingEscuelas = false;
      }
    });
  }

  cargarCargasAcademicas(): void {
    if (!this.idCicloAcademicoSeleccionado) return;

    this.loadingCargas = true;
    this.cargasAcademicas = [];
    this.idCargaSeleccionada = 0;

    this.directorService.obtenerCargasAcademicasPorCiclo(this.idCicloAcademicoSeleccionado).subscribe({
      next: (response: any) => {
        this.cargasAcademicas = response.data || response || [];
        if (this.cargasAcademicas.length > 0) {
          this.idCargaSeleccionada = this.cargasAcademicas[0].idCarga;
        }
        this.loadingCargas = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar cargas académicas', true);
        this.loadingCargas = false;
      }
    });
  }

  onCicloChange(): void {
    this.cargarCargasAcademicas();
  }

  // PDF de Cursos por Escuela
  exportarPdfCursosEscuela(): void {
    if (!this.idCicloAcademicoSeleccionado || !this.idCargaSeleccionada || !this.idEscuelaSeleccionada) {
      this.showMessage('Por favor seleccione un ciclo académico, una carga académica y una escuela', true);
      return;
    }

    this.loadingReporte = true;
    this.directorService.exportarReportePdfCursosEscuela(
      this.idCicloAcademicoSeleccionado,
      this.idCargaSeleccionada,
      this.idEscuelaSeleccionada
    ).subscribe({
      next: (blob: Blob) => {
        const fecha = new Date().toISOString().split('T')[0];
        this.descargarArchivo(blob, 'application/pdf', `cursos-escuela-${this.idEscuelaSeleccionada}-${fecha}.pdf`);
        this.loadingReporte = false;
        this.showMessage('Reporte PDF generado exitosamente', false);
      },
      error: (err) => {
        this.showMessage('Error al generar el reporte PDF', true);
        this.loadingReporte = false;
      }
    });
  }

  // Excel de Cursos por Escuela
  exportarExcelCursosEscuela(): void {
    if (!this.idCicloAcademicoSeleccionado || !this.idCargaSeleccionada || !this.idEscuelaSeleccionada) {
      this.showMessage('Por favor seleccione un ciclo académico, una carga académica y una escuela', true);
      return;
    }

    this.loadingReporte = true;
    this.directorService.exportarReporteExcelCursosEscuela(
      this.idCicloAcademicoSeleccionado,
      this.idCargaSeleccionada,
      this.idEscuelaSeleccionada
    ).subscribe({
      next: (blob: Blob) => {
        const fecha = new Date().toISOString().split('T')[0];
        this.descargarArchivo(blob, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
          `cursos-escuela-${this.idEscuelaSeleccionada}-${fecha}.xlsx`);
        this.loadingReporte = false;
        this.showMessage('Reporte Excel generado exitosamente', false);
      },
      error: (err) => {
        this.showMessage('Error al generar el reporte Excel', true);
        this.loadingReporte = false;
      }
    });
  }

  // MÉTODO AUXILIAR PARA DESCARGAR ARCHIVOS
  private descargarArchivo(blob: Blob, contentType: string, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // MÉTODOS AUXILIARES
  getCicloSeleccionado(): string {
    const ciclo = this.ciclosAcademicos.find(c => c.idCicloAcademico === this.idCicloAcademicoSeleccionado);
    return ciclo ? ciclo.nombre : '';
  }

  getCargaSeleccionada(): string {
    const carga = this.cargasAcademicas.find(c => c.idCarga === this.idCargaSeleccionada);
    return carga ? `Carga ${carga.idCarga}` : '';
  }

  getEscuelaSeleccionada(): string {
    const escuela = this.escuelas.find(e => e.idEscuela === this.idEscuelaSeleccionada);
    return escuela ? escuela.nombre : '';
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}