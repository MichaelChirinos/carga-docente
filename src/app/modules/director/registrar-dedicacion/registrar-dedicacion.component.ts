import { Component, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { Dedicacion } from '../../../core/models/docente.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registrar-dedicacion',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registrar-dedicacion.component.html',
  styleUrls: ['./registrar-dedicacion.component.scss']
})
export class RegistrarDedicacionComponent implements OnInit {
  // Modo individual
  dedicacion: Omit<Dedicacion, 'idDedicacion' | 'enabled'> = {
    nombre: '',
    horasTotales: 0,
    horasLectivasMinima: 0
  };

  // Modo múltiple
  dedicacionesLista: Omit<Dedicacion, 'idDedicacion' | 'enabled'>[] = [];
  nuevaDedicacion: Omit<Dedicacion, 'idDedicacion' | 'enabled'> = {
    nombre: '',
    horasTotales: 0,
    horasLectivasMinima: 0
  };
  modoMultiple: boolean = false;

  // Estados compartidos
  formSubmitted = false;
  isEditing = false;
  isLoading = false;
  message = '';
  isError = false;
  idDedicacion?: number;

  constructor(
    private docenteService: DocenteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.idDedicacion = +id;
      this.cargarDedicacion(this.idDedicacion);
    }
  }
registrarDedicaciones(): void {
  this.guardarMultiplesDedicaciones();
}
  cargarDedicacion(id: number): void {
    this.isLoading = true;
    this.docenteService.getDedicacionById(id).subscribe({
      next: (dedicacion) => {
        this.dedicacion = {
          nombre: dedicacion.nombre,
          horasTotales: dedicacion.horasTotales,
          horasLectivasMinima: dedicacion.horasLectivasMinima
        };
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar dedicación', true);
        this.isLoading = false;
        this.router.navigate(['/director/gestionar-dedicaciones']);
      }
    });
  }

  agregarDedicacion(): void {
    if (this.validarDedicacion(this.nuevaDedicacion)) {
      this.dedicacionesLista.push({
        nombre: this.nuevaDedicacion.nombre.trim(),
        horasTotales: Number(this.nuevaDedicacion.horasTotales),
        horasLectivasMinima: Number(this.nuevaDedicacion.horasLectivasMinima)
      });
      this.nuevaDedicacion = { nombre: '', horasTotales: 0, horasLectivasMinima: 0 };
    }
  }

  eliminarDedicacion(index: number): void {
    this.dedicacionesLista.splice(index, 1);
  }

  guardarDedicacion() {
    this.formSubmitted = true;

    if (this.modoMultiple) {
      this.guardarMultiplesDedicaciones();
    } else {
      this.guardarDedicacionIndividual();
    }
  }

  private guardarDedicacionIndividual() {
    if (!this.validarDedicacion(this.dedicacion)) return;

    this.isLoading = true;
    const dedicacionData = {
      nombre: this.dedicacion.nombre.trim(),
      horasTotales: Number(this.dedicacion.horasTotales),
      horasLectivasMinima: Number(this.dedicacion.horasLectivasMinima)
    };

    if (this.isEditing && this.idDedicacion) {
      this.docenteService.actualizarDedicacion(this.idDedicacion, dedicacionData)
        .subscribe({
          next: () => {
            this.showMessage('Dedicación actualizada con éxito', false);
            setTimeout(() => this.router.navigate(['/director/gestionar-dedicaciones']), 1500);
          },
          error: (err) => this.handleError(err)
        });
    } else {
      this.docenteService.addDedicacion(dedicacionData)
        .subscribe({
          next: () => {
            this.showMessage('Dedicación registrada con éxito', false);
            setTimeout(() => this.router.navigate(['/director/gestionar-dedicaciones']), 1500);
          },
          error: (err) => this.handleError(err)
        });
    }
  }

  private guardarMultiplesDedicaciones() {
    if (this.dedicacionesLista.length === 0) {
      this.showMessage('Debe agregar al menos una dedicación', true);
      return;
    }

    this.isLoading = true;
    this.docenteService.registrarDedicacionesMultiples(this.dedicacionesLista)
      .subscribe({
        next: (response) => {
          this.showMessage(response.message || 'Dedicaciones registradas con éxito', false);
          setTimeout(() => this.router.navigate(['/director/gestionar-dedicaciones']), 1500);
        },
        error: (err) => this.handleError(err)
      });
  }

  private validarDedicacion(dedicacion: Omit<Dedicacion, 'idDedicacion' | 'enabled'>): boolean {
    if (dedicacion.horasTotales <= 0) {
      this.showMessage('Las horas totales deben ser mayores a 0', true);
      return false;
    }
    if (dedicacion.horasLectivasMinima <= 0) {
      this.showMessage('Las horas lectivas mínimas deben ser mayores a 0', true);
      return false;
    }
    if (dedicacion.horasLectivasMinima > dedicacion.horasTotales) {
      this.showMessage('Las horas lectivas mínimas no pueden ser mayores que las horas totales', true);
      return false;
    }
    return true;
  }

  private handleError(err: any): void {
    this.showMessage('Error: ' + (err.error?.message || 'Intente nuevamente'), true);
    console.error(err);
    this.isLoading = false;
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    this.isLoading = false;
    setTimeout(() => this.message = '', 5000);
  }
}