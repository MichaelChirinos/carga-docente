export interface AulaRequest {
  tipo: string;
  nombre: string;  
  piso: number;
  capacidad: number;
  numeroEquipos?: number; 
  estado: string;
}

export interface AulaResponse {
  idAula: number;
  tipo: string;
  nombre: string;  
  piso: number;
  capacidad: number;
  numeroEquipos: number | null;
  estado: string;
  enabled: boolean;
}


export interface AulaApiResponse {
  status: number;
  message: string;
  data: AulaResponse;
}

export enum Tipo {
  TEORIA = 'TEORIA',
  LABORATORIO = 'LABORATORIO'
}

export enum EstadoAula {
  DISPONIBLE = 'DISPONIBLE',
  OCUPADO = 'OCUPADO',
  MANTENIMIENTO = 'MANTENIMIENTO'
}