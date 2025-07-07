import { Component } from '@angular/core';
import { DirectorService } from '../../admin/services/director.service';
import { PlanEstudioRequest, PlanEstudioResponse } from '../../../core/models/plan-estudio';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FacultadResponse } from '../../../core/models/facultad';

@Component({
  selector: 'app-registrar-plan-estudio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-plan-estudio.component.html',
  styleUrls: ['./registrar-plan-estudio.component.scss']
})
export class RegistrarPlanEstudioComponent {
  planesLista: PlanEstudioRequest[] = [];
  nuevoPlan: PlanEstudioRequest = {
    idFacultad: 0,
    nombre: ''
  };
  facultades: any[] = [];
  isLoading = false;
  message = '';
  isError = false;

  constructor(
    private directorService: DirectorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarFacultades();
  }

  cargarFacultades() {
    this.isLoading = true;
    this.directorService.obtenerFacultades().subscribe({
      next: (response: FacultadResponse) => {
        this.facultades = response.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar facultades', true);
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  // Método para obtener el nombre de la facultad
  getNombreFacultad(idFacultad: number): string {
    const facultad = this.facultades.find(f => f.idFacultad === idFacultad);
    return facultad ? facultad.nombre : '';
  }

  agregarPlan(): void {
    if (this.validarPlan(this.nuevoPlan)) {
      this.planesLista.push({
        idFacultad: this.nuevoPlan.idFacultad,
        nombre: this.nuevoPlan.nombre.trim()
      });
      this.nuevoPlan = { idFacultad: 0, nombre: '' };
    }
  }

  eliminarPlan(index: number): void {
    this.planesLista.splice(index, 1);
  }

  registrarPlanes(): void {
    if (this.planesLista.length === 0) {
      this.showMessage('Debe agregar al menos un plan de estudio', true);
      return;
    }

    this.isLoading = true;
    this.directorService.registrarPlanesMultiples(this.planesLista).subscribe({
      next: (response: PlanEstudioResponse) => {
        this.showMessage(response.message || 'Planes registrados con éxito', false);
        setTimeout(() => this.router.navigate(['/director/gestionar-planes-estudio']), 1500);
      },
      error: (err) => {
        this.showMessage('Error: ' + (err.error?.message || 'No se pudieron registrar los planes'), true);
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  private validarPlan(plan: PlanEstudioRequest): boolean {
    if (!plan.nombre?.trim()) {
      this.showMessage('El nombre del plan es obligatorio', true);
      return false;
    }
    if (plan.idFacultad <= 0) {
      this.showMessage('Debe seleccionar una facultad', true);
      return false;
    }
    return true;
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}