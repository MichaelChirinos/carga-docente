export interface EspecializacionRequest {
  idAsignatura: number;
  idDocente: number;
}

export interface UsuarioEspecializacion {
  nombre: string;
  apellido: string;
}

export interface DocenteEspecializacion {
  idDocente: number;
  codigo: string;
  usuario: UsuarioEspecializacion;
}

export interface AsignaturaEspecializacion {
  idAsignatura: number;
  nombre: string;
}

export interface EspecializacionResponse {
  idEspecializacion: number;
  asignatura: AsignaturaEspecializacion;
  docente: DocenteEspecializacion;
  enabled: boolean;
}

export interface EspecializacionApiResponse {
  status: number;
  message: string;
  data: EspecializacionResponse;
}

export interface EspecializacionListResponse {
  status: number;
  message: string;
  data: EspecializacionResponse[];
}
export interface EspecializacionRequest {
  idAsignatura: number;
  idDocente: number;
}

// Interface extendida para mostrar en la lista
export interface EspecializacionRequestDisplay extends EspecializacionRequest {
  docenteNombre?: string;
  docenteCodigo?: string;
  asignaturaNombre?: string;
}