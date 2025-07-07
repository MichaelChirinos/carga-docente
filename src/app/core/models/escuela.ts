export interface EscuelaRequest {
  nombre: string;
  idFacultad: number;
}

export interface FacultadResponse {
  idFacultad: number;
  nombre: string;
}

export interface EscuelaResponse {
  status: number;
  message: string;
  data: {
    idEscuela: number;
    codigo: string;
    nombre: string;
    facultad: FacultadResponse;
    enabled: boolean;
  };
}