import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocenteService } from '../../../core/services/docente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Dedicacion, Categoria, DocenteRequest } from '../../../core/models/docente.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-docente',
  templateUrl: './registrar-docente.component.html',
  styleUrls: ['./registrar-docente.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class RegistrarDocenteComponent implements OnInit {
  // Formulario para edición individual
  docenteForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.minLength(6)]),
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    idDedicacion: new FormControl<number | null>(null, Validators.required),
    idCategoria: new FormControl<number | null>(null, Validators.required),
    horasMaxLectivas: new FormControl(0, [Validators.required, Validators.min(1)]),
    tienePermisoExceso: new FormControl(false)
  });

  // Formulario para modo múltiple
  docentesMultiplesForm = this.fb.group({
    docentes: this.fb.array([])
  });

  dedicaciones: Dedicacion[] = [];
  categorias: Categoria[] = [];
  isEditing = false;
  idDocente: number | null = null;
  isLoading = false;
  message = '';
  isError = false;
  formSubmitted = false;

  constructor(
    private docenteService: DocenteService,
    public router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    if (params['id']) {
      this.isEditing = true;
      this.idDocente = +params['id'];
      this.cargarDocente();
    } else {
      this.agregarDocenteForm();
    }
    this.cargarDedicaciones();
    this.cargarCategorias();
  }

  get docentesArray(): FormArray {
    return this.docentesMultiplesForm.get('docentes') as FormArray;
  }

  agregarDocenteForm(): void {
    this.docentesArray.push(this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      idDedicacion: [null, Validators.required],
      idCategoria: [null, Validators.required],
      horasMaxLectivas: [0, [Validators.required, Validators.min(1)]],
      tienePermisoExceso: [false]
    }));
  }

  eliminarDocenteForm(index: number): void {
    this.docentesArray.removeAt(index);
  }

  private cargarDocente(): void {
    this.isLoading = true;
    this.docenteService.getDocenteById(this.idDocente!).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.data) {
          this.docenteForm.patchValue({
            email: response.data.usuario.email,
            password: '',
            nombre: response.data.usuario.nombre,
            apellido: response.data.usuario.apellido,
            idDedicacion: response.data.dedicacion.idDedicacion,
            idCategoria: response.data.categoria.idCategoria,
            horasMaxLectivas: response.data.horasMaxLectivas,
            tienePermisoExceso: response.data.tienePermisoExceso || false
          });
        } else {
          this.showMessage(response.message || 'Error al cargar docente', true);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar docente:', err);
        this.isLoading = false;
        this.showMessage('Error al cargar docente', true);
      }
    });
  }

  private cargarDedicaciones() {
    this.isLoading = true;
    this.docenteService.getDedicaciones().subscribe({
      next: (response: any) => {
        if (response.status === 200 && Array.isArray(response.data)) {
          this.dedicaciones = response.data;
        } else if (response.status === 200 && response.data) {
          // Si data no es array pero existe, intenta convertirlo
          this.dedicaciones = Array.isArray(response.data) ? response.data : [response.data];
        } else {
          console.error('Estructura de respuesta inesperada:', response);
          this.dedicaciones = [];
          this.showMessage('Error: Estructura de datos inesperada para dedicaciones', true);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
        this.showMessage('Error al cargar dedicaciones', true);
        this.dedicaciones = [];
      }
    });
  }

  private cargarCategorias() {
  this.isLoading = true;
  this.docenteService.getCategorias().subscribe({
    next: (response: any) => {
      console.log('Respuesta completa de categorías:', response); // Para debug
      
      if (response.status === 200 && Array.isArray(response.data)) {
        this.categorias = response.data;
      } else if (Array.isArray(response)) {
        this.categorias = response;
      } else if (response.data && Array.isArray(response.data)) {
        this.categorias = response.data;
      } else {
        console.error('Estructura de respuesta inesperada para categorías:', response);
        this.categorias = [];
        this.showMessage('Error: Estructura de datos inesperada para categorías', true);
      }
      console.log('Categorías cargadas:', this.categorias); 
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error al cargar categorías:', err);
      this.isLoading = false;
      this.showMessage('Error al cargar categorías', true);
      this.categorias = [];
    }
  });
}

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.isEditing) {
      this.actualizarDocente();
    } else {
      this.registrarDocentesMultiples();
    }
  }

  private actualizarDocente(): void {
    if (this.docenteForm.invalid) {
      this.marcarCamposComoTocados(this.docenteForm);
      this.showMessage('Por favor complete todos los campos requeridos', true);
      return;
    }

    const formValue = this.docenteForm.value;
    const docenteRequest: DocenteRequest = {
      email: formValue.email ?? '',
      password: formValue.password ?? '',
      nombre: formValue.nombre ?? '',
      apellido: formValue.apellido ?? '',
      idDedicacion: Number(formValue.idDedicacion),
      idCategoria: Number(formValue.idCategoria),
      horasMaxLectivas: Number(formValue.horasMaxLectivas),
      tienePermisoExceso: formValue.tienePermisoExceso ?? false
    };

    this.isLoading = true;
    this.docenteService.actualizarDocente(this.idDocente!, docenteRequest).subscribe({
      next: (response: any) => {
        if (response.status === 200) {
          this.showMessage('Docente actualizado con éxito', false);
          setTimeout(() => this.router.navigate(['/jefe-departamento/gestionar-docentes']), 1500);
        } else {
          this.showMessage(response.message || 'Error al actualizar docente', true);
          this.isLoading = false;
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.message || 'No se pudo actualizar el docente';
        this.showMessage(`Error: ${errorMsg}`, true);
        this.isLoading = false;
      }
    });
  }

  private registrarDocentesMultiples(): void {
    // Marcar todos los campos como tocados para mostrar errores
    this.docentesArray.controls.forEach(control => {
      if (control instanceof FormGroup) {
        this.marcarCamposComoTocados(control);
      }
    });

    if (this.docentesMultiplesForm.invalid) {
      this.showMessage('Por favor complete todos los campos requeridos para todos los docentes', true);
      return;
    }

    const docentesRequest = this.docentesArray.value.map((docente: any) => ({
      email: docente.email,
      password: docente.password,
      nombre: docente.nombre,
      apellido: docente.apellido,
      idDedicacion: Number(docente.idDedicacion),
      idCategoria: Number(docente.idCategoria),
      horasMaxLectivas: Number(docente.horasMaxLectivas),
      tienePermisoExceso: docente.tienePermisoExceso ?? false
    }));

    this.isLoading = true;
    this.docenteService.registrarDocentesMultiples(docentesRequest).subscribe({
      next: (response: any) => {
        if (response.status === 201 || response.status === 200) {
          this.showMessage(response.message || 'Docentes registrados con éxito', false);
          setTimeout(() => this.router.navigate(['/jefe-departamento/gestionar-docentes']), 1500);
        } else {
          this.showMessage(response.message || 'Error al registrar docentes', true);
          this.isLoading = false;
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.message || 'No se pudieron registrar los docentes';
        this.showMessage(`Error: ${errorMsg}`, true);
        this.isLoading = false;
      }
    });
  }

  private marcarCamposComoTocados(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.marcarCamposComoTocados(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}