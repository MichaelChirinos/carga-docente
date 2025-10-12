export interface AsignacionRequest {
  idDocente: number;
  idCurso: number;
  idCicloAcademico: number;
  idCarga: number;
}

export interface AsignacionResponse {
  status: number;
  message: string;
  data: {
    idAsignacion: number;
    docente: {
      idDocente: number;
      codigo: string;
      usuario: {
        nombre: string;
        apellido: string;
      };
    };
    curso: {
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
        enable: boolean | null;
      };
      cursoHorario: {
        idCursoHorario: number;
        tipoSesion: string;
        diaSemana: string;
        horaInicio: string;
        horaFin: string;
        duracionHoras: number;
        aula: any | null;
        enabled: boolean;
      }[];
      enabled: boolean;
    };
    cicloAcademico: {
      idCicloAcademico: number;
      nombre: string;
      enable: boolean | null;
    };
    algoritmo: any | null;
    createdAt: string;
    enabled: boolean;
  };
}