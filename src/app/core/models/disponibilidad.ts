export interface DisponibilidadRequest {
  idDocente: number;
  idCargaElectiva: number;
  diaSemana: string;
  horaInicio: string; // Formato "HH:mm"
  horaFin: string;    // Formato "HH:mm"
}

export interface DisponibilidadResponse {
  status: number;
  message: string;
  data: {
    docente: {
      idDocente: number;
      usuario: {
        nombre: string;
        apellido: string;
      };
    };
    cargaElectiva: {
      idCargaElectiva: number;
      nombre: string;
    };
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    enabled: boolean;
  };
}

export interface PlanEstudioListResponse {
  status: number;
  message: string;
  data: {
    idPlanDeEstudio: number;
    facultad: {
      idFacultad: number;
      nombre: string;
    };
    codigo: number;
    nombre: string;
    enabled: boolean;
  }[];
}