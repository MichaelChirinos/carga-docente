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
        
        // Formatear fechas para los inputs (los inputs type="date" necesitan yyyy-MM-dd)
        this.fechaInicioInput = this.formatDateForInput(ciclo.fechaInicio);
        this.fechaFinInput = this.formatDateForInput(ciclo.fechaFin);
        
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar ciclo académico', true);
        this.isLoading = false;
        this.router.navigate(['/Departamento Academico/gestionar-ciclos-academicos']);
      }
    });
  }

  submitForm(form: NgForm): void {
    this.formSubmitted = true;
    if (form.invalid) return;

    // Convertir a formato yyyy-MM-dd para el backend
    this.cicloData.fechaInicio = this.formatDateForBackend(this.fechaInicioInput);
    this.cicloData.fechaFin = this.formatDateForBackend(this.fechaFinInput);

    this.isLoading = true;

    if (this.isEditing && this.cicloId) {
      this.directorService.actualizarCicloAcademico(this.cicloId, this.cicloData).subscribe({
        next: (response) => {
          this.showMessage('Ciclo académico actualizado con éxito', false);
          setTimeout(() => this.router.navigate(['/Departamento Academico/gestionar-ciclos-academicos']), 1500);
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.directorService.registrarCicloAcademico(this.cicloData).subscribe({
        next: (response) => {
          this.showMessage('Ciclo académico registrado con éxito', false);
          setTimeout(() => this.router.navigate(['/Departamento Academico/gestionar-ciclos-academicos']), 1500);
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleError(err: any): void {
    const errorMessage = err.error?.data?.[0]?.message || err.error?.message || 'Intente nuevamente';
    this.showMessage('Error: ' + errorMessage, true);
    console.error('Error detallado:', err);
    this.isLoading = false;
  }

  // Formatear para el backend: yyyy-MM-dd
  private formatDateForBackend(dateString: string): string {
    if (!dateString) return '';
    
    // Si ya está en formato yyyy-MM-dd, devolverlo
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    
    // Convertir de cualquier formato a yyyy-MM-dd
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  // Formatear para el input type="date": yyyy-MM-dd
  private formatDateForInput(backendDate: string): string {
    if (!backendDate) return '';
    
    // Si ya está en formato yyyy-MM-dd, devolverlo
    if (backendDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return backendDate;
    }
    
    // Convertir de dd-MM-yyyy a yyyy-MM-dd
    if (backendDate.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const [day, month, year] = backendDate.split('-');
      return `${year}-${month}-${day}`;
    }
    
    // Para cualquier otro formato, usar Date
    const date = new Date(backendDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    this.isLoading = false;
    setTimeout(() => this.message = '', 5000); // Aumenté a 5 segundos para leer mejor los errores
  }
}