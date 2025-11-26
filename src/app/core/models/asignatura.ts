export interface AsignaturaRequest {
  nombre: string;
}

export interface AsignaturaResponse {
  status: number;
  message: string;
  data: {
    idAsignatura: number;
    codigo: string;
    nombre: string;
    enabled: boolean;
  }[]; 
}