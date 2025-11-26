import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gestionar-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gestionar-reportes.component.html'
})
export class GestionarReportesComponent implements OnInit {
  ciclosAcademicos: any[] = [];
  cargasAcademicas: any[] = [];
  idCicloAcademicoSeleccionado: number = 0;
  idCargaSeleccionada: number = 0;
  
  // Estados
  loading = false;
  loadingCiclos = false;
  loadingCargas = false;
  loadingReporte = false;
  
  // Resultados
  resultadoCarga: any = null;
  
  // Mensajes
  message = '';
  isError = false;

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

  cargarCargasAcademicas(): void {
    if (!this.idCicloAcademicoSeleccionado) return;

    this.loadingCargas = true;
    this.cargasAcademicas = [];
    this.idCargaSeleccionada = 0;
    this.resultadoCarga = null;

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

  onCargaChange(): void {
    this.resultadoCarga = null;
    if (this.idCargaSeleccionada) {
      this.cargarResultadoCarga();
    }
  }

  cargarResultadoCarga(): void {
    if (!this.idCargaSeleccionada) return;

    this.directorService.obtenerResultadoPorCarga(this.idCargaSeleccionada).subscribe({
      next: (response: any) => {
        this.resultadoCarga = response.data || null;
      },
      error: (err) => {
        this.resultadoCarga = null;
      }
    });
  }

  // EXPORTAR PDF
  exportarPdf(): void {
    if (!this.idCargaSeleccionada) {
      this.showMessage('Por favor seleccione una carga académica', true);
      return;
    }

    this.loadingReporte = true;
    this.directorService.exportarReportePdfCargaElectiva(this.idCargaSeleccionada).subscribe({
      next: (blob: Blob) => {
        this.descargarArchivo(blob, 'application/pdf', `reporte-carga-${this.idCargaSeleccionada}.pdf`);
        this.loadingReporte = false;
        this.showMessage('Reporte PDF generado exitosamente', false);
      },
      error: (err) => {
        this.showMessage('Error al generar el reporte PDF', true);
        this.loadingReporte = false;
      }
    });
  }

  // EXPORTAR EXCEL
  exportarExcel(): void {
    if (!this.idCargaSeleccionada) {
      this.showMessage('Por favor seleccione una carga académica', true);
      return;
    }

    this.loadingReporte = true;
    this.directorService.exportarReporteExcelCargaElectiva(this.idCargaSeleccionada).subscribe({
      next: (blob: Blob) => {
        this.descargarArchivo(blob, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', `reporte-carga-${this.idCargaSeleccionada}.xlsx`);
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
    link.click();
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

  calcularPorcentaje(asignados: number, total: number): number {
    if (!total || total === 0) return 0;
    return Math.round((asignados / total) * 100);
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }

formatearFecha(fecha: string): string {
  if (!fecha) return 'N/A';
  return new Date(fecha).toLocaleDateString('es-ES');
}
}