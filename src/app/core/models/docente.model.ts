// docente.model.ts
import { Usuario } from './usuario.model';

export interface Dedicacion {
  idDedicacion: number;
  nombre: string;
  horasTotales: number;
  horasMinLectivas: number;
  horasMaxLectivas: number;  // FALTABA ESTE CAMPO
  enabled?: boolean;
}

export interface DedicacionRequest {
  nombre: string;
  horasTotales: number;
  horasMinLectivas: number;
  horasMaxLectivas: number;
  enabled?: boolean;
}

export interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion?: string | null;  // Hacerla opcional y aceptar null
  enabled: boolean;
}

export type CategoriaRequest = Omit<Categoria, 'idCategoria'>;

export interface Docente {
  idDocente: number;
  usuario: Usuario;
  dedicacion: Dedicacion;
  categoria: Categoria;
  horasMaxLectivas: number;
  tienePermisoExceso: boolean;
  createdAt: string;
  enabled: boolean;
  codigo: string;     

}

export interface DocenteListResponse {
  status: number;
  message: string;
  data: Docente[];
}

export interface DocenteRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  idDedicacion: number;
  idCategoria: number;
  horasMaxLectivas: number;
  tienePermisoExceso?: boolean;
}

// En tu archivo de modelos (puede ser docente.model.ts o uno nuevo)

export interface CursoHorario {
  idCursoHorario: number;
  tipoSesion: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  duracionHoras: number;
  enabled: boolean;
}

export interface Asignatura {
  idAsignatura: number;
  nombre: string;
}

export interface PlanDeEstudio {
  idPlanDeEstudio: number;
  nombre: string;
}

export interface Escuela {
  idEscuela: number;
  nombre: string;
}

export interface Curso {
  idCurso: number;
  asignatura: Asignatura;
  planDeEstudio: PlanDeEstudio;
  escuela: Escuela;
  cursoHorario: CursoHorario[];
  enabled: boolean;
}

export interface Asignacion {
  curso: Curso;
  enabled: boolean;
}

export interface DocenteAsignaciones {
  idDocente: number;
  codigo: string;
  usuario: {
    nombre: string;
    apellido: string;
  };
  asignaciones: Asignacion[];
  enabled: boolean;
}

export interface DocentesAsignacionesResponse {
  status: number;
  message: string;
  data: DocenteAsignaciones[];
}