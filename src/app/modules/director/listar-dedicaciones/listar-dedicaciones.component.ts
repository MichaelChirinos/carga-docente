import { Component } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { Dedicacion } from '../../../core/models/docente.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-dedicaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './listar-dedicaciones.component.html'
})
export class ListarDedicacionesComponent {
  dedicaciones: Dedicacion[] = [];
  loading = true;
  error = '';

  constructor(
    private docenteService: DocenteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDedicaciones();
  }

  cargarDedicaciones(): void {
    this.loading = true;
    this.docenteService.getDedicaciones().subscribe({
      next: (data) => {
        this.dedicaciones = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar dedicaciones';
        this.loading = false;
        console.error(err);
      }
    });
  }

  editarDedicacion(id: number): void {
    this.router.navigate(['/director/editar-dedicacion', id]);
  }
}