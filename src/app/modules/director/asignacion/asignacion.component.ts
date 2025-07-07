import { Component } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asignacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.scss']
})
export class AsignacionComponent {
  loading = false;
  error = false;
  success = false;
  message = '';

  constructor(
    private docenteService: DocenteService,
    private router: Router
  ) {}

  ejecutarAlgoritmo(idCargaElectiva: number = 1): void {
    this.loading = true;
    this.error = false;
    this.success = false;

    this.docenteService.ejecutarAlgoritmoAsignacion(idCargaElectiva).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = true;
        this.message = 'Algoritmo ejecutado correctamente';
        setTimeout(() => {
          this.router.navigate(['/director/listar-asignaciones']);
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