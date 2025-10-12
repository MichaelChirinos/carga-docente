export interface LogisticaRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  cargo: string;
}

export interface UsuarioLogistica {
  idUsuario: number;
  idRol: number;
  email: string;
  enabled: boolean;
  codigo: string;
  nombre: string;
  apellido: string;
}

export interface LogisticaResponse {
  idLogistica: number;
  usuario: UsuarioLogistica;
  cargo: string;
  enabled: boolean;
}

export interface LogisticaApiResponse {
  status: number;
  message: string;
  data: LogisticaResponse;
}