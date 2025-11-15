// Interfaces base
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
  codigo: string; // ← Agregado basado en el JSON
}

export interface EspecializacionResponse {
  idEspecializacion: number;
  asignatura: AsignaturaEspecializacion;
  docente?: DocenteEspecializacion;
  enabled: boolean;
}

// Request interfaces
export interface EspecializacionRequest {
  idAsignatura: number;
  idDocente: number;
}

// Response wrappers
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

// Para display en tablas/lists
export interface EspecializacionDisplay {
  idEspecializacion?: number;  
  idAsignatura: number;
  idDocente: number;
  docenteNombre?: string;      
  docenteCodigo?: string;      
  asignaturaNombre?: string;   
  asignaturaCodigo?: string;   
  enabled?: boolean;           
}