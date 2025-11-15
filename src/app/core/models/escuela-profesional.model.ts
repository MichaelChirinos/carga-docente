export interface EscuelaProfesionalRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
}

export interface EscuelaProfesionalResponse {
  status: number;
  message: string;
  data: {
    idEscuelaProfesional: number;
    usuario: {
      idUsuario: number;
      rol: {
        idRol: number;
        nombre: string;
        enabled: boolean;
      };
      email: string;
      enabled: boolean;
      codigo: string;
      nombre: string;
      apellido: string;
    };
    enabled: boolean;
  };
}

export interface EscuelaProfesionalListResponse {
  status: number;
  message: string;
  data: EscuelaProfesionalResponse['data'][];
}