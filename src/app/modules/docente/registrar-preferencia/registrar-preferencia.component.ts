import { Component, Input, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PreferenciaRequest, CargaElectiva, PreferenciaMultipleRequest } from '../../../core/models/preferencia.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface AsignaturaSelect {
  idAsignatura: number;
  codigo: string;
  nombre: string;
  enabled: boolean;
}

@Component({
  selector: 'app-registrar-preferencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-preferencia.component.html',
  styleUrls: ['./registrar-preferencia.component.scss']
})
export class RegistrarPreferenciaComponent implements OnInit {
  modoMultiple = false;
  preferenciaData: PreferenciaRequest = {
    idDocente: 0,
    idAsignatura: 0,
    idCargaElectiva: 0
  };

  preferenciasMultiples: PreferenciaMultipleRequest = {
    preferencias: [this.createEmptyPreferencia()]
  };

  asignaturas: AsignaturaSelect[] = [];
  cargasElectivas: CargaElectiva[] = [];
  isLoading = false;
  message = '';
  isError = false;
  formSubmitted = false;

  constructor(
    private docenteService: DocenteService,
    private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  @Input() modoEdicion: boolean = false;
  isEditing: boolean = false;
  idPreferenciaEditar: number | null = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.modoEdicion = true;
        this.idPreferenciaEditar = +params['id'];
        this.cargarPreferenciaParaEditar();
      }
      this.cargarDatos();
    });
  }

  createEmptyPreferencia(): any {
    return {
      idDocente: this.preferenciaData.idDocente,
      idAsignatura: 0,
      idCargaElectiva: 0
    };
  }

  addPreferencia(): void {
    this.preferenciasMultiples.preferencias.push(this.createEmptyPreferencia());
  }

  removePreferencia(index: number): void {
    if (this.preferenciasMultiples.preferencias.length > 1) {
      this.preferenciasMultiples.preferencias.splice(index, 1);
    }
  }

  toggleModo(): void {
    this.modoMultiple = !this.modoMultiple;
    if (this.modoMultiple && this.preferenciasMultiples.preferencias.length === 0) {
      this.preferenciasMultiples.preferencias = [this.createEmptyPreferencia()];
    }
  }

  cargarPreferenciaParaEditar() {
    this.docenteService.getPreferenciaById(this.idPreferenciaEditar!).subscribe({
      next: (response) => {
        this.preferenciaData = {
          idDocente: response.data.docente.idDocente,
          idAsignatura: response.data.asignatura.idAsignatura,
          idCargaElectiva: response.data.cargaElectiva.idCargaElectiva
        };
      },
      error: (err) => {
        console.error('Error cargando preferencia:', err);
        this.router.navigate(['/docente/gestionar-preferencia']);
      }
    });
  }

  cargarDatos(): void {
    this.isLoading = true;
    const user = this.authService.getCurrentUser();
    
    if (!user?.idUsuario) {
      this.mostrarMensaje('No se pudo identificar al docente', true);
      this.isLoading = false;
      return;
    }

    this.docenteService.getDocenteByUsuario(user.idUsuario).subscribe({
      next: (docente) => {
        this.preferenciaData.idDocente = docente.idDocente;
        this.preferenciasMultiples.preferencias.forEach(p => p.idDocente = docente.idDocente);
        
        // Cargar datos en paralelo
        Promise.all([
          this.docenteService.obtenerAsignaturas().toPromise(),
          this.docenteService.obtenerTodasCargasElectivas().toPromise()
        ]).then(([asignaturas, cargas]) => {
          this.asignaturas = asignaturas?.data?.map(a => ({
            idAsignatura: a.idAsignatura,
            codigo: a.codigo,
            nombre: a.nombre,
            enabled: a.enabled ?? true
          })) || [];
          
          this.cargasElectivas = cargas?.data || [];
          this.isLoading = false;
        }).catch(err => {
          this.manejarError('Error al cargar datos', err);
        });
      },
      error: (err) => this.manejarError('Error al obtener docente', err)
    });
  }

  submitForm(form: NgForm): void {
    this.formSubmitted = true;
    
    if (this.isEditing) {
      this.submitFormIndividual(form);
    } else if (this.modoMultiple) {
      this.submitFormMultiple(form);
    } else {
      this.submitFormIndividual(form);
    }
  }

  submitFormIndividual(form: NgForm): void {
    if (form.invalid) {
      this.mostrarMensaje('Complete todos los campos requeridos', true);
      return;
    }

    this.isLoading = true;

    if (this.modoEdicion && this.idPreferenciaEditar) {
      this.docenteService.actualizarPreferencia(
        this.idPreferenciaEditar,
        this.preferenciaData
      ).subscribe({
        next: () => {
          this.mostrarMensaje('Preferencia actualizada con éxito', false);
          setTimeout(() => this.router.navigate(['/docente/gestionar-preferencia']), 1500);
        },
        error: (err) => this.manejarError('Error al actualizar preferencia', err)
      });
    } else {
      this.docenteService.registrarPreferencia(this.preferenciaData).subscribe({
        next: () => {
          this.mostrarMensaje('Preferencia registrada con éxito', false);
          setTimeout(() => this.router.navigate(['/docente/gestionar-preferencia']), 1500);
        },
        error: (err) => this.manejarError('Error al registrar preferencia', err)
      });
    }
  }

  submitFormMultiple(form: NgForm): void {
    // Validar todas las preferencias
    for (const preferencia of this.preferenciasMultiples.preferencias) {
      if (!preferencia.idAsignatura || !preferencia.idCargaElectiva) {
        this.mostrarMensaje('Todas las preferencias deben estar completas', true);
        return;
      }
    }

    this.isLoading = true;
    
    this.docenteService.registrarPreferenciasMultiples({
      preferencias: this.preferenciasMultiples.preferencias
    }).subscribe({
      next: (response) => {
        const exitosas = response.data?.length || 0;
        this.mostrarMensaje(`${exitosas} preferencias registradas con éxito`, false);
        setTimeout(() => this.router.navigate(['/docente/gestionar-preferencia']), 1500);
      },
      error: (err) => this.manejarError('Error al registrar preferencias', err)
    });
  }

  private manejarError(mensaje: string, error: any): void {
    console.error(error);
    this.mostrarMensaje(`${mensaje}: ${error.error?.message || ''}`, true);
    this.isLoading = false;
  }

  private mostrarMensaje(mensaje: string, esError: boolean): void {
    this.message = mensaje;
    this.isError = esError;
    setTimeout(() => this.message = '', 5000);
  }
}