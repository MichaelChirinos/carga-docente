export interface DirectorRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  idEscuela: number;  
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

export interface EscuelaResponse {
  idEscuela: number;
  nombre: string;
}

export interface DirectorData {
  idDirector: number;
  usuario: UsuarioResponse;
  escuela: EscuelaResponse;
  enabled: boolean;
}

export interface DirectorResponse {
  status: number;
  message: string;
  data: DirectorData;
}