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
    password: new FormControl('', [Validators.minLength(6)]), // No requerido en edición
    nombre: new FormControl('', Validators.required),
    apellido: new FormControl('', Validators.required),
    idDedicacion: new FormControl<number | null>(null, Validators.required),
    idCategoria: new FormControl<number | null>(null, Validators.required),
    horasMaxLectivas: new FormControl(0, [Validators.required, Validators.min(1)]),
    tienePermisoExceso: new FormControl(false)
  });

  // Formulario para modo múltiple (solo creación)
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
      // Solo para nuevo registro: agregar primer formulario
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
      next: (response) => {
        this.docenteForm.patchValue({
          email: response.data.usuario.email,
          password: '', // No mostramos la contraseña
          nombre: response.data.usuario.nombre,
          apellido: response.data.usuario.apellido,
          idDedicacion: response.data.dedicacion.idDedicacion,
          idCategoria: response.data.categoria.idCategoria,
          horasMaxLectivas: response.data.horasMaxLectivas,
          tienePermisoExceso: response.data.tienePermisoExceso
        });
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
      next: (data) => {
        this.dedicaciones = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading = false;
        this.showMessage('Error al cargar dedicaciones', true);
      }
    });
  }

  private cargarCategorias() {
    this.isLoading = true;
    this.docenteService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.isLoading = false;
        this.showMessage('Error al cargar categorías', true);
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
      this.showMessage('Por favor complete todos los campos requeridos', true);
      return;
    }

    const formValue = this.docenteForm.value;
    const docenteRequest: DocenteRequest = {
      email: formValue.email ?? '',
      password: formValue.password ?? '', // Opcional en actualización
      nombre: formValue.nombre ?? '',
      apellido: formValue.apellido ?? '',
      idDedicacion: Number(formValue.idDedicacion),
      idCategoria: Number(formValue.idCategoria),
      horasMaxLectivas: Number(formValue.horasMaxLectivas),
      tienePermisoExceso: formValue.tienePermisoExceso ?? false
    };

    this.isLoading = true;
    this.docenteService.actualizarDocente(this.idDocente!, docenteRequest).subscribe({
      next: () => {
        this.showMessage('Docente actualizado con éxito', false);
        setTimeout(() => this.router.navigate(['/director/gestionar-docentes']), 1500);
      },
      error: (err) => {
        this.showMessage(`Error: ${err.error?.message || 'No se pudo actualizar el docente'}`, true);
        this.isLoading = false;
      }
    });
  }

  private registrarDocentesMultiples(): void {
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
      next: (response) => {
        this.showMessage(response.message || 'Docentes registrados con éxito', false);
        setTimeout(() => this.router.navigate(['/director/gestionar-docentes']), 1500);
      },
      error: (err) => {
        this.showMessage(`Error: ${err.error?.message || 'No se pudieron registrar los docentes'}`, true);
        this.isLoading = false;
      }
    });
  }

  private showMessage(msg: string, isError: boolean): void {
    this.message = msg;
    this.isError = isError;
    setTimeout(() => this.message = '', 5000);
  }
}