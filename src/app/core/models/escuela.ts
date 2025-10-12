// escuela.model.ts
export interface EscuelaRequest {
  nombre: string;
  // Elimina facultad si no se usa
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