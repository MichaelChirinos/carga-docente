import { Component, Input, OnInit } from '@angular/core';
import { DocenteService } from '../../../core/services/docente.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PreferenciaRequest, PreferenciaBaseRequest } from '../../../core/models/preferencia.model';
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
  templateUrl: './registrar-preferencia.component.html'
})
export class RegistrarPreferenciaComponent implements OnInit {
  modoMultiple = false;
  preferenciaData: PreferenciaRequest = {
    idDocente: 0,
    idAsignatura: 0,
    idCicloAcademico: 0
  };

  preferenciasMultiples: { preferencias: PreferenciaBaseRequest[] } = {
    preferencias: [this.createEmptyPreferencia()]
  };

  asignaturas: AsignaturaSelect[] = [];
  ciclosAcademicos: any[] = [];
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
        this.isEditing = true;
        this.idPreferenciaEditar = +params['id'];
        this.cargarPreferenciaParaEditar();
      }
      this.cargarDatos();
    });
  }

  createEmptyPreferencia(): PreferenciaBaseRequest {
    return {
      idDocente: this.preferenciaData.idDocente,
      idAsignatura: 0,
      idCicloAcademico: 0
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
    if (!this.idPreferenciaEditar) return;
    
    // NOTA: Necesitarás implementar getPreferenciaById en el servicio
    this.docenteService.getPreferenciaById(this.idPreferenciaEditar).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.preferenciaData = {
            idDocente: response.data.docente.idDocente,
            idAsignatura: response.data.asignatura.idAsignatura,
            idCicloAcademico: response.data.cicloAcademico.idCicloAcademico
          };
        }
      },
      error: (err) => {
        console.error('Error cargando preferencia:', err);
        this.mostrarMensaje('Error al cargar la preferencia', true);
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

    // Obtener el docente actual
    this.docenteService.getDocenteByUsuario(user.idUsuario).subscribe({
      next: (docente: any) => {
        this.preferenciaData.idDocente = docente.idDocente;
        this.preferenciasMultiples.preferencias.forEach(p => p.idDocente = docente.idDocente);
        
        // Cargar asignaturas y ciclos académicos
        this.cargarAsignaturas();
        this.cargarCiclosAcademicos();
      },
      error: (err) => this.manejarError('Error al obtener docente', err)
    });
  }

  cargarAsignaturas(): void {
    this.docenteService.obtenerAsignaturas().subscribe({
      next: (response: any) => {
        if (response.status === 200 && Array.isArray(response.data)) {
          this.asignaturas = response.data.map((a: any) => ({
            idAsignatura: a.idAsignatura,
            codigo: a.codigo,
            nombre: a.nombre,
            enabled: a.enabled ?? true
          }));
        } else {
          this.mostrarMensaje('Error al cargar asignaturas', true);
        }
      },
      error: (err) => this.manejarError('Error al cargar asignaturas', err)
    });
  }

  cargarCiclosAcademicos(): void {
    this.docenteService.obtenerCiclosAcademicos().subscribe({
      next: (response: any) => {
        if (response.status === 200 && Array.isArray(response.data)) {
          this.ciclosAcademicos = response.data;
          this.isLoading = false;
        } else {
          this.mostrarMensaje('Error al cargar ciclos académicos', true);
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.manejarError('Error al cargar ciclos académicos', err);
        this.isLoading = false;
      }
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

    // Validaciones adicionales
    if (!this.preferenciaData.idAsignatura || !this.preferenciaData.idCicloAcademico) {
      this.mostrarMensaje('Seleccione una asignatura y un ciclo académico', true);
      return;
    }

    this.isLoading = true;

    if (this.isEditing && this.idPreferenciaEditar) {
      // Actualizar preferencia existente
      this.docenteService.actualizarPreferencia(
        this.idPreferenciaEditar,
        this.preferenciaData
      ).subscribe({
        next: (response: any) => {
          this.mostrarMensaje(response.message || 'Preferencia actualizada con éxito', false);
          setTimeout(() => this.router.navigate(['/docente/gestionar-preferencia']), 1500);
        },
        error: (err) => this.manejarError('Error al actualizar preferencia', err)
      });
    } else {
      // Registrar nueva preferencia
      this.docenteService.registrarPreferencia(this.preferenciaData).subscribe({
        next: (response: any) => {
          this.mostrarMensaje(response.message || 'Preferencia registrada con éxito', false);
          setTimeout(() => this.router.navigate(['/docente/gestionar-preferencia']), 1500);
        },
        error: (err) => this.manejarError('Error al registrar preferencia', err)
      });
    }
  }

  submitFormMultiple(form: NgForm): void {
    // Validar todas las preferencias
    const preferenciasInvalidas = this.preferenciasMultiples.preferencias.filter(
      p => !p.idAsignatura || !p.idCicloAcademico
    );

    if (preferenciasInvalidas.length > 0) {
      this.mostrarMensaje('Todas las preferencias deben estar completas', true);
      return;
    }

    this.isLoading = true;
    
    // Registrar preferencias una por una
    this.registrarPreferenciasIndividualmente(this.preferenciasMultiples.preferencias);
  }

  // Método para registrar preferencias individualmente
  private registrarPreferenciasIndividualmente(preferencias: PreferenciaBaseRequest[]): void {
    const registros = preferencias.map(preferencia => 
      this.docenteService.registrarPreferencia(preferencia).toPromise()
    );

    Promise.all(registros).then(results => {
      this.isLoading = false;
      const exitosos = results.filter(r => r?.status === 201 || r?.status === 200).length;
      const total = preferencias.length;
      
      if (exitosos === total) {
        this.mostrarMensaje(`${exitosos} preferencias registradas con éxito`, false);
      } else {
        this.mostrarMensaje(`${exitosos} de ${total} preferencias registradas con éxito`, false);
      }
      
      setTimeout(() => this.router.navigate(['/docente/gestionar-preferencia']), 1500);
    }).catch(err => {
      this.manejarError('Error al registrar preferencias', err);
    });
  }

  private manejarError(mensaje: string, error: any): void {
    console.error(error);
    const errorMsg = error.error?.message || error.message || '';
    this.mostrarMensaje(`${mensaje}: ${errorMsg}`, true);
    this.isLoading = false;
  }

  private mostrarMensaje(mensaje: string, esError: boolean): void {
    this.message = mensaje;
    this.isError = esError;
    setTimeout(() => this.message = '', 5000);
  }

  // Helper para obtener nombre del ciclo académico
  getCicloNombre(idCiclo: number): string {
    const ciclo = this.ciclosAcademicos.find(c => c.idCicloAcademico === idCiclo);
    return ciclo ? ciclo.nombre : 'Ciclo no encontrado';
  }

  // Helper para obtener nombre de la asignatura
  getAsignaturaNombre(idAsignatura: number): string {
    const asignatura = this.asignaturas.find(a => a.idAsignatura === idAsignatura);
    return asignatura ? `${asignatura.nombre} (${asignatura.codigo})` : 'Asignatura no encontrada';
  }
}