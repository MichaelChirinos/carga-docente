export interface DisponibilidadRequest {
  idDocente: number;
  idCicloAcademico: number;  // CAMBIADO: de idCargaElectiva a idCicloAcademico
  diaSemana: string;
  horaInicio: string; // Formato "HH:mm"
  horaFin: string;    // Formato "HH:mm"
}

export interface DisponibilidadResponse {
  idDisponibilidad?: number;
  docente: {
    idDocente: number;
    codigo: string;
    usuario: {
      nombre: string;
      apellido: string;
    };
  };
  cicloAcademico: {  // CAMBIADO: de cargaElectiva a cicloAcademico
    idCicloAcademico: number;
    nombre: string;
  };
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  enabled: boolean;
}

export interface DisponibilidadApiResponse {
  status: number;
  message: string;
  data: DisponibilidadResponse;
}

export interface DisponibilidadListResponse {
  status: number;
  message: string;
  data: DisponibilidadResponse[];
}

export interface CicloAcademicoListResponse {
  status: number;
  message: string;
  data: {
    idCicloAcademico: number;
    nombre: string;
    enabled: boolean;
  }[];
}