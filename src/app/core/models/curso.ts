export interface CursoBase {
  idAsignatura: number;
  planDeEstudios: string[];  // CAMBIADO: array de strings
  idEscuela: number;
  idCicloAcademico: number;
  ciclo: number;  // AGREGADO
  grupo: string;
}

export interface HorarioRequest {
  tipoSesion: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  duracionHoras: number;
  idAula?: number;  // OPCIONAL: según el JSON de ejemplo no viene
}

export interface CursoRequest extends CursoBase {
  horarios: HorarioRequest[];  // CAMBIADO: de 'cursoHorario' a 'horarios'
}

// Si necesitas una interface individual, sería igual
export interface CursoIndividualRequest extends CursoBase {
  horarios: HorarioRequest[];
}

// Interfaces para la respuesta
export interface AulaResponse {
  idAula: number;
  tipo: string;
  nombre: string | null;
  enabled: boolean;
}

export interface HorarioResponse {
  idHorario: number;  // CAMBIADO: de 'idCursoHorario' a 'idHorario'
  tipoSesion: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  duracionHoras: number;
  aula: AulaResponse | null;  // según JSON puede ser null
  enabled: boolean;
}

export interface CursoData {
  idCurso: number;
  codigo: string;
  grupo: string;
  ciclo: number;  // AGREGADO
  asignatura: {
    idAsignatura: number;
    nombre: string;
    codigo: string;
  };
  planDeEstudios: string[];  // CAMBIADO: array de strings
  escuela: {
    idEscuela: number;
    nombre: string;
  };
  cicloAcademico: {
    idCicloAcademico: number;
    nombre: string;
    enabled: boolean;
  };
  horarios: HorarioResponse[];  // CAMBIADO: de 'cursoHorario' a 'horarios'
  enabled: boolean;
}

export interface CursoResponse {
  status: number;
  message: string;
  data: CursoData;
}

export interface CursoListResponse {
  status: number;
  message: string;
  data: CursoData[];
}