export interface EscuelaRequest {
  nombre: string;
}

export interface EscuelaResponse {
  status: number;
  message: string;
  data: {
    idEscuela: number;
    codigo: string;
    nombre: string;
    enabled: boolean;
  };
}