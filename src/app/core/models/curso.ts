export interface CursoBase {
  idAsignatura: number;
  idPlanDeEstudio: number;
  idEscuela: number;
  idCicloAcademico: number;
  grupo: string;
}

export interface CursoRequest extends CursoBase {
  cursoHorario: {
    tipoSesion: string;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    aula: string;
    duracionHoras: number;
  }[];
}

export interface CursoIndividualRequest extends CursoBase {
  tipoSesion: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  aula: string;
  duracionHoras: number;
}

export interface CursoResponse {
  status: number;
  message: string;
  data: {
    idCurso: number;
    asignatura: {
      idAsignatura: number;
      nombre: string;
    };
    planDeEstudio: {
      idPlanDeEstudio: number;
      nombre: string;
    };
    escuela: {
      idEscuela: number;
      nombre: string;
    };
    cicloAcademico: {
      idCicloAcademico: number;
      nombre: string;
    };
    grupo: string;
    tipoSesion: string;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    aula: string;
    duracionHoras: number;
    enabled: boolean;
  };
}