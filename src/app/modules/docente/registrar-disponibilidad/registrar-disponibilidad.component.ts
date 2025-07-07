import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocenteService } from '../../../core/services/docente.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-disponibilidad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-disponibilidad.component.html',
  styleUrls: ['./registrar-disponibilidad.component.scss']
})
export class RegistrarDisponibilidadComponent implements OnInit {
  disponibilidadForm: FormGroup;
  cargasElectivas: any[] = [];
  diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  idDocente: number = 0;
  isEditing = false;
  idDisponibilidadEditar: number | null = null;
  
  isLoading = false;
  message = '';
  isError = false;

  constructor(
    private fb: FormBuilder,
    private docenteService: DocenteService,
    private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.disponibilidadForm = this.fb.group({
      idCargaElectiva: [null, Validators.required],
      disponibilidades: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.idDisponibilidadEditar = +params['id'];
        this.cargarDatosEdicion();
      }
    });
    this.obtenerDocenteId();
    this.cargarCargasElectivas();
    this.agregarDisponibilidad();
  }

  get disponibilidadesArray(): FormArray {
    return this.disponibilidadForm.get('disponibilidades') as FormArray;
  }

  agregarDisponibilidad(): void {
    this.disponibilidadesArray.push(this.fb.group({
      diaSemana: ['lunes', Validators.required],
      horaInicio: ['08:00', Validators.required],
      horaFin: ['10:00', Validators.required]
    }));
  }

  eliminarDisponibilidad(index: number): void {
    if (this.disponibilidadesArray.length > 1) {
      this.disponibilidadesArray.removeAt(index);
    }
  }

  cargarDatosEdicion(): void {
    this.isLoading = true;
    this.docenteService.getDisponibilidadById(this.idDisponibilidadEditar!).subscribe({
      next: (response) => {
        this.disponibilidadesArray.clear();
        this.disponibilidadesArray.push(this.fb.group({
          diaSemana: [response.data.diaSemana, Validators.required],
          horaInicio: [response.data.horaInicio.substring(0, 5), Validators.required],
          horaFin: [response.data.horaFin.substring(0, 5), Validators.required]
        }));
        
        this.disponibilidadForm.patchValue({
          idCargaElectiva: response.data.cargaElectiva.idCargaElectiva
        });
        
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar datos para edición', true);
        this.isLoading = false;
      }
    });
  }

  obtenerDocenteId(): void {
    const usuario = this.authService.getCurrentUser();
    if (!usuario?.idUsuario) {
      this.showMessage('No se pudo identificar al docente', true);
      return;
    }

    this.isLoading = true;
    this.docenteService.getDocenteByUsuario(usuario.idUsuario).subscribe({
      next: (docente) => {
        this.idDocente = docente.idDocente;
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al obtener datos del docente', true);
        this.isLoading = false;
      }
    });
  }

  cargarCargasElectivas(): void {
    this.isLoading = true;
    this.docenteService.obtenerTodasCargasElectivas().subscribe({
      next: (response: any) => {
        this.cargasElectivas = response.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar cargas electivas', true);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.disponibilidadForm.invalid || !this.idDocente) {
      this.showMessage('Complete todos los campos requeridos', true);
      return;
    }

    const formValue = this.disponibilidadForm.value;
    const requests = this.disponibilidadesArray.value.map((disp: any) => ({
      idDocente: this.idDocente,
      idCargaElectiva: formValue.idCargaElectiva,
      diaSemana: disp.diaSemana,
      horaInicio: disp.horaInicio,
      horaFin: disp.horaFin
    }));

    this.isLoading = true;

    if (this.isEditing && this.idDisponibilidadEditar) {
      // Edición individual
      this.docenteService.actualizarDisponibilidad(
        this.idDisponibilidadEditar, 
        requests[0]
      ).subscribe({
        next: (response) => {
          this.showMessage(response.message, false);
          this.router.navigate(['/docente/gestionar-disponibilidad']);
        },
        error: (err) => {
          this.showMessage('Error al actualizar: ' + err.error?.message, true);
          this.isLoading = false;
        }
      });
    } else {
      // Registro múltiple
      this.docenteService.registrarDisponibilidadesMultiples(requests).subscribe({
        next: (response) => {
          this.showMessage(response.message, false);
          this.router.navigate(['/docente/gestionar-disponibilidad']);
        },
        error: (err) => {
          this.showMessage('Error al registrar: ' + err.error?.message, true);
          this.isLoading = false;
        }
      });
    }
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}