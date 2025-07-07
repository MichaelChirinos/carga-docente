export interface PlanEstudioRequest {
  idFacultad: number;
  nombre: string;
}

export interface PlanEstudioResponse {
  status: number;
  message: string;
  data: {
    idPlanDeEstudio: number;
    facultad: {
      idFacultad: number;
      nombre: string;
    };
    codigo: number;
    nombre: string;
    enabled: boolean;
  };
}