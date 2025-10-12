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
    idAula: number; // CAMBIADO: de 'aula' a 'idAula'
    duracionHoras: number;
  }[];
}

export interface CursoIndividualRequest extends CursoBase {
  cursoHorario: {
    tipoSesion: string;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    idAula: number; // CAMBIADO: de 'aula' a 'idAula'
    duracionHoras: number;
  }[];
}

export interface CursoResponse {
  status: number;
  message: string;
  data: {
    idCurso: number;
    codigo: string;
    grupo: string;
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
    cursoHorario: {
      idCursoHorario: number;
      tipoSesion: string;
      diaSemana: string;
      horaInicio: string;
      horaFin: string;
      duracionHoras: number;
      aula: {  // Esto queda igual porque es la respuesta del API
        idAula: number;
        tipo: string;
        nombre: string | null;
        enabled: boolean;
      };
      enabled: boolean;
    }[];
    enabled: boolean;
  };
}