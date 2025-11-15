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

interface EscuelaSelect {
  idEscuela: number;
  nombre: string;
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
    idCicloAcademico: 0,
    idEscuela: 0
  };

  preferenciasMultiples: { preferencias: PreferenciaBaseRequest[] } = {
    preferencias: [this.createEmptyPreferencia()]
  };

  asignaturas: AsignaturaSelect[] = [];
  ciclosAcademicos: any[] = [];
  escuelas: EscuelaSelect[] = [];
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
      idCicloAcademico: 0,
      idEscuela: 0
    };
  }

  cargarEscuelas(): void {
    this.docenteService.obtenerEscuelas().subscribe({
      next: (response: any) => {
        if (response.status === 200 && Array.isArray(response.data)) {
          this.escuelas = response.data;
        }
      },
      error: (err) => {
        console.error('Error cargando escuelas:', err);
      }
    });
  }

  cargarPreferenciaParaEditar() {
    if (!this.idPreferenciaEditar) return;
    
    this.isLoading = true;
    this.docenteService.getPreferenciaById(this.idPreferenciaEditar).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          const data = response.data;
          this.preferenciaData = {
            idDocente: data.docente.idDocente,
            idAsignatura: data.asignatura.idAsignatura,
            idCicloAcademico: data.cicloAcademico.idCicloAcademico,
            idEscuela: data.escuela.idEscuela
          };
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando preferencia:', err);
        this.mostrarMensaje('Error al cargar la preferencia', true);
        this.isLoading = false;
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
      next: (docente: any) => {
        this.preferenciaData.idDocente = docente.idDocente;
        this.preferenciasMultiples.preferencias.forEach(p => p.idDocente = docente.idDocente);
        
        this.cargarAsignaturas();
        this.cargarCiclosAcademicos();
        this.cargarEscuelas();
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
        } else {
          this.mostrarMensaje('Error al cargar ciclos académicos', true);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.manejarError('Error al cargar ciclos académicos', err);
        this.isLoading = false;
      }
    });
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

    if (!this.preferenciaData.idAsignatura || !this.preferenciaData.idCicloAcademico || !this.preferenciaData.idEscuela) {
      this.mostrarMensaje('Seleccione todos los campos requeridos', true);
      return;
    }

    this.isLoading = true;

    if (this.isEditing && this.idPreferenciaEditar) {
      this.docenteService.actualizarPreferencia(
        this.idPreferenciaEditar,
        this.preferenciaData
      ).subscribe({
        next: (response: any) => {
          this.mostrarMensaje(response.message || 'Preferencia actualizada con éxito', false);
          setTimeout(() => this.router.navigate(['/Docente/gestionar-preferencia']), 1500);
        },
        error: (err) => this.manejarError('Error al actualizar preferencia', err)
      });
    } else {
      this.docenteService.registrarPreferencia(this.preferenciaData).subscribe({
        next: (response: any) => {
          this.mostrarMensaje(response.message || 'Preferencia registrada con éxito', false);
          setTimeout(() => this.router.navigate(['/Docente/gestionar-preferencia']), 1500);
        },
        error: (err) => this.manejarError('Error al registrar preferencia', err)
      });
    }
  }

  submitFormMultiple(form: NgForm): void {
    const preferenciasInvalidas = this.preferenciasMultiples.preferencias.filter(
      p => !p.idAsignatura || !p.idCicloAcademico || !p.idEscuela
    );

    if (preferenciasInvalidas.length > 0) {
      this.mostrarMensaje('Todas las preferencias deben estar completas', true);
      return;
    }

    this.isLoading = true;
    this.registrarPreferenciasIndividualmente(this.preferenciasMultiples.preferencias);
  }

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
      
      setTimeout(() => this.router.navigate(['/Docente/gestionar-preferencia']), 1500);
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

  todasPreferenciasCompletas(): boolean {
    return this.preferenciasMultiples.preferencias.every(preferencia => 
      !!preferencia.idAsignatura && 
      !!preferencia.idCicloAcademico && 
      !!preferencia.idEscuela
    );
  }

  getEscuelaNombre(idEscuela: number): string {
    const escuela = this.escuelas.find(e => e.idEscuela === idEscuela);
    return escuela ? escuela.nombre : 'Escuela no encontrada';
  }

  getCicloNombre(idCiclo: number): string {
    const ciclo = this.ciclosAcademicos.find(c => c.idCicloAcademico === idCiclo);
    return ciclo ? ciclo.nombre : 'Ciclo no encontrado';
  }

  getAsignaturaNombre(idAsignatura: number): string {
    const asignatura = this.asignaturas.find(a => a.idAsignatura === idAsignatura);
    return asignatura ? `${asignatura.nombre} (${asignatura.codigo})` : 'Asignatura no encontrada';
  }
}