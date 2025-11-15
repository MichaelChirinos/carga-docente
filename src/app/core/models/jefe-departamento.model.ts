export interface JefeDepartamentoRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  cargo: string;
}

export interface UsuarioResponse {
  idUsuario: number;
  idRol: number;
  email: string;
  enabled: boolean;
  codigo: string;
  nombre: string;
  apellido: string;
}

export interface JefeDepartamentoResponse {
  idJefeDepartamento: number;
  usuario: UsuarioResponse;
  cargo: string;
  enabled: boolean;
}

export interface JefeDepartamentoApiResponse {
  status: number;
  message: string;
  data: JefeDepartamentoResponse;
}