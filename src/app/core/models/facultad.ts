export interface FacultadRequest {
  nombre: string;
}

export interface FacultadResponse {
  status: number;
  message: string;
  data: {
    idFacultad: number;
    nombre: string;
    enabled: boolean;
  }[];
}