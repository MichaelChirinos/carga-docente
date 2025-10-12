export interface AulaRequest {
  tipo: string;
  nombre: string;  // Cambiado de codigo a nombre
  piso: number;
  capacidad: number;
  numeroEquipos?: number; // El backend lo maneja como null para TEORIA
  estado: string;
}

export interface AulaResponse {
  idAula: number;
  tipo: string;
  nombre: string;  // Cambiado de codigo a nombre
  piso: number;
  capacidad: number;
  numeroEquipos: number | null;
  estado: string;
  enabled: boolean;
}

// Los demás interfaces y enums se mantienen igual

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