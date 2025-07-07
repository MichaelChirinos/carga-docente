export interface DirectorRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  cargo: string;
  idFacultad: number; // Nuevo campo requerido
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

export interface FacultadDirectorResponse {
  idFacultad: number;
  nombre: string;
}

export interface DirectorResponse {
  status: number;
  message: string;
  data: {
    email: string;
    idDirector: number;
    usuario: UsuarioResponse;
    cargo: string;
    enabled: boolean;
    facultad: FacultadDirectorResponse;
  };
}