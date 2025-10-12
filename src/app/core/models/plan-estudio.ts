export interface PlanEstudioRequest {
  nombre: string;
}

export interface PlanEstudioResponse {
  status: number;
  message: string;
  data: {
    idPlanDeEstudio: number;
    codigo: number;
    nombre: string;
    enabled: boolean;
  };
}