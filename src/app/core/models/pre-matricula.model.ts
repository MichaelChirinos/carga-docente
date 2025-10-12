export interface PreMatriculaRequest {
  idCicloAcademico: number;
  idAsignatura: number;
  cantidad: number;
}

export interface AsignaturaResponse {
  idAsignatura: number;
  codigo: string;
  nombre: string;
  enabled: boolean;
}

export interface CicloAcademicoResponse {
  idCicloAcademico: number;
  nombre: string;
}
export interface PreMatriculaConNombres extends PreMatriculaRequest {
  cicloNombre: string;
  asignaturaNombre: string;
}
export interface PreMatriculaResponse {
  idPreMatricula: number;
  asignatura: AsignaturaResponse;
  cicloAcademico: CicloAcademicoResponse;
  cantidad: number;
  enabled: boolean;
}

export interface PreMatriculaApiResponse {
  status: number;
  message: string;
  data: PreMatriculaResponse;
}

export interface PreMatriculaListResponse {
  status: number;
  message: string;
  data: PreMatriculaResponse[];
}