import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocenteService } from '../../../core/services/docente.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DisponibilidadRequest } from '../../../core/models/disponibilidad';

@Component({
  selector: 'app-registrar-disponibilidad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-disponibilidad.component.html'
})
export class RegistrarDisponibilidadComponent implements OnInit {
  disponibilidadForm: FormGroup;
  ciclosAcademicos: any[] = []; 
  diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']; 
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
      idCicloAcademico: [null, Validators.required],
      disponibilidades: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.idDisponibilidadEditar = +params['id'];
        this.cargarDatosEdicion();
      } else {
        this.agregarDisponibilidad(); // Solo agregar inicial si no está editando
      }
    });
    this.obtenerDocenteId();
    this.cargarCiclosAcademicos();
  }

  get disponibilidadesArray(): FormArray {
    return this.disponibilidadForm.get('disponibilidades') as FormArray;
  }

  agregarDisponibilidad(): void {
    this.disponibilidadesArray.push(this.fb.group({
      diaSemana: ['LUNES', Validators.required],
      horaInicio: ['08:00', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      horaFin: ['10:00', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]]
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
        // Limpiar y cargar solo una disponibilidad para edición
        this.disponibilidadesArray.clear();
        this.disponibilidadesArray.push(this.fb.group({
          diaSemana: [response.data.diaSemana, Validators.required],
          horaInicio: [response.data.horaInicio.substring(0, 5), Validators.required],
          horaFin: [response.data.horaFin.substring(0, 5), Validators.required]
        }));
        
        this.disponibilidadForm.patchValue({
          idCicloAcademico: response.data.cicloAcademico.idCicloAcademico
        });
        
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar datos para edición: ' + (err.error?.message || ''), true);
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
        this.showMessage('Error al obtener datos del docente: ' + (err.error?.message || ''), true);
        this.isLoading = false;
      }
    });
  }

  cargarCiclosAcademicos(): void {
    this.isLoading = true;
    this.docenteService.obtenerCiclosAcademicos().subscribe({
      next: (response) => {
        this.ciclosAcademicos = response.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.showMessage('Error al cargar ciclos académicos: ' + (err.error?.message || ''), true);
        this.isLoading = false;
      }
    });
  }

  validarHorarios(): boolean {
    for (let i = 0; i < this.disponibilidadesArray.length; i++) {
      const disp = this.disponibilidadesArray.at(i);
      const horaInicio = disp.get('horaInicio')?.value;
      const horaFin = disp.get('horaFin')?.value;
      
      if (horaInicio >= horaFin) {
        this.showMessage(`La hora de inicio debe ser menor que la hora de fin en la disponibilidad ${i + 1}`, true);
        return false;
      }
    }
    return true;
  }

  onSubmit(): void {
    if (this.disponibilidadForm.invalid || !this.idDocente) {
      this.showMessage('Complete todos los campos requeridos', true);
      return;
    }

    if (!this.validarHorarios()) {
      return;
    }

    const formValue = this.disponibilidadForm.value;
    
    const requests: DisponibilidadRequest[] = this.disponibilidadesArray.value.map((disp: any) => ({
      idDocente: this.idDocente,
      idCicloAcademico: formValue.idCicloAcademico,
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
          this.showMessage(response.message || 'Disponibilidad actualizada correctamente', false);
          setTimeout(() => {
            this.router.navigate(['/docente/gestionar-disponibilidad']);
          }, 1500);
        },
        error: (err) => {
          this.showMessage('Error al actualizar: ' + (err.error?.message || err.message), true);
          this.isLoading = false;
        }
      });
    } else {
      // Registro múltiple
      this.registrarDisponibilidadesIndividualmente(requests);
    }
  }

  private registrarDisponibilidadesIndividualmente(requests: DisponibilidadRequest[]): void {
    const registros = requests.map(disponibilidad => 
      this.docenteService.registrarDisponibilidad(disponibilidad).toPromise()
    );

    Promise.all(registros)
      .then(results => {
        this.isLoading = false;
        const exitosos = results.filter(r => r?.status === 201 || r?.status === 200).length;
        const errores = results.filter(r => r?.status !== 201 && r?.status !== 200).length;
        
        if (errores === 0) {
          this.showMessage(`Se registraron ${exitosos} disponibilidades correctamente`, false);
        } else {
          this.showMessage(`Se registraron ${exitosos} de ${requests.length} disponibilidades. ${errores} tuvieron errores.`, true);
        }
        
        setTimeout(() => {
          this.router.navigate(['/docente/gestionar-disponibilidad']);
        }, 2000);
      })
      .catch(err => {
        this.isLoading = false;
        this.showMessage('Error al registrar disponibilidades: ' + (err.error?.message || err.message), true);
      });
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}