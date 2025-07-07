import { Component, OnInit } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CicloAcademicoRequest } from '../../../core/models/ciclo-academico';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registrar-ciclo-academico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-ciclo-academico.component.html'
})
export class RegistrarCicloAcademicoComponent implements OnInit {
  fechaInicioInput = '';
  fechaFinInput = '';
  isEditing = false;
  cicloId?: number;

  cicloData: CicloAcademicoRequest = {
    anio: new Date().getFullYear(),
    periodo: 1,
    fechaInicio: '',
    fechaFin: ''
  };

  periodos = [
    { value: 1, label: 'I' },
    { value: 2, label: 'II' }
  ];

  isLoading = false;
  message = '';
  isError = false;
  formSubmitted = false;

  constructor(
    private directorService: DirectorService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.cicloId = +id;
      this.cargarCiclo(this.cicloId);
    }
  }

  cargarCiclo(id: number): void {
    this.isLoading = true;
    this.directorService.obtenerCicloAcademicoById(id).subscribe({
      next: (response: any) => {
        const ciclo = response.data || response;
        this.cicloData = {
          anio: ciclo.anio,
          periodo: ciclo.periodo,
          fechaInicio: ciclo.fechaInicio,
          fechaFin: ciclo.fechaFin
        };
        
        // Formatear fechas para los inputs
        this.fechaInicioInput = this.parseBackendDate(ciclo.fechaInicio);
        this.fechaFinInput = this.parseBackendDate(ciclo.fechaFin);
        
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar ciclo académico', true);
        this.isLoading = false;
        this.router.navigate(['/director/gestionar-ciclos-academicos']);
      }
    });
  }

  submitForm(form: NgForm): void {
    this.formSubmitted = true;
    if (form.invalid) return;

    this.cicloData.fechaInicio = this.formatDate(this.fechaInicioInput);
    this.cicloData.fechaFin = this.formatDate(this.fechaFinInput);

    this.isLoading = true;

    if (this.isEditing && this.cicloId) {
      this.directorService.actualizarCicloAcademico(this.cicloId, this.cicloData).subscribe({
        next: (response) => {
          this.showMessage('Ciclo académico actualizado con éxito', false);
          setTimeout(() => this.router.navigate(['/director/gestionar-ciclos-academicos']), 1500);
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.directorService.registrarCicloAcademico(this.cicloData).subscribe({
        next: (response) => {
          this.showMessage('Ciclo académico registrado con éxito', false);
          setTimeout(() => this.router.navigate(['/director/gestionar-ciclos-academicos']), 1500);
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleError(err: any): void {
    this.showMessage('Error: ' + (err.error?.message || 'Intente nuevamente'), true);
    console.error(err);
    this.isLoading = false;
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private parseBackendDate(backendDate: string): string {
    if (!backendDate) return '';
    const [year, month, day] = backendDate.split('-');
    return `${year}-${month}-${day}`;
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    this.isLoading = false;
    setTimeout(() => this.message = '', 3000);
  }
}