export interface DisponibilidadRequest {
  idDocente: number;
  idCicloAcademico: number;  
  diaSemana: string;
  horaInicio: string; 
  horaFin: string;    
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
  cicloAcademico: {  
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